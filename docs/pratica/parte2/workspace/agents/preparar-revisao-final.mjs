// Monta somente o pacote explícito do principal; não executa relatório nem lê .env.
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { validarPacote } from './validar-pacote.mjs'
const [numero, tentativa] = process.argv.slice(2)
if (!['006','007'].includes(numero) || !/^[a-z0-9-]+$/.test(tentativa||'')) throw Error('Use 006|007 e tentativa nova.')
const raiz = path.resolve(import.meta.dirname, '..')
const hash = t => createHash('sha256').update(t).digest('hex')
const spec = `docs/specs/${numero==='006'?'006-dados-iniciais':'007-solicitar-emprestimo'}/spec.md`
const comuns = ['AGENTS.md','rules/RESTRICTIONS.md','rules/CHECKS.md','rules/tests.md','rules/HANDOFF.md',
  'rules/SECRETS.md','rules/migrations.md',
  'PARTE-2.md','rules/spec-flow-pratica.md','docs/parte2/HANDOFF.md','docs/PRD.md',
  'docs/adr/001-stack.md','docs/adr/002-design-system.md','docs/adr/003-processamento-imagens.md',
  'layout.md','agents/verificador-spec-pratica.md',spec,path.posix.join(path.posix.dirname(spec),'plan.md'),
  path.posix.join(path.posix.dirname(spec),'tasks.md'), 'docs/pratica/planejamento/decisoes-pendentes.md',
  'backend/prisma/schema.prisma','backend/db/pratica/entrega-3/001-imagens.sql',
  'backend/db/pratica/entrega-3/000-inventario.sql','backend/db/pratica/entrega-3/003-conferir-professor.sql',
  'backend/db/pratica/entrega-3/README.md','backend/db/pratica/entrega-3/schema-proposto.prisma',
  'backend/db/001-schema-inicial.sql','backend/db/002-integracao.sql','backend/db/pratica/entrega-3/material/inventario.json',
  'docs/pratica/entrega-3-dados-prova/inventario-consulta-20261111-072047.json',
  'backend/package.json','frontend/package.json','backend/db/pratica/entrega-3/jest.config.cjs','backend/db/pratica/entrega-3/tsconfig.json',
  'skills/imagens-equipamentos/package.json','skills/imagens-equipamentos/scripts/pipeline.ts',
  'backend/db/pratica/entrega-3/preparar.ts','backend/db/pratica/entrega-3/tests/preparar.spec.ts',
  'backend/db/pratica/entrega-3/tests/material-escolhido.spec.ts',
  'backend/db/pratica/entrega-3/material/000-aplicar-pratica.sql','backend/db/pratica/entrega-3/material/002-dados.sql',
  'backend/db/pratica/entrega-3/material/plano.json','backend/db/pratica/entrega-3/material/MATERIAL-PARA-REVISAO.json',
  'backend/db/pratica/entrega-3/material/manifesto.escolhido-com-ressalvas.json',
  'agents/preparar-material-escolhido-e3.ts','backend/testing/conferir-material.mjs','backend/testing/postgres-isolado.mjs',
  'backend/testing/verificar-imagens-publicas.mjs','backend/testing/publicadas.spec.cjs','backend/testing/jest-publico.config.cjs',
  'docs/pratica/entrega-3-dados-prova/aplicacao-producao-20261111.json',
  'docs/pratica/entrega-3-dados-prova/imagens-publicas-20261111.json',
  'docs/pratica/entrega-3-dados-prova/catalogo-producao-20261111.json',
  'docs/pratica/entrega-3-dados-prova/storage-politicas-20261111.json']
const produto = ['backend/src/app.service.ts','backend/src/app.service.spec.ts','backend/src/imagens.ts','backend/src/imagens.spec.ts',
  'backend/src/app.controller.ts','backend/src/contracts.ts','backend/src/contracts.spec.ts','backend/src/database.service.ts',
  'backend/src/auth.guard.ts','backend/src/http.spec.ts','backend/src/concorrencia.spec.ts','backend/src/database.integration.spec.ts',
  'backend/src/fluxo-completo.spec.ts','backend/testing/conferir-fluxo-completo.mjs',
  'backend/testing/postgres-isolado.mjs','backend/testing/conferir-regras.mjs','backend/testing/servir-ui.mjs',
  'backend/db/001-schema-inicial.sql','backend/db/002-integracao.sql',
  'frontend/src/App.tsx','frontend/src/types.ts','frontend/src/components/Dialog.tsx',
  'frontend/src/features/catalogo/Catalogo.tsx','frontend/src/features/catalogo/Catalogo.css','frontend/src/features/catalogo/ImagemEquipamento.tsx',
  'frontend/src/features/gestao/Gestao.tsx','frontend/src/utils/api.ts','frontend/src/utils/datas.ts',
  'frontend/tests/catalogo.spec.tsx','frontend/tests/datas.spec.tsx','frontend/tests/dialog.spec.tsx',
  'frontend/tests/emprestimos.spec.tsx','frontend/tests/tsconfig.json','frontend/tests/style.cjs',
  'frontend/tests/jest.config.cjs','frontend/testing/harness.tsx',
  'frontend/testing/jornada-comportamento.cua.mjs',
  'docs/pratica/entrega-4-interface-prova/jornada-local-20261111.json',
  'docs/pratica/entrega-4-interface-prova/jornada-automatizada-rodada-03.json',
  'docs/pratica/entrega-4-interface-prova/jornada-producao-20261111.json']
const listar=(dir)=>fs.readdirSync(path.join(raiz,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?listar(dir+'/'+e.name):[dir+'/'+e.name])
const candidatos=[...comuns,...listar('rules').filter(p=>p.endsWith('.md')),...(numero==='007'?[...produto,...listar('frontend/src'),...listar('backend/src').filter(p=>p.endsWith('.ts'))]:[])]
const nomes=[...new Map(candidatos.map(p=>[p.toLowerCase(),p])).values()].map(p=>comuns.find(c=>c.toLowerCase()===p.toLowerCase())||p)
const arquivos = nomes.map(caminho=>{
  let conteudo=fs.readFileSync(path.join(raiz,caminho),'utf8')
  if(caminho==='rules/HANDOFF.md')conteudo=conteudo.slice(conteudo.lastIndexOf('\n## ')+1)
  return {caminho,conteudo,sha256:hash(conteudo)}
})
const revisao=hash(JSON.stringify(arquivos.map(f=>[f.caminho,f.sha256])))
const checks=[]
const adicionarJest=(relativo,comando)=>{
  const resultado=JSON.parse(fs.readFileSync(path.join(raiz,relativo),'utf8'))
  if(!resultado.success||resultado.numFailedTests)throw Error('Não usar resultado com falha como verde: '+relativo)
  checks.push({executor:'principal',comando,exitCode:0,revisao,executadoEm:new Date(resultado.startTime).toISOString(),resultado})
}
adicionarJest('backend/db/pratica/entrega-3/.cache/jest-escolhas-material-exato.json','backend/db/pratica/entrega-3: node --experimental-vm-modules ../../../node_modules/jest/bin/jest.js --config=jest.config.cjs --runInBand (18 casos; SQL exato em Docker próprio)')
adicionarJest('backend/.cache/jest-publico-fechamento-02.json','backend: node node_modules/jest/bin/jest.js --config=testing/jest-publico.config.cjs --runInBand (somente GET público, sem credenciais)')
if(numero==='007'){
  adicionarJest('backend/.cache/jest-fluxo-revisao-final.json','backend: node node_modules/jest/bin/jest.js --runInBand (43 casos, HTTP/Prisma/PostgreSQL próprio autorizado)')
  adicionarJest('frontend/tests/resultados-proprios-final.json','frontend: node ../backend/node_modules/jest/bin/jest.js --config=tests/jest.config.cjs --runInBand (13 casos)')
  const jornada=JSON.parse(fs.readFileSync(path.join(raiz,'docs/pratica/entrega-4-interface-prova/jornada-automatizada-rodada-03.json'),'utf8'))
  if(!jornada.sucesso||jornada.casos.some(c=>!c.passou))throw Error('Jornada automatizada não passou')
  checks.push({executor:'principal',comando:'CUA: executarJornada(aba do harness loopback) em frontend/testing/jornada-comportamento.cua.mjs',exitCode:0,revisao,executadoEm:jornada.inicio,jornada})
}
for(const check of JSON.parse(fs.readFileSync(path.join(raiz,'backend/.cache/builds-fechamento.json'),'utf8'))){
  if(check.exitCode!==0)throw Error('Build atual não passou')
  checks.push({...check,revisao})
}
const commits=Object.fromEntries(['backend','frontend'].map(repo=>[repo,execFileSync('git',['rev-parse','HEAD'],{cwd:path.join(raiz,repo),encoding:'utf8'}).trim()]))
const pacote={versao:1,rodada:`E${numero==='006'?3:4}-final-${tentativa}-20261111`,spec,
  escopo:'Tudo que implementa esta spec nos dois repositórios; fontes atuais e provas explícitas, incluindo ressalvas do escopo autorizado',
  criterios:numero==='006'?['DI-CA-01','DI-CA-02','DI-CA-03','DI-CA-05','DI-CA-06','DI-CA-07']:Array.from({length:11},(_,i)=>'EM-CA-'+String(i+1).padStart(2,'0')),
  revisao,commits,arquivos,checks,
  limites:'Não inventar testes/execução humana/revisão visual. Conta do professor dispensada pelo responsável; fotos ilustrativas com ressalvas. PRONTA somente para o escopo vigente, sem equiparar ao enunciado original. Provas CUA complementam testes automatizados, não são Jest. Não aprovar jornada real se a prova atual não foi anexada.'}
validarPacote(pacote,{contextoAtual:true})
const pasta=path.join(raiz,'docs/pratica/revisoes-finais',pacote.rodada)
fs.mkdirSync(pasta,{recursive:true})
fs.writeFileSync(path.join(pasta,'pacote.json'),JSON.stringify(pacote,null,2)+'\n',{flag:'wx'})
console.log(path.relative(raiz,path.join(pasta,'pacote.json'))+'; revisão '+revisao)
