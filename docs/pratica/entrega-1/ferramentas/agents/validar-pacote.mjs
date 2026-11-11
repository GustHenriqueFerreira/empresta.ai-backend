// Integridade e completude do pacote. Hash não autentica quem executou os checks.
import { createHash } from 'node:crypto'
import { posix } from 'node:path'

const hash = value => createHash('sha256').update(value).digest('hex')
const text = value => typeof value === 'string' && value.trim().length > 0
export function validarPacote(packet, { contextoAtual = false } = {}) {
  if (!packet || packet.versao !== 1 || !['rodada', 'spec', 'escopo'].every(k => text(packet[k]) && !/[\r\n]/.test(packet[k]))
    || !Array.isArray(packet.criterios) || !packet.criterios.length
    || !packet.criterios.every(id => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id))
    || new Set(packet.criterios).size !== packet.criterios.length
    || !Array.isArray(packet.arquivos) || !packet.arquivos.length
    || !Array.isArray(packet.checks) || !packet.checks.length) throw new Error('Pacote incompleto ou critérios inválidos.')

  const paths = new Set()
  for (const file of packet.arquivos) {
    if (!file || !text(file.caminho) || /[\\:\r\n]/.test(file.caminho) || file.caminho.startsWith('/')
      || file.caminho.split('/').some(p => !p || p === '.' || p === '..')
      || /(^|\/)\.env(?:$|\.)|\.(pem|key|p12)$/i.test(file.caminho)
      || typeof file.conteudo !== 'string' || !/^[a-f0-9]{64}$/.test(file.sha256 || '')
      || paths.has(file.caminho.toLowerCase())) throw new Error('Arquivo não permitido ou duplicado.')
    paths.add(file.caminho.toLowerCase())
    if (hash(file.conteudo) !== file.sha256) throw new Error('Hash de conteúdo divergente.')
  }
  const required = ['AGENTS.md', 'rules/RESTRICTIONS.md', 'rules/CHECKS.md', 'rules/tests.md', 'rules/HANDOFF.md',
    packet.spec, posix.join(posix.dirname(packet.spec), 'plan.md'), posix.join(posix.dirname(packet.spec), 'tasks.md')]
  if (contextoAtual) required.push('PARTE-2.md', 'rules/spec-flow-pratica.md', 'docs/parte2/HANDOFF.md')
  if (required.some(p => !packet.arquivos.some(f => f.caminho === p))) throw new Error('Documento obrigatório ausente do pacote.')

  const serialized = JSON.stringify(packet).replaceAll('postgresql://user:secret@example.invalid/postgres', 'FIXTURE')
  if (/postgres(?:ql)?:\/\/[^\s:/]+:[^\s@]+@|sb_secret_[\w-]+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(serialized)) {
    throw new Error('Possível segredo no pacote; nenhum conteúdo será enviado.')
  }
  const revision = hash(JSON.stringify(packet.arquivos.map(f => [f.caminho, f.sha256])))
  if (packet.revisao !== revision || packet.checks.some(c => !c || c.revisao !== revision || c.executor !== 'principal'
    || !text(c.comando) || !Number.isInteger(c.exitCode) || !text(c.executadoEm) || !Number.isFinite(Date.parse(c.executadoEm)))) {
    throw new Error('Checks sem executor, data ou vínculo com a revisão.')
  }
  return true
}
