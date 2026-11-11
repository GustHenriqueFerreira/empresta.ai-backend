// Infra exclusivamente de teste: container novo sem volume externo, porta loopback.
// Não lê .env/DATABASE_URL nem seleciona containers existentes.
import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { Pool } from 'pg'
const docker=(args)=>execFileSync('docker',args,{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:45000}).trim()
export async function iniciarIsolado(){
  const nome='emprestai-teste-'+randomUUID().slice(0,12)
  let pool
  const encerrar=async()=>{
    await pool?.end()
    const label=docker(['inspect','--format','{{index .Config.Labels "emprestai.ambiente"}}',nome])
    if(label!=='teste-descartavel')throw new Error('Container não pertence ao teste')
    docker(['stop','-t','2',nome]) // --rm remove somente este container descartável.
  }
  docker(['run','--detach','--rm','--pull=never','--name',nome,'--label','emprestai.ambiente=teste-descartavel',
    '-e','POSTGRES_HOST_AUTH_METHOD=trust','-p','127.0.0.1::5432','--tmpfs','/var/lib/postgresql/data','postgres:16'])
  try{
    let pronto=false
    for(let n=0;n<100;n++){
      try{docker(['exec',nome,'pg_isready','-h','127.0.0.1','-U','postgres']);pronto=true;break}catch{await new Promise(r=>setTimeout(r,200))}
    }
    if(!pronto)throw new Error('PostgreSQL isolado não ficou pronto')
    const porta=docker(['port',nome,'5432/tcp']).match(/^127\.0\.0\.1:(\d+)$/m)?.[1]
    if(!porta)throw new Error('Porta não está restrita a loopback')
    const config={host:'127.0.0.1',port:Number(porta),user:'postgres',database:'postgres',ssl:false,max:8,connectionTimeoutMillis:5000}
    pool=new Pool(config)
    await pool.query(`create role anon; create role authenticated; create role service_role;
      create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb,email_confirmed_at timestamptz);
      create function auth.uid() returns uuid language sql stable as $$ select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;
      grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
    for(const file of ['../db/001-schema-inicial.sql','../db/002-integracao.sql','../db/pratica/entrega-3/001-imagens.sql']) await pool.query(fs.readFileSync(new URL(file,import.meta.url),'utf8'))
    return {pool,config,nome,encerrar}
  }catch(e){await encerrar();throw e}
}
export async function comoUsuario(pool,id,fn){
  const c=await pool.connect()
  try{await c.query('begin');await c.query('set local role authenticated');await c.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:id,role:'authenticated'})]);const result=await fn(c);await c.query('commit');return result}
  catch(e){await c.query('rollback');throw e}finally{c.release()}
}
