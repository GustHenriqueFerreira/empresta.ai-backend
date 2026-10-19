// Aplica o schema inicial do banco EMPREST.AI no Supabase.
// Uso: dentro de backend/, preencher .env (DIRECT_URL ou DATABASE_URL) e rodar:
//   npm run db:schema
//
// O script nunca imprime a string de conexão nem qualquer segredo.
// Estrutura aplicada e verificação: docs/specs/03-banco-de-dados.md.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const raiz = path.dirname(fileURLToPath(import.meta.url))

function lerEnv(caminho) {
  const variaveis = {}
  for (const linha of readFileSync(caminho, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m) variaveis[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return variaveis
}

/* Oculta qualquer URL/credencial que possa aparecer em mensagens de erro. */
function ocultarConexao(texto) {
  return String(texto).replace(/[a-z][a-z0-9+.-]*:\/\/[^\s"']+/gi, '<string de conexão oculta>')
}

let env
try {
  env = lerEnv(path.join(raiz, '..', '.env'))
} catch {
  console.error('backend/.env não encontrado. Copie .env.example para .env e preencha DIRECT_URL.')
  process.exit(1)
}

const url = env.DIRECT_URL || env.DATABASE_URL
if (!url) {
  console.error(
    'DIRECT_URL (ou DATABASE_URL) vazio em backend/.env. Preencha com a connection string do projeto Supabase (Project Settings → Database → Connection string).',
  )
  process.exit(1)
}

let sql
try {
  sql = readFileSync(path.join(raiz, '001-schema-inicial.sql'), 'utf8')
} catch {
  console.error('001-schema-inicial.sql não encontrado em backend/db/.')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  application_name: 'emprestai-schema',
})

try {
  await client.connect()

  // Uma única chamada = transação única: se algo falhar, nada fica aplicado.
  await client.query(sql)

  const tabelas = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name",
  )
  const rls = await client.query(
    "select relname, relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and relkind = 'r' order by relname",
  )
  const politicas = await client.query(
    "select tablename, policyname from pg_policies where schemaname = 'public' order by tablename, policyname",
  )
  const funcoes = await client.query(
    "select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' order by p.proname",
  )
  const indices = await client.query(
    "select indexname from pg_indexes where schemaname = 'public' order by indexname",
  )
  const gatilhoAuth = await client.query(
    'select tgname from pg_trigger where tgrelid = \'auth.users\'::regclass and not tgisinternal order by tgname',
  )

  console.log('Schema aplicado com sucesso.')
  console.log('')
  console.log('Tabelas:', tabelas.rows.map((r) => r.table_name).join(', '))
  console.log('RLS ativa em:', rls.rows.filter((r) => r.relrowsecurity).map((r) => r.relname).join(', '))
  console.log('Políticas RLS:')
  for (const r of politicas.rows) console.log(`  - ${r.tablename}: ${r.policyname}`)
  console.log('Funções:', funcoes.rows.map((r) => r.proname).join(', '))
  console.log('Índices:', indices.rows.map((r) => r.indexname).join(', '))
  console.log('Triggers em auth.users:', gatilhoAuth.rows.map((r) => r.tgname).join(', ') || '(nenhum)')
} catch (erro) {
  console.error('Falha ao aplicar o schema:')
  console.error(ocultarConexao(erro.message || erro))
  process.exitCode = 1
} finally {
  try {
    await client.end()
  } catch {
    /* conexão pode nem ter sido aberta */
  }
}
