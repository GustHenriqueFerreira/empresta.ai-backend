import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

// Cada linha aponta para um cenário com asserções no PostgreSQL em memória.
// O processo falha se qualquer asserção SQL falhar; nenhum .env é carregado.
const cenarios = [
  ['CA-03 CA-07', 'solicitação persiste, define 14 dias e marca item emprestado'],
  ['CA-06', 'quarta solicitação recusada sem exceder três'],
  ['CA-08', 'atraso bloqueia novos empréstimos'],
  ['CA-09', 'manutenção e item já emprestado recusam solicitação'],
  ['CA-01 CA-05', 'RLS isola empréstimos e perfis; Operações vê todos'],
  ['CA-04', 'terceiro não devolve; dono devolve, libera item e slot'],
  ['CA-05', 'Operações devolve empréstimo de outra pessoa'],
  ['CA-01 CA-05', 'escritas diretas de empréstimo e promoção de papel são bloqueadas'],
  ['CA-05', 'cadastro por Operações usa patrimônio padrão; trigger protege coerência'],
]

describe('Regras e RLS em PostgreSQL isolado', () => {
  let saida: string
  beforeAll(() => {
    saida = execFileSync(process.execPath, [resolve(__dirname, '../db/verificar-isolado.mjs')], { encoding: 'utf8', timeout: 60000 })
  }, 65000)
  it.each(cenarios)('%s: %s', (_ca, cenario) => {
    expect(saida).toContain('OK: ' + cenario)
    expect(saida).toContain('9 cenários SQL isolados passaram')
  })
})
