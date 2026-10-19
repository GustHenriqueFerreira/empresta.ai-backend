// Somente leitura. Não imprime identidades, credenciais, dados ou mensagens do driver.
import 'dotenv/config'
import 'reflect-metadata'
import fs from 'node:fs'
import pg from 'pg'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { DatabaseService } = require('../dist/database.service.js')
const ca = fs.readFileSync(new URL('../certs/supabase-ca.crt', import.meta.url), 'utf8')
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true, ca }, connectionTimeoutMillis: 10000 })
let db
try {
  await client.connect()
  const { rows } = await client.query('select (select count(*)::int from auth.users) as usuarios, (select count(*)::int from public.profiles) as perfis')
  console.log('Contas existentes:', rows[0].usuarios, '; perfis:', rows[0].perfis)
  db = new DatabaseService()
  // Identidade inexistente: confirma caminho Prisma + RLS sem ler dados de pessoa real.
  const resultado = await db.comoUsuario({ id: '00000000-0000-4000-8000-000000000000' }, async tx => {
    const [papel] = await tx.$queryRawUnsafe('select current_user as papel')
    return { papel: papel.papel, equipamentos: await tx.equipamento.count(), emprestimosVisiveis: await tx.emprestimo.count(), perfisVisiveis: await tx.profile.count() }
  })
  console.log('Prisma/RLS (leitura, identidade inexistente):', JSON.stringify(resultado))
  const settings = await fetch(`${process.env.SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY }, signal: AbortSignal.timeout(10000) })
  console.log('Supabase Auth, configuração pública: HTTP', settings.status)
  if (!settings.ok || resultado.papel !== 'authenticated' || resultado.perfisVisiveis !== 0 || resultado.emprestimosVisiveis !== 0) process.exitCode = 1
} catch (e) { console.error('Verificação não concluída. Código:', e.code || 'ERRO_DE_CONEXAO'); process.exitCode = 1 }
finally { await db?.onModuleDestroy(); await client.end().catch(() => {}) }
