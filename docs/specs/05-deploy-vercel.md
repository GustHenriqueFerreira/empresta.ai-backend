# 05 — Inicialização e diagnóstico do backend na Vercel

Status: implementada após aprovação em 19/10/2026; verificação remota pendente de redeploy.

## Contexto e objetivo

O build inicial executou somente tsc e falhou por ausência do Prisma Client.
Foi orientada geração explícita antes do build. O domínio público informado
retornou HTTP 500/FUNCTION_INVOCATION_FAILED em /api/health. O usuário informa
ausência de logs no painel; sem exceção de runtime, a causa remota não está
confirmada. A configuração atual omite o nível error do Nest e lê a CA com
__dirname, caminho que depende da disposição dos arquivos após empacotamento.

## Escopo

Entra:
- Tornar o build do pacote autossuficiente: gerar Prisma antes de tsc, sem
  migration, seed ou conexão ao banco durante a geração.
- Incluir o certificado público certs/supabase-ca.crt na função Vercel e usar
  caminho estável baseado na raiz de execução, conforme orientação Vercel.
- Validar configuração de inicialização e produzir diagnósticos sanitizados
  úteis (nome da variável ausente, certificado ausente, código de erro seguro),
  sem imprimir valores, conexão, tokens ou SQL. Capturar falhas de bootstrap
  sem suprimir a causa operacional nem permitir despejo de segredos pelo Nest.
- Manter entrypoint src/main.ts, API NestJS, Prisma/Zod, Supabase/RLS e TLS com
  validação de CA e hostname. Usar o lifecycle suportado pela Vercel.
- Documentar variáveis, build, branch master e inspeção de /api/health.
- Testar build e diagnóstico em ambiente isolado antes de enviar correção ao
  GitHub, sob autorização já dada para publicar o backend.

Fica fora:
- Alterar requisitos, ADRs, tabelas, RLS ou regras de empréstimo.
- Desativar TLS, incluir .env no Git, gerar usuários ou dados fictícios remotos.
- Alterar contas/permissões Vercel ou executar migrações como parte do build.
- Afirmar sucesso do deploy antes de verificar resposta pública após redeploy.

## Fontes

- ADR 001/002, PRD e spec 04 para preservar stack, dados e autorização.
- AGENTS.md §2.1; rules/SECRETS.md, operation.md e tests.md.
- Prisma: geração explícita do cliente antes de build de produção.
- Vercel: NestJS entrypoint, inclusão de arquivos em Functions e process.cwd().

## Copy e estados

- Sucesso de saúde permanece {"status":"ok"} em GET /api/health.
- Falha de configuração em log: “Configuração ausente: {nome da variável}”.
- Falha de CA: “Certificado do banco não encontrado na distribuição”.
- Falha não classificada: “Não foi possível iniciar a API” com código/classe
  segura, sem mensagem bruta, stack com dados ou conteúdo de ambiente.
- Erros de inicialização impedem servir a aplicação com configuração parcial.
- Não registrar corpo, senha, cookies ou Authorization de requisições.

## Critérios

- CA-01–CA-09: comportamentos e controles existentes preservados; esta tarefa
  trata do ambiente necessário para executá-los, sem fechar jornadas pendentes.
- Build de backend gera o cliente automaticamente antes da checagem TypeScript.
- Função empacotada inclui e localiza a CA pública e preserva TLS verificado.
- Configuração inválida gera diagnóstico acionável sem divulgar segredos.
- API válida inicia e responde /api/health; sessão inválida continua recusada.
- Sucesso remoto só será registrado com evidência de resposta pública; caso a
  Vercel exija intervenção no painel, registrar exatamente a pendência.

## Verificação

- Executar npm run build e npm test do backend.
- Reproduzir erro de variável ausente e certificado ausente em processos ou
  fixtures isolados; verificar código de saída e log sanitizado.
- Confirmar geração Prisma sem escrever no banco e conferir arquivos incluídos
  na distribuição. Validar empacotamento Vercel quando CLI/ambiente disponíveis.
- Revisar diff e arquivos versionados antes de commit/push; nenhum .env ou segredo.
- Após redeploy da master, testar URL pública /api/health; registrar resultado,
  limites e eventual configuração de painel necessária.

## Evidências locais — 19/10/2026

- npm run build gerou Prisma Client 7.10.1 antes de tsc e concluiu com sucesso.
- Jest: 5 suítes e 21 testes passaram, incluindo regras/RLS isoladas e sete
  cenários de configuração, certificado e diagnóstico sanitizado.
- Processo compilado completo com VERCEL=1: GET /api/health 200 com status ok;
  GET /api/me sem sessão 401. Nenhuma escrita no banco durante a validação.
- vercel.json inclui certs/supabase-ca.crt para src/main.ts; certificado público
  é lido pela raiz de execução. TLS continua verificando CA/hostname.
- Não foi executado empacotamento local Vercel autenticado. O resultado público
  precisa ser verificado após o deploy; não confundir simulação local com sucesso remoto.
## Diagnóstico autenticado e correção do empacotamento — 19/10/2026

- Log de build confirmou `unused_function`: o padrão src/main.ts em functions
  não corresponde à função index da integração nativa NestJS. Override removido;
  framework/build permanecem na configuração Vercel.
- CA passou a leitura estática join(process.cwd(), certs/supabase-ca.crt) para
  permitir rastreamento pelo empacotador, sem parâmetro de diretório em runtime.
- Projeto correto não tinha variáveis Production. Usuário autorizou explicitamente
  enviar DATABASE_URL contendo senha ao projeto swvd/empresta-ai-backend-2xeh;
  configuradas as quatro variáveis necessárias via stdin, sem expor valores.
- 21 testes locais continuam passando. Nenhuma alteração de banco/ADR/PRD/TLS/RLS.
- A leitura de arquivo rastreável substitui o override de includeFiles descrito
  na primeira implementação; a evidência de bundle/runtime depende do novo deploy.