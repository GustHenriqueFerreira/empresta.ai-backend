// Somente PostgreSQL descartável/loopback. Sem .env, credencial ou serviço real.
import 'reflect-metadata'
import fs from 'node:fs'
import http from 'node:http'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { iniciarIsolado, comoUsuario } from './postgres-isolado.mjs'
const require=createRequire(import.meta.url)
const {AppController}=require('../src/app.controller.ts'),{AppService}=require('../src/app.service.ts')
const {DatabaseService}=require('../src/database.service.ts'),{AuthGuard}=require('../src/auth.guard.ts')
const ambiente=await iniciarIsolado(),pool=ambiente.pool,casos=[]
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222'
let app,auth,prisma
async function reset(){await pool.query('truncate public.emprestimos,public.equipamentos_imagens,public.equipamentos,public.profiles,auth.users cascade');for(const [id,nome]of[[a,'Pessoa A'],[b,'Pessoa B']])await pool.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)',[id,id+'@example.invalid',JSON.stringify({nome})])}
async function novo(nome='Item de teste',situacao='disponivel'){return(await pool.query('insert into public.equipamentos(nome,categoria,situacao) values($1,\'Cabo\',$2) returning id',[nome,situacao])).rows[0].id}
try{
 const sql=fs.readFileSync(new URL('../db/002-integracao.sql',import.meta.url),'utf8')
 // Injeção exclusiva do relógio no container. Toda a regra/INSERT permanece do SQL real.
 assert.equal((sql.match(/\bnow\(\)/g)||[]).length,2)
 await pool.query(sql.replace(/\bnow\(\)/g,"current_setting('emprestai.fixture_agora')::timestamptz"))
 const bordas=[['2026-10-20T01:00:00Z','2026-11-02'],['2026-10-20T03:00:00Z','2026-11-03'],['2026-12-31T01:00:00Z','2027-01-13'],['2026-12-31T03:00:00Z','2027-01-14'],['2028-02-28T03:00:00Z','2028-03-13'],['2026-11-06T12:00:00Z','2026-11-20']]
 for(const [agora,esperado]of bordas){await reset();const item=await novo();await comoUsuario(pool,a,async c=>{await c.query("select set_config('emprestai.fixture_agora',$1,true)",[agora]);await c.query('select public.solicitar_emprestimo($1)',[item])});const r=(await pool.query('select devolver_ate::text as prazo,retirado_em from public.emprestimos')).rows;assert.equal(r.length,1);assert.equal(r[0].prazo,esperado);assert.equal(r[0].retirado_em.toISOString(),new Date(agora).toISOString())}
 casos.push('EM-CA-05: servidor persiste prazo em fronteiras Brasília, ano, fevereiro bissexto e dias corridos')
 await pool.query(sql);await reset()
 auth=http.createServer((req,res)=>{const id=req.headers.authorization==='Bearer fixture-a'?a:req.headers.authorization==='Bearer fixture-b'?b:null;res.writeHead(id?200:401,{'Content-Type':'application/json'});res.end(JSON.stringify(id?{id,aud:'authenticated',role:'authenticated',email:id+'@example.invalid',user_metadata:{},app_metadata:{}}:{msg:'Sessão sintética inválida'}))})
 await new Promise(r=>auth.listen(0,'127.0.0.1',r))
 process.env.SUPABASE_URL='http://127.0.0.1:'+auth.address().port;process.env.SUPABASE_PUBLISHABLE_KEY='fixture-publica-sem-validade-externa'
 prisma=new PrismaClient({adapter:new PrismaPg(ambiente.config),log:[]})
 // Mantém método real (claims, transação, RLS e tradução de erros). Só o driver é local.
 const db=Object.create(DatabaseService.prototype);db.prisma=prisma
 class ModuloTeste{};Module({controllers:[AppController],providers:[AuthGuard,AppService,{provide:DatabaseService,useValue:db}]})(ModuloTeste)
 app=await NestFactory.create(ModuloTeste,{logger:false});await app.listen(0,'127.0.0.1')
 const origem=await app.getUrl()
 const req=async(p,token,corpo)=>{const r=await fetch(origem+'/api'+p,{method:corpo?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(corpo?{'Content-Type':'application/json'}:{})},body:corpo?JSON.stringify(corpo):undefined});return{status:r.status,body:await r.json()}}
 const manutencao=await novo('Item manutenção','manutencao')
 let r=await req('/emprestimos','fixture-a',{equipamentoId:manutencao});assert.equal(r.status,409);assert.equal(r.body.message,'Equipamento em manutenção.');assert.equal((await pool.query('select count(*)::int as n from public.emprestimos')).rows[0].n,0)
 const deB=await novo('Item de Pessoa B');await comoUsuario(pool,b,c=>c.query('select public.solicitar_emprestimo($1)',[deB]))
 r=await req('/emprestimos','fixture-a',{equipamentoId:deB});assert.equal(r.status,409);assert.equal(r.body.message,'Equipamento indisponível.');assert.equal((await pool.query('select count(*)::int as n from public.emprestimos')).rows[0].n,1)
 r=await req('/emprestimos','fixture-a',{equipamentoId:deB,usuarioId:b});assert.equal(r.status,400)
 casos.push('EM-CA-07: POST manipulado atravessa guard, controller, serviço, Prisma e SQL sem emprestar manutenção ou item alheio')
 const deA=await novo('Item de Pessoa A');await comoUsuario(pool,a,c=>c.query('select public.solicitar_emprestimo($1)',[deA]))
 r=await req('/emprestimos/meus?usuarioId='+b+'&usuario_id='+b,'fixture-a');assert.equal(r.status,200);assert.equal(r.body.length,1);assert.equal(r.body[0].usuario_id,a);assert.equal(r.body[0].equipamento.id,deA);assert.equal(r.body[0].equipamento.nome,'Item de Pessoa A');assert.match(r.body[0].devolver_ate,/^\d{4}-\d{2}-\d{2}T/);assert.ok(!JSON.stringify(r.body).includes('Item de Pessoa B'))
 r=await req('/emprestimos/meus?usuarioId='+a,'fixture-b');assert.equal(r.status,200);assert.equal(r.body.length,1);assert.equal(r.body[0].usuario_id,b);assert.equal(r.body[0].equipamento.id,deB)
 assert.equal((await req('/emprestimos/meus')).status,401)
 casos.push('EM-CA-09: rota real de próprios empréstimos ignora identidade adulterada e não expõe dados da outra sessão')
 console.log(JSON.stringify({ambiente:'Auth sintético/HTTP/Prisma/PostgreSQL16 isolados, nenhum Supabase real',casos,passaram:casos.length}))
}finally{await app?.close();auth?.closeAllConnections();await new Promise(r=>auth?auth.close(r):r());await prisma?.$disconnect();await ambiente.encerrar()}
