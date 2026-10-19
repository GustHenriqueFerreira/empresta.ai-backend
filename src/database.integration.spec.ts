import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

it('regras de negócio e RLS no PostgreSQL isolado, sem conexão remota', () => {
  const saida = execFileSync(process.execPath, [resolve(__dirname, '../db/verificar-isolado.mjs')], { encoding: 'utf8', timeout: 60000 })
  expect(saida).toContain('9 cenários SQL isolados passaram')
}, 65000)
