// Executa PostgreSQL WASM somente em memória: não carrega .env nem acessa rede.
import { PGlite } from '@electric-sql/pglite'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const db = new PGlite()
let casos = 0
const pessoa = '11111111-1111-4111-8111-111111111111'
const outra = '22222222-2222-4222-8222-222222222222'
const operacoes = '33333333-3333-4333-8333-333333333333'
async function como(usuario, fn) {
  return db.transaction(async tx => {
    await tx.exec('set local role authenticated')
    await tx.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: usuario, role: 'authenticated' })])
    return fn(tx)
  })
}
async function solicitar(usuario, item) { return como(usuario, tx => tx.query('select public.solicitar_emprestimo($1) as id', [item])) }
async function novo(situacao = 'disponivel') {
  const { rows } = await db.query("insert into public.equipamentos (nome,categoria,situacao) values ('Equipamento de teste','Cabo',$1) returning id", [situacao])
  return rows[0].id
}
async function limpar() {
  await db.exec('truncate public.emprestimos, public.equipamentos, public.profiles, auth.users cascade')
  for (const [id, nome] of [[pessoa,'Pessoa'],[outra,'Outra'],[operacoes,'Operações']]) await db.query('insert into auth.users(id,email,raw_user_meta_data) values ($1,$2,$3)', [id, `${id}@example.invalid`, JSON.stringify({ nome })])
  await db.query("update public.profiles set papel='operacoes' where id=$1", [operacoes])
}
async function caso(nome, fn) { await limpar(); await fn(); casos++; console.log(`OK: ${nome}`) }
try {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select (nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'sub')::uuid $$;
    grant usage on schema auth to authenticated;
    grant execute on function auth.uid() to authenticated;`)
  for (const arquivo of ['001-schema-inicial.sql', '002-integracao.sql']) await db.exec(fs.readFileSync(new URL(arquivo, import.meta.url), 'utf8'))

  await caso('solicitação persiste, define 14 dias e marca item emprestado', async () => {
    const item = await novo()
    await solicitar(pessoa, item)
    const { rows } = await db.query("select e.situacao, p.devolver_ate = (now() at time zone 'America/Sao_Paulo')::date + 14 as prazo from public.equipamentos e join public.emprestimos p on p.equipamento_id=e.id where e.id=$1", [item])
    assert.equal(rows[0].situacao, 'emprestado'); assert.equal(rows[0].prazo, true)
  })
  await caso('quarta solicitação recusada sem exceder três', async () => {
    for (let i = 0; i < 3; i++) await solicitar(pessoa, await novo())
    await assert.rejects(solicitar(pessoa, await novo()), /3 itens/)
    assert.equal((await db.query('select count(*)::int as n from public.emprestimos')).rows[0].n, 3)
  })
  await caso('atraso bloqueia novos empréstimos', async () => {
    await solicitar(pessoa, await novo())
    await db.exec("update public.emprestimos set devolver_ate = current_date - 2")
    await assert.rejects(solicitar(pessoa, await novo()), /atraso/)
  })
  await caso('manutenção e item já emprestado recusam solicitação', async () => {
    await assert.rejects(solicitar(pessoa, await novo('manutencao')), /manutenção/)
    const item = await novo(); await solicitar(pessoa, item)
    await assert.rejects(solicitar(outra, item), /indisponível/)
  })
  await caso('RLS isola empréstimos e perfis; Operações vê todos', async () => {
    await solicitar(pessoa, await novo()); await solicitar(outra, await novo())
    const visiveis = await como(pessoa, tx => tx.query('select usuario_id from public.emprestimos'))
    assert.deepEqual(visiveis.rows.map(r => r.usuario_id), [pessoa])
    assert.equal((await como(pessoa, tx => tx.query('select id from public.profiles'))).rows.length, 1)
    assert.equal((await como(operacoes, tx => tx.query('select id from public.emprestimos'))).rows.length, 2)
  })
  await caso('terceiro não devolve; dono devolve, libera item e slot', async () => {
    const item = await novo(); const { rows } = await solicitar(pessoa, item); const id = rows[0].id
    await assert.rejects(como(outra, tx => tx.query('select public.devolver_emprestimo($1)', [id])), /Somente/)
    await como(pessoa, tx => tx.query('select public.devolver_emprestimo($1)', [id]))
    assert.equal((await db.query('select situacao from public.equipamentos where id=$1', [item])).rows[0].situacao, 'disponivel')
    assert.equal((await como(pessoa, tx => tx.query('select id from public.emprestimos where devolvido_em is null'))).rows.length, 0)
    await assert.rejects(como(pessoa, tx => tx.query('select public.devolver_emprestimo($1)', [id])), /já devolvido/)
  })
  await caso('Operações devolve empréstimo de outra pessoa', async () => {
    const { rows } = await solicitar(pessoa, await novo())
    await como(operacoes, tx => tx.query('select public.devolver_emprestimo($1)', [rows[0].id]))
    assert.equal((await db.query('select id from public.emprestimos where devolvido_em is null')).rows.length, 0)
  })
  await caso('escritas diretas de empréstimo e promoção de papel são bloqueadas', async () => {
    const item = await novo()
    await assert.rejects(como(pessoa, tx => tx.query('insert into public.emprestimos (equipamento_id,usuario_id,devolver_ate) values ($1,$2,current_date+14)', [item,pessoa])), /permission denied/)
    await assert.rejects(como(pessoa, tx => tx.exec("update public.profiles set papel='operacoes'")), /permission denied/)
    await assert.rejects(como(pessoa, tx => tx.exec("insert into public.equipamentos(nome,categoria) values ('Tentativa','Cabo')")), /row-level security/)
  })
  await caso('cadastro por Operações usa patrimônio padrão; trigger protege coerência', async () => {
    await como(operacoes, tx => tx.exec("insert into public.equipamentos(nome,categoria) values ('Cabo','Cabo')"))
    assert.equal((await db.query('select patrimonio from public.equipamentos')).rows[0].patrimonio, 'TI-—')
    const item = await novo(); await solicitar(pessoa, item)
    await assert.rejects(como(operacoes, tx => tx.query("update public.equipamentos set situacao='disponivel' where id=$1", [item])), /registre a devolução/)
  })
  console.log(`${casos} cenários SQL isolados passaram. Concorrência entre conexões exige PostgreSQL com múltiplas sessões; não simulada por este teste.`)
} finally { await db.close() }
