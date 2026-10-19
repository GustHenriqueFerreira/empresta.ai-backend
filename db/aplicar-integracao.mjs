// Provisionamento aprovado nas specs 03/04; não é uma decisão de migrations.
import 'dotenv/config'
import fs from 'node:fs'
import pg from 'pg'

const url = process.env.DIRECT_URL || process.env.DATABASE_URL
if (!url) throw new Error('Configure DATABASE_URL ou DIRECT_URL no backend/.env.')
const ca = fs.readFileSync(new URL('../certs/supabase-ca.crt', import.meta.url), 'utf8')
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: true, ca }, connectionTimeoutMillis: 10000 })
try {
  await client.connect()
  const { rows } = await client.query("select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'")
  const permitidas = ['profiles', 'equipamentos', 'emprestimos']
  if (rows.some(r => !permitidas.includes(r.table_name))) throw new Error('SCHEMA_NAO_REVISADO')
  if (rows.length !== 0 && rows.length !== 3) throw new Error('SCHEMA_PARCIAL')
  if (rows.length === 3) {
    console.log('Schema já existente. Revise diferenças antes de reaplicar; operação encerrada sem alterações.')
  } else {
    const sql = ['001-schema-inicial.sql', '002-integracao.sql'].map(nome => fs.readFileSync(new URL(nome, import.meta.url), 'utf8')).join('\n')
    await client.query(sql)
    console.log('Schema e complemento de integração aplicados em transação única. Nenhum equipamento ou usuário fictício criado.')
  }
  const { rows: tabelas } = await client.query("select relname, relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relname in ('profiles','equipamentos','emprestimos') order by relname")
  console.log('Tabelas/RLS:', tabelas.map(t => `${t.relname}:${t.relrowsecurity}`).join(', '))
} catch (e) {
  // Nunca imprimir mensagem do driver: pode conter conexão, SQL ou valores.
  console.error('Provisionamento não concluído. Código:', e.code || (['SCHEMA_NAO_REVISADO', 'SCHEMA_PARCIAL'].includes(e.message) ? e.message : 'ERRO_DE_CONFIGURACAO'))
  process.exitCode = 1
} finally { await client.end().catch(() => {}) }
