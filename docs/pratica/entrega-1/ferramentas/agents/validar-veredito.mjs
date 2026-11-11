// Decisão determinística do gate. Nenhum texto devolvido vira comando.
import { validarPacote } from './validar-pacote.mjs'

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
function jestConsistente(result) {
  if (result.success !== true || result.numFailedTests !== 0 || result.numFailedTestSuites !== 0
    || (result.numRuntimeErrorTestSuites || 0) !== 0 || !Array.isArray(result.testResults) || !result.testResults.length) return false
  const assertions = []
  for (const suite of result.testResults) {
    if (suite.status !== 'passed' || !Array.isArray(suite.assertionResults)) return false
    assertions.push(...suite.assertionResults)
  }
  if (assertions.some(t => !['passed', 'pending', 'todo'].includes(t.status))) return false
  return result.numTotalTestSuites === result.testResults.length && result.numPassedTestSuites === result.testResults.length
    && result.numTotalTests === assertions.length
    && result.numPassedTests === assertions.filter(t => t.status === 'passed').length
    && result.numPendingTests === assertions.filter(t => t.status === 'pending').length
    && result.numTodoTests === assertions.filter(t => t.status === 'todo').length
}
export function podeEncerrar(packet, events, report, exitCode) {
  try { validarPacote(packet) } catch { return false }
  if (exitCode !== 0 || typeof report !== 'string' || !Array.isArray(events) || events.length < 4) return false

  // Lista permitida: uma nova sessão, um turno concluído, nenhuma ferramenta.
  // Evento ou tipo novo exige revisão explícita; não presumir que é seguro.
  if (events[0]?.type !== 'thread.started' || !events[0].thread_id || events[1]?.type !== 'turn.started'
    || events.at(-1)?.type !== 'turn.completed') return false
  const items = events.slice(2, -1)
  if (!items.length || items.some(e => !['item.started', 'item.completed'].includes(e?.type)
    || !['agent_message', 'reasoning'].includes(e.item?.type))) return false
  const messages = items.filter(e => e.type === 'item.completed' && e.item.type === 'agent_message')
  if (!messages.length || messages.at(-1).item.text?.trim() !== report.trim()) return false

  const lines = report.trim().split(/\r?\n/)
  const identity = `Rodada: ${packet.rodada} | Spec: ${packet.spec} | Escopo: ${packet.escopo}`
  if (lines[0] !== identity || lines.filter(l => l.startsWith('Rodada:')).length !== 1
    || !lines.some(l => l.startsWith('Revisões:') && new RegExp(`\\b${escapeRegex(packet.revisao)}\\b`).test(l))) return false
  const verdicts = lines.filter(l => /^\s*(?:\*\*)?Veredito:/.test(l))
  if (verdicts.length !== 1 || !/^Veredito: PRONTA(?:\s*[—–-].*)?$/.test(verdicts[0]) || lines.at(-1) !== verdicts[0]) return false

  const table = lines.filter(l => l.trim().startsWith('|')).map(l => l.trim().split(/(?<!\\)\|/).slice(1, -1).map(c => c.trim()))
  if (table.length !== packet.criterios.length + 2 || table[0]?.length !== 4 || table[0][0] !== 'CA'
    || table[1]?.length !== 4 || !table[1].every(c => /^:?-+:?$/.test(c))) return false
  const rows = table.slice(2)
  if (rows.some((row, i) => row.length !== 4 || row[0] !== packet.criterios[i] || !row[1]
    || row[2] !== 'ATENDIDO' || !row[3])) return false

  if (packet.checks.some(c => c.exitCode !== 0)) return false
  const jest = packet.checks.filter(c => c.resultado)
  if (!jest.length || jest.some(c => !jestConsistente(c.resultado))) return false
  return packet.criterios.every(id => {
    const exactId = new RegExp(`(^|[^A-Za-z0-9_-])${escapeRegex(id)}(?=$|[^A-Za-z0-9_-])`)
    const tests = jest.flatMap(c => c.resultado.testResults.flatMap(s => s.assertionResults))
      .filter(t => typeof t.fullName === 'string' && exactId.test(t.fullName))
    return tests.length > 0 && tests.every(t => t.status === 'passed' && Number.isInteger(t.numPassingAsserts) && t.numPassingAsserts > 0)
  })
}
