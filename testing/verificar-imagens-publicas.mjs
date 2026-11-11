// Somente GET público: não lê .env, não autentica, não publica nem altera dados.
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import test from 'node:test'

const material = new URL('../db/pratica/entrega-3/material/plano.json', import.meta.url)
const plano = JSON.parse(await readFile(material, 'utf8'))
const resultados = []
test('DI-CA-03: as doze fotos públicas abrem sem login e preservam PNG 800x600 e hash', async () => {
  assert.equal(plano.equipamentos.length, 12)
  for (const item of plano.equipamentos) {
    const url = new URL(item.urlPublica)
    assert.equal(url.origin, 'https://mvoswngmnsfxcecucrys.supabase.co')
    assert.equal(url.pathname, '/storage/v1/object/public/equipamentos-pratica/' + item.imagem.caminho)
    assert.equal(url.search, '')
    const resposta = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) })
    assert.equal(resposta.status, 200, item.patrimonio)
    assert.match(resposta.headers.get('content-type') || '', /^image\/png(?:;|$)/)
    const bytes = Buffer.from(await resposta.arrayBuffer())
    assert.ok(bytes.length <= 5 * 1024 * 1024)
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.equal(bytes.readUInt32BE(16), 800)
    assert.equal(bytes.readUInt32BE(20), 600)
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    assert.equal(sha256, item.imagem.sha256)
    resultados.push({ patrimonio: item.patrimonio, url: url.href, status: resposta.status,
      largura: 800, altura: 600, bytes: bytes.length, sha256 })
  }
  if (!process.argv.includes('--sem-arquivo')) await writeFile(new URL('../../docs/pratica/entrega-3-dados-prova/imagens-publicas-20261111.json', import.meta.url),
    JSON.stringify({ executor: 'principal', observadoEm: new Date().toISOString(),
      criterio: 'DI-CA-03', autenticacao: false, resultados }, null, 2) + '\n', { flag: 'wx' })
})
