// Gera somente a definição nativa local; não acessa rede, banco ou Git.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const source = new URL('./verificador-spec-pratica.md', import.meta.url)
const target = new URL('../.codex/agents/verificador-spec-pratica.toml', import.meta.url)
const text = readFileSync(source, 'utf8').replace(/\r\n/g, '\n')
const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
if (!match) throw new Error('Frontmatter do verificador ausente ou inválido.')
const field = name => match[1].split('\n').find(line => line.startsWith(name + ':'))?.slice(name.length + 1).trim()
const name = field('name')
const description = field('description')
if (name !== 'verificador-spec-pratica' || !description || field('model') !== 'inherit') {
  throw new Error('Nome, descrição ou herança de modelo fora do contrato.')
}
// JSON string básica é compatível com TOML; evita manter uma segunda cópia manual.
const generated = '# Gerado de agents/verificador-spec-pratica.md; não editar à mão.\n'
  + '# Permissões pertencem à sessão pai; estes campos não criam sandbox.\n'
  + `name = ${JSON.stringify(name)}\n`
  + `description = ${JSON.stringify(description)}\n`
  + `developer_instructions = ${JSON.stringify(match[2].trim())}\n\n`
  + '[features]\napps = false\nplugins = false\nmemories = false\nrequest_permissions_tool = false\n'

const args = process.argv.slice(2)
if (args.length && (args.length !== 1 || args[0] !== '--check')) throw new Error('Use sem argumentos ou --check.')
if (args[0] === '--check') {
  if (!existsSync(target) || readFileSync(target, 'utf8') !== generated) {
    console.error('Definição nativa ausente ou desatualizada. O principal deve sincronizar.')
    process.exitCode = 1
  } else console.log('Definição nativa sincronizada com a fonte canônica.')
} else {
  mkdirSync(dirname(fileURLToPath(target)), { recursive: true })
  writeFileSync(target, generated, 'utf8')
  console.log('Gerado .codex/agents/verificador-spec-pratica.toml sem alterar a fonte.')
}
