// E1-03/04/05: validação de entradas e concorrência sem modelo/rede/banco.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { validarPacote } from './validar-pacote.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const base = JSON.parse(fs.readFileSync(path.join(root, 'docs/pratica/entrega-1-prova/04-restaurado/pacote.json')))
let count = 0
function blocked(name, change, options) {
  const packet = structuredClone(base)
  change(packet)
  assert.throws(() => validarPacote(packet, options), undefined, name)
  count++
}
assert.equal(validarPacote(base), true)
blocked('E1-03: entrada malformada', p => { p.criterios = 'CA-07' })
blocked('E1-03: critérios repetidos', p => { p.criterios.push('CA-07') })
blocked('E1-03: arquivo repetido', p => { p.arquivos.push(p.arquivos[0]) })
blocked('E1-03: documento obrigatório ausente', p => { p.arquivos = p.arquivos.filter(f => f.caminho !== 'plan.md') })
blocked('E1-04: caminho de segredo', p => { p.arquivos[0].caminho = '.env.local' })
blocked('E1-04: caminho fora da raiz', p => { p.arquivos[0].caminho = '../spec.md' })
blocked('E1-04: segredo sintético em campo livre', p => { p.provocacao = 'sb_' + 'secret_' + 'EXEMPLO_SINTETICO_NAO_E_UMA_CHAVE' })
blocked('E1-05: ausência do contexto atual', () => {}, { contextoAtual: true })
blocked('E1-05: check sem data', p => { delete p.checks[0].executadoEm })

// Acrescenta contexto atual apenas para testar I/O. O resultado histórico do Jest
// não é anunciado como execução atual; o subprocesso será Node, não Codex.
const packet = structuredClone(base)
for (const relative of ['PARTE-2.md', 'rules/spec-flow-pratica.md', 'docs/parte2/HANDOFF.md']) {
  const conteudo = fs.readFileSync(path.join(root, relative), 'utf8')
  packet.arquivos.push({ caminho: relative, conteudo, sha256: crypto.createHash('sha256').update(conteudo).digest('hex') })
}
packet.revisao = crypto.createHash('sha256').update(JSON.stringify(packet.arquivos.map(f => [f.caminho, f.sha256]))).digest('hex')
packet.checks.forEach(c => { c.revisao = packet.revisao })
const temporary = fs.mkdtempSync(path.join(root, 'backend/.cache/e1-executor-'))
const packetPath = path.join(temporary, 'pacote.json')
fs.writeFileSync(packetPath, JSON.stringify(packet))
const run = () => new Promise((resolve, reject) => {
  // Node rejeita as opções da CLI Codex: prova não faz inferência nem requisição.
  const child = spawn(process.execPath, [path.join(root, 'agents/rodar-verificador.mjs'), '--pacote', packetPath, '--codex', process.execPath],
    { cwd: root, windowsHide: true, stdio: 'ignore' })
  child.once('error', reject)
  child.once('close', resolve)
})
const exits = await Promise.all([run(), run()])
assert.ok(exits.every(code => code !== 0), 'execução falsa não deve aprovar')
assert.ok(fs.existsSync(path.join(temporary, 'execucao.lock')), 'uma execução deve reservar a pasta')
assert.ok(fs.existsSync(path.join(temporary, 'sessao.jsonl')), 'execução que reservou deve preservar saída')
assert.ok(fs.existsSync(path.join(temporary, 'relatorio.md')), 'falha deve deixar relatório')
const files = ['execucao.lock', 'sessao.jsonl', 'relatorio.md']
const before = files.map(f => fs.readFileSync(path.join(temporary, f)))
assert.notEqual(await run(), 0, 'terceira execução deve recusar reutilização')
files.forEach((f, i) => assert.ok(before[i].equals(fs.readFileSync(path.join(temporary, f))), 'não sobrescrever ' + f))
count += 2
console.log(`${count} verificações de pacote/concorrência E1 passaram; nenhuma chamada ao modelo ou serviço remoto.`)
