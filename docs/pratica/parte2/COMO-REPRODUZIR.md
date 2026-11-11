# Reprodução da parte 2

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
