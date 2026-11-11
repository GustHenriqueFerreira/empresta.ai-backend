// Regressões de E1-01/03/04/05: dados locais; não chama modelo, banco ou rede.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { podeEncerrar } from './validar-veredito.mjs'

const dir = new URL('../docs/pratica/entrega-1-prova/04-restaurado/', import.meta.url)
const base = {
  packet: JSON.parse(fs.readFileSync(new URL('pacote.json', dir))),
  events: fs.readFileSync(new URL('sessao.jsonl', dir), 'utf8').trim().split(/\r?\n/).map(JSON.parse),
  report: fs.readFileSync(new URL('relatorio.md', dir), 'utf8'), exitCode: 0,
}
const cases = []
function example(name, change) {
  const state = structuredClone(base)
  change(state)
  // O relatório mutado continua sendo a mensagem literal da sessão, para não
  // esconder um defeito de parsing atrás de mera divergência entre argumento/log.
  for (const event of state.events) if (event.item?.type === 'agent_message') event.item.text = state.report.trim()
  cases.push({ name, state })
}
example('E1-03: vereditos contraditórios', s => { s.report += '\nVeredito: NÃO PRONTA — pendência real.\n' })
example('E1-03: ID só na observação', s => { s.report = s.report.replace('| CA-07 | backend/', '| CA-999 | backend/').replace('Teste ativo verifica', 'CA-07 citado só aqui. Teste ativo verifica') })
example('E1-01: prefixo de outro critério', s => { s.packet.criterios = ['CA-0'] })
example('E1-01: nome de teste com ID parcial', s => {
  for (const c of s.packet.checks) for (const suite of c.resultado.testResults) for (const t of suite.assertionResults) t.fullName = t.fullName.replaceAll('CA-07', 'CA-070')
})
example('E1-03: critérios vazios na função', s => { s.packet.criterios = [] })
example('E1-04: nenhum evento de sessão', s => { s.events = [] })
example('E1-04: ferramenta desconhecida', s => { s.events.splice(-1, 0, { type: 'item.completed', item: { type: 'future_remote_tool' } }) })
example('E1-04: sessão sem conclusão', s => { s.events = s.events.filter(e => e.type !== 'turn.completed') })
example('E1-04: evento desconhecido', s => { s.events.splice(-1, 0, { type: 'unknown.event' }) })
example('E1-05: rodada de outro relatório', s => { s.packet.rodada = 'OUTRA-RODADA' })
example('E1-05: spec de outro relatório', s => { s.packet.spec = 'outra-spec.md' })
example('E1-05: escopo de outro relatório', s => { s.packet.escopo = 'Outro escopo' })
example('E1-03: Jest contradiz exitCode', s => { s.packet.checks[0].resultado.success = false; s.packet.checks[0].resultado.numFailedTests = 9 })
example('E1-03: asserção falha omitida do resumo', s => { s.packet.checks[0].resultado.testResults[0].assertionResults.push({ fullName: 'CA-07: falha', status: 'failed', numPassingAsserts: 0 }) })
example('E1-03: contagens Jest incompatíveis', s => {
  for (const key of ['numPassedTests', 'numTotalTests', 'numPassedTestSuites', 'numTotalTestSuites']) s.packet.checks[0].resultado[key] = 0
})
example('E1-03: status de asserção desconhecido', s => {
  s.packet.checks[0].resultado.testResults[0].assertionResults.push({ fullName: 'CA-07: status novo', status: 'new_failure_status', numPassingAsserts: 0 })
})
example('E1-01: parte do mesmo CA pendente', s => {
  const r = s.packet.checks[0].resultado
  r.testResults[0].assertionResults.push({ fullName: 'CA-07: outra borda', status: 'pending', numPassingAsserts: 0 })
  r.numTotalTests++; r.numPendingTests++
})
example('E1-03: arquivo com hash inválido', s => { s.packet.arquivos[0].conteudo += '\nTexto alterado.' })
example('E1-03: checks de outra revisão', s => { s.packet.checks[0].revisao = '0'.repeat(64) })
example('E1-01: CA duplicado no relatório', s => { s.report = s.report.replace('Checks:', '| CA-07 | teste:1 | ATENDIDO | duplicado |\n\nChecks:') })
example('E1-04: sessão falha', s => { s.events.push({ type: 'turn.failed' }) })
example('E1-03: processo falha', s => { s.exitCode = 1 })
example('E1-03: rodapé aprova sem tabela', s => { s.report = 'Veredito: PRONTA' })
// O argumento é incompatível com a mensagem real, sem sincronização intencional.
const mismatch = structuredClone(base)
mismatch.events.find(e => e.item?.type === 'agent_message').item.text = 'Veredito: NÃO PRONTA'
cases.push({ name: 'E1-05: mensagem diferente do relatório', state: mismatch })

const results = cases.map(({ name, state: s }) => ({ caso: name, aprovou: podeEncerrar(s.packet, s.events, s.report, s.exitCode) }))
const valid = podeEncerrar(base.packet, base.events, base.report, 0)
if (process.argv[2] === '--diagnostico') {
  console.log(JSON.stringify({ baselineValidoAprovou: valid, casos: results }, null, 2))
} else {
  assert.equal(valid, true, 'rodada real válida deve continuar aprovável')
  for (const r of results) assert.equal(r.aprovou, false, r.caso)
  console.log(`${results.length} regressões adversariais E1 bloqueadas; rodada real válida preservada.`)
  for (const [round, childExitCode, expected] of [['05-revisao-erro-2026-11-11', 1, false], ['05-revisao-erro-2026-11-11-tentativa-2', 0, false], ['06-revisao-restaurado-2026-11-11', 0, true]]) {
    const folder = new URL('../docs/pratica/entrega-1-prova/' + round + '/', import.meta.url)
    const packet = JSON.parse(fs.readFileSync(new URL('pacote.json', folder)))
    const events = fs.readFileSync(new URL('sessao.jsonl', folder), 'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
    const report = fs.readFileSync(new URL('relatorio.md', folder), 'utf8')
    assert.equal(podeEncerrar(packet, events, report, childExitCode), expected, 'rodada real ' + round)
  }
  const original = fs.readFileSync(new URL('../backend/src/contracts.spec.ts', import.meta.url))
  for (const fixture of ['05-revisao-erro-2026-11-11', '05-revisao-erro-2026-11-11-tentativa-2', '06-revisao-restaurado-2026-11-11']) {
    assert.ok(original.equals(fs.readFileSync(new URL('../backend/.cache/prova-e1-' + fixture + '/contracts.spec.ts', import.meta.url))), 'cópia restaurada: ' + fixture)
  }
  console.log('3 rodadas novas conferidas (falha de execução, recusa do erro, aprovação da restauração); cópias restauradas.')
  for (const relative of ['agents/rodar-verificador.mjs', 'agents/validar-veredito.mjs', 'agents/validar-pacote.mjs',
    'agents/verificador-spec-pratica.md', 'agents/sincronizar-verificador.mjs', '.codex/agents/verificador-spec-pratica.toml']) {
    assert.ok(fs.readFileSync(new URL('../' + relative, import.meta.url)).equals(fs.readFileSync(new URL('../backend/docs/pratica/entrega-1/ferramentas/' + relative, import.meta.url))), 'exportação divergente: ' + relative)
  }
  console.log('Exportação das 6 ferramentas/definições idêntica à fonte da parte 2.')
}
