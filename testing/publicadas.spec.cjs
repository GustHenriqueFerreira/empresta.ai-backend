const { execFileSync } = require('node:child_process')
const path = require('node:path')

it('DI-CA-03: doze GETs anônimos conferem PNG 800x600 e hash dos arquivos publicados', () => {
  // Asserções dos bytes estão no comando executado, não numa cópia do relatório antigo.
  const saida = execFileSync(process.execPath, [path.join(__dirname, 'verificar-imagens-publicas.mjs'), '--sem-arquivo'],
    { encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'pipe'] })
  expect(saida).toContain('# pass 1')
  expect(saida).toContain('# fail 0')
}, 125000)

it('EM-CA-11: API publicada responde health e protege o catálogo sem autenticação', async () => {
  const origem = 'https://empresta-ai-backend-2xeh.vercel.app/api'
  const health = await fetch(origem + '/health', { redirect: 'error', signal: AbortSignal.timeout(20000) })
  expect(health.status).toBe(200)
  expect(await health.json()).toEqual({ status: 'ok' })
  const catalogo = await fetch(origem + '/equipamentos', { redirect: 'error', signal: AbortSignal.timeout(20000) })
  expect(catalogo.status).toBe(401)
  // Não substitui a jornada real autenticada: essa prova complementar vem da CUA,
  // com a conta separada, sem conceder credencial ao Jest ou ao verificador.
}, 45000)
