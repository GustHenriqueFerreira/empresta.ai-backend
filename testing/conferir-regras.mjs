import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { iniciarIsolado,comoUsuario } from './postgres-isolado.mjs'
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222'
const ambiente=await iniciarIsolado(),pool=ambiente.pool,resultados=[]
async function novo(situacao='disponivel',patrimonio='TI-FIXTURE-'+randomUUID()){
 return (await pool.query('insert into public.equipamentos(nome,categoria,patrimonio,situacao) values($1,$2,$3,$4) returning id',['Fixture','Cabo',patrimonio,situacao])).rows[0].id
}
const solicitar=(id,equipamento)=>comoUsuario(pool,id,c=>c.query('select public.solicitar_emprestimo($1) as id',[equipamento]))
async function caso(nome,fn){
 await pool.query('truncate public.emprestimos,public.equipamentos_imagens,public.equipamentos,public.profiles,auth.users cascade')
 for(const [id,n]of[[a,'Pessoa A'],[b,'Pessoa B']])await pool.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)',[id,`${id}@example.invalid`,JSON.stringify({nome:n})])
 await fn();resultados.push(nome)
}
async function corrida(pedidos){
 let prontas=0,liberar;const barreira=new Promise(r=>liberar=r),pids=[]
 const resultados=await Promise.allSettled(pedidos.map(([usuario,item])=>comoUsuario(pool,usuario,async c=>{
   pids.push((await c.query('select pg_backend_pid() as pid')).rows[0].pid)
   if(++prontas===pedidos.length)liberar()
   await barreira
   return c.query('select public.solicitar_emprestimo($1) as id',[item])
 })))
 assert.equal(new Set(pids).size,pedidos.length,'Sessões físicas devem ser distintas')
 return resultados
}
try{
 await caso('EM-CA-03 EM-CA-05: solicitação imediata persiste prazo e estado',async()=>{
  const e=await novo();await solicitar(a,e)
  const r=(await pool.query("select e.situacao,p.devolver_ate=((now() at time zone 'America/Sao_Paulo')::date+14) as prazo from public.equipamentos e join public.emprestimos p on p.equipamento_id=e.id where e.id=$1",[e])).rows
  assert.deepEqual(r,[{situacao:'emprestado',prazo:true}])
 })
 await caso('EM-CA-08: duas conexões disputam o mesmo item e só uma vence',async()=>{
  const e=await novo();const r=await corrida([[a,e],[b,e]])
  assert.equal(r.filter(x=>x.status==='fulfilled').length,1)
  assert.match(r.find(x=>x.status==='rejected').reason.message,/Equipamento indisponível/)
  assert.equal((await pool.query('select * from public.emprestimos')).rowCount,1)
 })
 await caso('EM-CA-04: mesma pessoa concorre por dois itens na fronteira de três',async()=>{
  await solicitar(a,await novo());await solicitar(a,await novo())
  const e1=await novo(),e2=await novo(),r=await corrida([[a,e1],[a,e2]])
  assert.equal(r.filter(x=>x.status==='fulfilled').length,1)
  assert.match(r.find(x=>x.status==='rejected').reason.message,/3 itens/)
  assert.equal((await pool.query('select * from public.emprestimos where usuario_id=$1',[a])).rowCount,3)
  assert.equal((await pool.query("select * from public.equipamentos where id=any($1::uuid[]) and situacao='disponivel'",[[e1,e2]])).rowCount,1)
 })
 await caso('EM-CA-06 EM-CA-07: manutenção, indisponível e atraso são recusados sem novas linhas',async()=>{
  await assert.rejects(solicitar(a,await novo('manutencao')),/manutenção/)
  const e=await novo();await solicitar(a,e)
  await assert.rejects(solicitar(b,e),/indisponível/)
  await pool.query("update public.emprestimos set devolver_ate=(now() at time zone 'America/Sao_Paulo')::date-1 where usuario_id=$1",[a])
  await assert.rejects(solicitar(a,await novo()),/atraso/)
  assert.equal((await pool.query('select * from public.emprestimos')).rowCount,1)
 })
 await caso('EM-CA-06: vencimento hoje não está atrasado',async()=>{
  await solicitar(a,await novo())
  await pool.query("update public.emprestimos set devolver_ate=(now() at time zone 'America/Sao_Paulo')::date where usuario_id=$1",[a])
  await solicitar(a,await novo())
  assert.equal((await pool.query('select * from public.emprestimos')).rowCount,2)
 })
 await caso('EM-CA-09: RLS isola empréstimos e perfis em conexões autenticadas',async()=>{
  await solicitar(a,await novo());await solicitar(b,await novo())
  const r=await comoUsuario(pool,a,async c=>({p:(await c.query('select usuario_id from public.emprestimos')).rows,u:(await c.query('select id from public.profiles')).rows}))
  assert.deepEqual(r.p,[{usuario_id:a}]);assert.deepEqual(r.u,[{id:a}])
 })
 await caso('EM-CA-03: falha após inserir não deixa empréstimo parcial',async()=>{
  await pool.query(`create function public.falha_fixture() returns trigger language plpgsql as $$ begin if new.patrimonio='FALHA-FIXTURE' then raise exception 'Falha controlada'; end if; return new; end; $$;
   create trigger falha_fixture before update on public.equipamentos for each row execute function public.falha_fixture();`)
  const e=await novo('disponivel','FALHA-FIXTURE')
  await assert.rejects(solicitar(a,e),/Falha controlada/)
  assert.equal((await pool.query('select * from public.emprestimos')).rowCount,0)
  assert.equal((await pool.query('select situacao from public.equipamentos where id=$1',[e])).rows[0].situacao,'disponivel')
 })
 console.log(JSON.stringify({ambiente:'PostgreSQL 16 Docker isolado, loopback, dados sintéticos',casos:resultados,passaram:resultados.length}))
}finally{await ambiente.encerrar()}
