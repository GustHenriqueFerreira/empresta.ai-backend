// Valida os arquivos SQL reais do pacote em PostgreSQL descartável. Nunca produção.
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { iniciarIsolado } from './postgres-isolado.mjs'
const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const permitida=path.join(raiz,'db/pratica/entrega-3/pacotes')
const pacote=path.resolve(raiz,process.argv[2]||'')
if(!pacote.startsWith(permitida+path.sep))throw new Error('Pacote fora da área de preparo')
const sql=fs.readFileSync(path.join(pacote,'000-aplicar-pratica.sql'),'utf8')
const meta=JSON.parse(fs.readFileSync(path.join(pacote,'MATERIAL-PARA-REVISAO.json'),'utf8'))
assert.equal(createHash('sha256').update(sql).digest('hex'),meta.aplicacaoSqlSha256)
const inv=JSON.parse(fs.readFileSync(path.join(pacote,'inventario.json'),'utf8'))
const contexto=await iniciarIsolado(),pool=contexto.pool
try{
 // Fixture retorna ao estado anterior à adição; tabelas vazias pertencem a este container.
 await pool.query('drop table public.equipamentos_imagens; drop index public.uq_pratica_patrimonio')
 for(const e of inv.equipamentos)await pool.query('insert into public.equipamentos(id,nome,categoria,patrimonio,situacao) values($1,$2,$3,$4,$5)',[e.id,e.nome,e.categoria,e.patrimonio,e.situacao])
 const anteriores=(await pool.query('select * from public.equipamentos order by patrimonio')).rows
 await pool.query(sql)
 const contar=async()=>({equipamentos:Number((await pool.query('select count(*) from public.equipamentos')).rows[0].count),imagens:Number((await pool.query('select count(*) from public.equipamentos_imagens')).rows[0].count)})
 assert.deepEqual(await contar(),{equipamentos:16,imagens:12})
 assert.deepEqual((await pool.query("select * from public.equipamentos where patrimonio like 'DEMO-%' order by patrimonio")).rows,anteriores)
 const ids=(await pool.query('select id from public.equipamentos order by id')).rows
 await pool.query(fs.readFileSync(path.join(pacote,'002-dados.sql'),'utf8'))
 assert.deepEqual(await contar(),{equipamentos:16,imagens:12})
 assert.deepEqual((await pool.query('select id from public.equipamentos order by id')).rows,ids)
 assert.equal((await pool.query('select * from public.emprestimos')).rowCount,0)
 console.log(JSON.stringify({caso:'DI-CA-01 DI-CA-02 DI-CA-05 DI-CA-07: SQL real do material e repetição preservam 4 DEMO, 12 imagens e IDs',passou:true,producao:false,...await contar(),aprovacaoVisual:false}))
}finally{await contexto.encerrar()}
