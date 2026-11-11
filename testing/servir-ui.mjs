// Jornada local com App/SDK/AuthGuard/serviço/Prisma reais e Auth sintético.
// Nunca importa bootstrap de produção, .env ou credenciais. Só loopback e Docker próprio.
import 'reflect-metadata'
import http from 'node:http'
import net from 'node:net'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { createHmac,randomUUID } from 'node:crypto'
import { Module,ConflictException,HttpException,ServiceUnavailableException } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { iniciarIsolado } from './postgres-isolado.mjs'
// Uma única identidade CJS para os tokens de DI dos fontes TypeScript.
const require=createRequire(import.meta.url)
const {AppController,HealthController}=require('../src/app.controller.ts')
const {AppService}=require('../src/app.service.ts')
const {DatabaseService}=require('../src/database.service.ts')
const {AuthGuard}=require('../src/auth.guard.ts')
const {errosNegocio}=require('../src/contracts.ts')
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..')
const material=path.join(root,'backend/db/pratica/entrega-3/material')
const itens=JSON.parse(fs.readFileSync(path.join(material,'plano.json'),'utf8')).equipamentos
const usuarios=[['11111111-1111-4111-8111-111111111111','pessoa.a@example.invalid','Pessoa A'],['22222222-2222-4222-8222-222222222222','pessoa.b@example.invalid','Pessoa B']]
const ambiente=await iniciarIsolado(),pool=ambiente.pool
let erro=false,expirada=false,app,vite,parando=false
const prisma=new PrismaClient({adapter:new PrismaPg(ambiente.config),log:[]})
async function preparar(){
 await pool.query('truncate public.emprestimos,public.equipamentos_imagens,public.equipamentos,public.profiles,auth.users cascade')
 for(const [id,email,nome]of usuarios)await pool.query('insert into auth.users(id,email,raw_user_meta_data,email_confirmed_at) values($1,$2,$3,now())',[id,email,JSON.stringify({nome})])
 for(let i=0;i<12;i++){
  const id=randomUUID(),item=itens[i],registro=item.imagem
  await pool.query('insert into public.equipamentos(id,nome,categoria,patrimonio,situacao) values($1,$2,$3,$4,$5)',[id,item.nome,item.categoria,item.patrimonio,item.situacao])
  await pool.query("insert into public.equipamentos_imagens values($1,'equipamentos-pratica',$2,800,600,$3,'pixabay',$4,$5,$6,$7,$8,$9,$10)",[id,registro.caminho,registro.sha256,registro.foto_id,registro.pagina_origem,registro.autor,registro.autor_id,registro.licenca_url,registro.origem_arquivo,registro.obtida_em])
 }
 for(let n=1;n<=3;n++)await pool.query("insert into public.equipamentos(nome,categoria,patrimonio) values('Demonstração local','Cabo',$1)",['DEMO-'+n])
}
await preparar()
function usuario(u){return{id:u[0],aud:'authenticated',role:'authenticated',email:u[1],email_confirmed_at:new Date().toISOString(),app_metadata:{provider:'email',providers:['email']},user_metadata:{nome:u[2]},created_at:new Date().toISOString()}}
const tokens=new Map()
function sessao(u){
 const exp=Math.floor(Date.now()/1000)+3600,header=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')
 const claims=Buffer.from(JSON.stringify({sub:u[0],aud:'authenticated',role:'authenticated',exp,iat:exp-3600})).toString('base64url')
 const prefix=header+'.'+claims,t=prefix+'.'+createHmac('sha256','fixture-local-sem-validade-externa').update(prefix).digest('base64url')
 tokens.set(t,u);return{access_token:t,token_type:'bearer',expires_in:3600,expires_at:exp,refresh_token:'fixture-'+u[0],user:usuario(u)}
}
async function corpo(req){let b='';for await(const c of req){b+=c;if(b.length>4096)throw new Error('Limite')}return b?JSON.parse(b):{}}
const auth=http.createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS')
 const json=(status,b)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(b))}
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
 const rota=new URL(req.url,'http://127.0.0.1').pathname
 try{
  if(rota==='/__fixture/foto.png'){res.writeHead(200,{'Content-Type':'image/png'});return res.end(fs.readFileSync(path.join(material,itens[1].imagem.caminho)))}
  if(rota==='/__fixture/nao-existe.png')return json(404,{erro:'fixture'})
  if(rota.startsWith('/__fixture/')&&req.method==='POST'){
   if(rota==='/__fixture/reset'){await preparar();erro=false;expirada=false}
   if(rota==='/__fixture/falhar')erro=true
   if(rota==='/__fixture/normal'){erro=false;expirada=false}
   if(rota==='/__fixture/expirar')expirada=true
   if(rota==='/__fixture/vazio')await pool.query('delete from public.equipamentos_imagens')
   if(rota==='/__fixture/limite-demo'||rota==='/__fixture/atraso-demo'){
    await preparar();const eq=(await pool.query("select id from public.equipamentos where patrimonio like 'DEMO-%' order by patrimonio")).rows
    for(const e of rota.endsWith('limite-demo')?eq:eq.slice(0,1)){
     await pool.query("insert into public.emprestimos(equipamento_id,usuario_id,devolver_ate) values($1,$2,(now() at time zone 'America/Sao_Paulo')::date+$3::integer)",[e.id,usuarios[0][0],rota.endsWith('atraso-demo')?-1:14])
     await pool.query("update public.equipamentos set situacao='emprestado' where id=$1",[e.id])
    }
   }
   if(rota==='/__fixture/encerrar'){json(200,{encerrando:true});setTimeout(()=>void parar(),100);return}
   return json(200,{fixture:true})
  }
  if(rota==='/auth/v1/token'&&req.method==='POST'){
   const b=await corpo(req),u=usuarios.find(u=>u[1]===b.email||('fixture-'+u[0])===b.refresh_token)
   return u&&(b.password==='fixture-local'||b.refresh_token)?json(200,sessao(u)):json(400,{msg:'Credencial sintética inválida'})
  }
  if(rota==='/auth/v1/user'){
   const token=(req.headers.authorization||'').replace(/^Bearer /i,''),u=tokens.get(token)
   return u&&!expirada?json(200,usuario(u)):json(401,{msg:'Sessão sintética expirada'})
  }
  if(rota==='/auth/v1/logout'){res.writeHead(204);return res.end()}
  return json(404,{erro:'Rota de fixture não encontrada'})
 }catch(e){return json(500,{erro:'Fixture interrompida',codigo:e?.code||'ERRO_INTERNO'})}
})
await new Promise(r=>auth.listen(0,'127.0.0.1',r));const authUrl=`http://127.0.0.1:${auth.address().port}`
process.on('uncaughtException',e=>{console.error('Fixture local: '+e.message);void parar(1)})
process.on('unhandledRejection',e=>{console.error('Fixture local: '+String(e));void parar(1)})
process.env.SUPABASE_URL=authUrl;process.env.SUPABASE_PUBLISHABLE_KEY='fixture-publica-sem-validade-externa'
const db={async comoUsuario(u,fn){try{return await prisma.$transaction(async tx=>{await tx.$executeRawUnsafe('SET LOCAL ROLE authenticated');await tx.$queryRaw`SELECT set_config('request.jwt.claims', ${JSON.stringify({sub:u.id,role:'authenticated'})},true)`;return fn(tx)})}catch(e){const texto=errosNegocio.find(t=>e.message?.includes(t));if(texto)throw new ConflictException(texto);if(e instanceof HttpException)throw e;throw new ServiceUnavailableException('Não foi possível acessar os dados. Tente novamente.')}}}
class ModuloFixture{};Module({controllers:[HealthController,AppController],providers:[AppService,AuthGuard,{provide:DatabaseService,useValue:db}]})(ModuloFixture)
app=await NestFactory.create(ModuloFixture,{logger:['error'],abortOnError:false});app.enableCors()
app.use((req,res,next)=>erro&&req.method==='GET'&&req.path==='/api/equipamentos'?res.status(503).json({message:'Falha local de teste. Tente novamente.'}):next())
await app.listen(0,'127.0.0.1');const apiUrl=(await app.getUrl())+'/api'
const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const porta=s.address().port;await new Promise(r=>s.close(r))
vite=spawn(process.execPath,[path.join(root,'frontend/node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port',String(porta),'--strictPort'],{cwd:path.join(root,'frontend'),windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,VITE_SUPABASE_URL:authUrl,VITE_SUPABASE_PUBLISHABLE_KEY:'fixture-publica-sem-validade-externa',VITE_API_URL:apiUrl}})
let log='';vite.stdout.on('data',b=>{log+=b.toString()});vite.stderr.on('data',()=>{})
for(let n=0;n<100&&!log.includes('127.0.0.1:');n++)await new Promise(r=>setTimeout(r,200))
fs.mkdirSync(path.join(root,'backend/.cache'),{recursive:true})
fs.writeFileSync(path.join(root,'backend/.cache/ui-local.json'),JSON.stringify({frontend:`http://127.0.0.1:${porta}/testing/index.html`,auth:authUrl,api:apiUrl,fixture:true,producao:false},null,2))
console.log(JSON.stringify({frontend:`http://127.0.0.1:${porta}/testing/index.html`,fixture:true,producao:false}))
async function parar(codigo=0){if(parando)return;parando=true;vite?.kill();await app?.close();auth.closeAllConnections();auth.close();await prisma.$disconnect();await ambiente.encerrar();process.exit(codigo)}
process.on('SIGINT',()=>void parar());process.on('SIGTERM',()=>void parar())
