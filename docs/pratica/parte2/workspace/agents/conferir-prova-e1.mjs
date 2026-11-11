// Testes do gate sobre as evidências reais, sem modelo, rede ou banco.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { podeEncerrar } from './validar-veredito.mjs'
const root = new URL('../docs/pratica/entrega-1-prova/', import.meta.url)
const load = round => {
  const dir = new URL(round + '/', root)
  return { packet: JSON.parse(fs.readFileSync(new URL('pacote.json', dir))),
    events: fs.readFileSync(new URL('sessao.jsonl', dir), 'utf8').trim().split(/\r?\n/).map(l => JSON.parse(l)),
    report: fs.readFileSync(new URL('relatorio.md', dir), 'utf8') }
}
for (const [round, expected] of [['01-baseline', false], ['02-baseline-corrigido', true], ['03-erro', false], ['04-restaurado', true]]) {
  const { packet, events, report } = load(round)
  assert.equal(podeEncerrar(packet, events, report, 0), expected, round)
}
const { packet, events, report } = load('04-restaurado')
assert.equal(podeEncerrar(packet, events, 'Veredito: PRONTA', 0), false, 'frase sem tabela não aprova')
assert.equal(podeEncerrar({ ...packet, checks: [] }, events, report, 0), false, 'sem execução atual não aprova')
assert.equal(podeEncerrar(packet, events, report, 1), false, 'processo falho não aprova')
assert.equal(podeEncerrar({ ...packet, criterios: [...packet.criterios, 'CA-INEXISTENTE'] }, events, report, 0), false, 'critério omitido não aprova')
assert.equal(podeEncerrar(packet, [...events, { type: 'item.completed', item: { type: 'file_change' } }], report, 0), false, 'escrita do revisor bloqueia')
const before = fs.readFileSync(new URL('backend/src/contracts.spec.ts', new URL('../', import.meta.url)))
const restored = fs.readFileSync(new URL('backend/.cache/prova-e1/contracts.spec.ts', new URL('../', import.meta.url)))
assert.ok(before.equals(restored), 'cópia deve permanecer restaurada')
console.log('9 cenários do gate passaram; cópia isolada restaurada e idêntica ao original.')
