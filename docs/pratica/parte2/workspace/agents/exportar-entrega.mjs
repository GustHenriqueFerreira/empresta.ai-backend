// Exporta documentação/ferramentas, nunca uma segunda cópia dos aplicativos.
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
const raiz=path.resolve(import.meta.dirname,'..')
const sha=b=>createHash('sha256').update(b).digest('hex')
const ignorados=new Set(['node_modules','.cache','.git','.vercel','dist','coverage'])
function listar(dir){return fs.readdirSync(path.join(raiz,dir),{withFileTypes:true}).flatMap(e=>{
 if(ignorados.has(e.name)||e.name==='.env'||e.name.startsWith('.env.')||e.isSymbolicLink())return[]
 const p=dir+'/'+e.name
 return e.isDirectory()?listar(p):[p]
})}
const nomes=['AGENTS.md','PARTE-2.md','layout.md','ENTREGA.md',...listar('rules'),...listar('docs'),...listar('agents'),...listar('skills/imagens-equipamentos'),'.codex/agents/verificador-spec-pratica.toml']
const arquivos=nomes.map(caminho=>({caminho,sha256:sha(fs.readFileSync(path.join(raiz,caminho)))}))
const restaurador=`// Restaura apenas documentos/ferramentas ausentes; não sobrescreve divergências.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const origem=path.join(import.meta.dirname,'workspace'),destino=path.resolve(process.argv[2]||path.join(import.meta.dirname,'../../../..'));
if(!fs.existsSync(path.join(destino,'backend/package.json'))||!fs.existsSync(path.join(destino,'frontend/package.json')))throw Error('Clone os dois repos como backend/ e frontend/ na mesma pasta antes de restaurar.');
const hash=b=>createHash('sha256').update(b).digest('hex');const m=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'manifesto.json'),'utf8'));
for(const f of m.arquivos){if(f.caminho.startsWith('/')||f.caminho.split('/').includes('..')||/(^|\\/)\\.env($|\\.)/.test(f.caminho))throw Error('Caminho inválido');if(hash(fs.readFileSync(path.join(origem,f.caminho)))!==f.sha256)throw Error('Exportação divergente: '+f.caminho);const alvo=path.join(destino,f.caminho);if(fs.existsSync(alvo)&&hash(fs.readFileSync(alvo))!==f.sha256)throw Error('Preservado arquivo existente divergente: '+f.caminho);}
let criados=0;for(const f of m.arquivos){const alvo=path.join(destino,f.caminho);if(fs.existsSync(alvo))continue;fs.mkdirSync(path.dirname(alvo),{recursive:true});fs.writeFileSync(alvo,fs.readFileSync(path.join(origem,f.caminho)),{flag:'wx'});criados++;}console.log(criados+' documentos/ferramentas restaurados; nenhum app, ambiente ou arquivo divergente sobrescrito.');
`
const roteiro=`# Reprodução da parte 2

Este diretório espelha documentos/ferramentas do workspace; não contém outra cópia de front/back, .env, node_modules, cache ou credenciais. manifesto.json vincula cada arquivo por SHA256. As fontes dos apps estão nas raízes normais dos dois repositórios.

1. Clone empresta.ai-backend como backend/ e empresta.ai-frontend como frontend/, lado a lado numa pasta nova.
2. No backend, rode npm ci; no frontend, npm ci. Não use segredos de produção nos testes.
3. A partir da pasta comum, execute node backend/docs/pratica/parte2/restaurar-ferramentas.mjs. Ele verifica hashes e só cria documentos/ferramentas ausentes; se houver conteúdo divergente, interrompe sem sobrescrever. Não duplica os apps.
4. Execute npm ci --prefix skills/imagens-equipamentos para a dependência sharp já aprovada e travada no lockfile da skill.
5. Docker precisa estar iniciado e a imagem postgres:16 disponível (docker pull postgres:16, se ainda não existir). Os testes usam containers próprios, sem volumes de dados existentes, com porta apenas loopback e limpeza do próprio container.

Comandos a partir da pasta comum:

    npm test --prefix backend
    npm run build --prefix backend
    npm run build --prefix frontend
    node backend/node_modules/jest/bin/jest.js --config=frontend/tests/jest.config.cjs --runInBand
    node --experimental-vm-modules backend/node_modules/jest/bin/jest.js --config=backend/db/pratica/entrega-3/jest.config.cjs --runInBand

Checagem remota separada, apenas GETs públicos, sem login/escrita:

    node backend/node_modules/jest/bin/jest.js --config=backend/testing/jest-publico.config.cjs --runInBand

Para a jornada automatizada, dentro de backend execute node --import tsx testing/servir-ui.mjs. Abra o URL loopback impresso e, no executor CUA autorizado, invoque executarJornada(aba) de frontend/testing/jornada-comportamento.cua.mjs. A fonte contém asserções, não é só inspeção visual nem Jest. Contas/senhas ali são fixtures .invalid, sem validade externa. Encerramento da fixture para seu próprio processo: POST /__fixture/encerrar no endereço local de Auth informado em backend/.cache/ui-local.json. Nunca substitua esse destino por produção.

O gate é agents/rodar-verificador.mjs --pacote CAMINHO --codex CAMINHO_CODEX_EXE, executado com node, sem ferramentas/credenciais para o revisor. Pacotes e pareceres literais de cada rodada estão em workspace/docs/pratica/revisoes-finais/. Os caminhos backend/... e frontend/... citados na documentação são da disposição de workspace acima; no GitHub, consulte o repositório correspondente.

Não reaplique SQL em produção para reproduzir testes. MATERIAL-PARA-REVISAO.json é anterior à aplicação, não recibo. Provas posteriores registram banco/Storage/jornada reais e ressalvas do escopo vigente. Nenhum teste usa a conta do professor, dispensada pelo responsável.
`
for(const repo of ['backend','frontend']){
 const base=path.join(raiz,repo,'docs/pratica/parte2'),destino=path.join(base,'workspace')
 const anterior=fs.existsSync(path.join(base,'manifesto.json'))?JSON.parse(fs.readFileSync(path.join(base,'manifesto.json'),'utf8')):null
 for(const f of arquivos){const alvo=path.join(destino,f.caminho);if(fs.existsSync(alvo)){const atual=sha(fs.readFileSync(alvo));if(atual!==f.sha256&&atual!==anterior?.arquivos.find(x=>x.caminho===f.caminho)?.sha256)throw Error('Espelho foi editado externamente: '+alvo)}}
 for(const f of arquivos){const alvo=path.join(destino,f.caminho);fs.mkdirSync(path.dirname(alvo),{recursive:true});fs.copyFileSync(path.join(raiz,f.caminho),alvo);if(sha(fs.readFileSync(alvo))!==f.sha256)throw Error('Cópia divergente')}
 fs.writeFileSync(path.join(base,'manifesto.json'),JSON.stringify({versao:1,geradoEm:new Date().toISOString(),arquivos},null,2)+'\n')
 fs.writeFileSync(path.join(base,'restaurar-ferramentas.mjs'),restaurador)
 fs.writeFileSync(path.join(base,'COMO-REPRODUZIR.md'),roteiro)
 const entrega=fs.readFileSync(path.join(raiz,'ENTREGA.md'),'utf8').replace(/\]\((docs\/[^)]+|agents\/[^)]+|skills\/[^)]+)\)/g,'](docs/pratica/parte2/workspace/$1)').replace(/\]\(frontend\/([^)]+)\)/g,'](https://github.com/GustHenriqueFerreira/empresta.ai-frontend/blob/entrega-pratica/$1)')
 fs.writeFileSync(path.join(raiz,repo,'ENTREGA.md'),entrega)
 console.log(repo+': '+arquivos.length+' documentos/ferramentas conferidos; aplicativos não duplicados.')
}
