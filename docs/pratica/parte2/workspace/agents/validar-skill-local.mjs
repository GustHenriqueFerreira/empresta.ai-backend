// Validação estrutural sem instalar PyYAML. Reutiliza js-yaml do Jest existente.
// O quick_validate.py do skill-creator não executa sem PyYAML neste ambiente.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const require = createRequire(new URL('../backend/package.json', import.meta.url))
const yaml = require('js-yaml')
const root = fileURLToPath(new URL('../', import.meta.url))
const skill = path.join(root, 'skills/imagens-equipamentos')
const content = fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8')
const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
if (!match) throw new Error('Frontmatter ausente.')
const meta = yaml.load(match[1])
const allowed = ['name', 'description', 'license', 'allowed-tools', 'metadata']
if (!meta || typeof meta !== 'object' || Array.isArray(meta) || Object.keys(meta).some(k => !allowed.includes(k))
  || typeof meta.name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name) || meta.name.length > 64
  || typeof meta.description !== 'string' || !meta.description.trim() || meta.description.length > 1024
  || /[<>]|\[TODO:/.test(meta.description) || /^\s*\[TODO:.*\]\s*$/m.test(content.slice(match[0].length))) throw new Error('Metadados inválidos ou scaffold incompleto.')
for (const link of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
  if (/^https?:/.test(link[1])) continue
  if (!fs.existsSync(path.resolve(skill, link[1]))) throw new Error('Referência local ausente.')
}
const ui = yaml.load(fs.readFileSync(path.join(skill, 'agents/openai.yaml'), 'utf8'))
if (!ui?.interface?.default_prompt?.includes('$' + meta.name) || ui.interface.short_description.length < 25
  || ui.interface.short_description.length > 64) throw new Error('Metadados de interface inválidos.')
const discovered = path.resolve(root, '../.agents/skills/imagens-equipamentos/SKILL.md')
if (!fs.readFileSync(discovered).equals(Buffer.from(content))) throw new Error('Entrada de descoberta divergente.')
console.log('SKILL.md, YAML de interface, referências locais e entrada .agents/skills válidos. Validação local; não é o quick_validate.py.')
