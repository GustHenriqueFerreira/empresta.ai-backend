# 04 — Integração do frontend, API e Supabase

Status: implementação existente; aceite formal pendente. Login e GET /api/me validados em 19/10/2026; jornada completa e concorrência ainda sem evidência suficiente.

## Objetivo

Substituir a demonstração em memória pelo fluxo React → API NestJS REST →
PostgreSQL no Supabase, com identidade real, persistência e acesso por papel.

## Escopo

Entra:
- Inicializar o backend TypeScript/NestJS, com controllers, serviços e acesso a
  dados por Prisma; validar entradas com Zod e testar regras com Jest.
- Login por e-mail/senha no Supabase Auth pelo frontend, restauração e renovação
  de sessão, logout e envio do access token à API como Bearer.
- API verifica o token no Supabase e obtém o perfil real; papel e usuário nunca
  são aceitos do corpo da requisição como autoridade.
- Catálogo real, solicitação persistida, Meus empréstimos e devolução.
- Operações: lista de empréstimos abertos, indicadores, devolução no balcão e
  cadastro de equipamento conforme layout.md.
- Remover dados de exemplo como fonte da aplicação. Banco vazio permanece vazio.
- Configuração local, comandos de execução e documentação atualizados.

Fica fora:
- Next.js, SSR, troca de stack, mudanças em ADRs ou PRD.
- Cadastro público de usuários, recuperação de senha, promoção automática de
  papéis, criação de conta privilegiada e criação de dados fictícios no Supabase.
- Deploy, estratégia oficial de migrations e funcionalidades fora da v1.

## Fontes aplicadas

- docs/PRD.md: cinco funcionalidades e quatro regras da v1.
- docs/adr/001-stack.md; docs/adr/002-design-system.md.
- layout.md §5–8 e regras de negócio/segredos/operação/testes.
- Specs 01/02: substitui explicitamente a sessão simulada, os mocks e as abas
  provisórias. Spec 03: reaproveita o schema aprovado, sujeito à inspeção real.

## Contratos e segurança

- GET /api/health: disponibilidade da API, sem credenciais ou detalhes internos.
- GET /api/me: identidade e papel obtidos da sessão verificada.
- GET /api/equipamentos: catálogo autenticado, ordenado por cadastro decrescente.
- GET /api/emprestimos/meus: empréstimos abertos da pessoa autenticada.
- POST /api/emprestimos: equipamentoId UUID; usuário vem da sessão.
- POST /api/emprestimos/:id/devolucao: dono ou Operações.
- GET /api/operacoes: empréstimos abertos e indicadores; somente Operações.
- POST /api/equipamentos: nome, categoria, patrimônio opcional, observações e
  situação inicial disponível/manutenção; somente Operações.
- Token ausente/inválido retorna 401; acesso sem papel retorna 403; entrada
  inválida retorna 400; indisponibilidade e conflitos de negócio têm mensagem
  operacional e não revelam SQL ou credenciais.
- RLS permanece ativa: operações Prisma executam em transação com papel SQL
  authenticated e claims da identidade validada, sem usar service_role ou o
  privilégio administrativo da conexão como autorização do usuário.
- Solicitação/devolução reutilizam as funções de banco aprovadas. Solicitações
  concorrentes da mesma pessoa são serializadas antes de validar limite/atraso;
  a proteção deve alcançar também chamadas diretas às funções do banco.
- Colaborador recebe somente detalhes dos próprios empréstimos. Para item com
  terceiro, catálogo mostra apenas “Emprestado”, sem nome ou prazo do terceiro.
  Essa decisão prioriza a privacidade do PRD/RLS sobre o detalhe do protótipo
  em layout.md §7.7 e fica explícita para revisão desta proposta.
- “Entrar como Operações” exige as mesmas credenciais e perfil autorizado;
  nunca concede papel por clique. Colaborador autenticado não acessa essa área.

## Estados e interações

- Carregamento explícito em sessão, listas e envios; botões de confirmação
  desabilitados durante requisição, sem confirmação duplicada.
- Após solicitar/devolver/cadastrar, atualizar os dados da API; só mostrar
  sucesso após persistência confirmada. Recarregar mantém o estado salvo.
- Sessão expirada volta ao login, limpando dados privados. Falha de rede não
  inventa resultados e permite tentar novamente.
- Colaborador entra no Catálogo; Operações entra em Operações. Abas e atalhos
  seguem layout.md §6; a identidade vem do perfil, sem Ana Ribeiro fixa.
- Datas em DD/MM/AAAA; atraso e prazo calculados pelo banco no fuso de Brasília.
- Preservar Nocturne, formulários, modais, toasts e comportamento visual.
- Validação completa da jornada exige ambiente isolado adequado. A criação excepcional de conta/itens de demonstração foi autorizada em 19/10/2026; isso não autoriza testes de escrita em produção nem promoção de papéis.

## Copy

- Login em envio: “Entrando…”; inválido: “E-mail ou senha inválidos.”
- Sem perfil: “Perfil não encontrado. Procure o responsável pelo sistema.”
- Papel insuficiente: “Acesso permitido somente a Operações.”
- Sessão expirada: “Sua sessão expirou. Entre novamente.”
- Carregamento: “Carregando…”; erro: “Não foi possível carregar os dados.”
  com ação “Tentar novamente”.
- Catálogo vazio: “Nenhum equipamento cadastrado.”
- Busca sem resultados: “Nenhum equipamento encontrado para a busca ou o filtro atual.”
- Meus empréstimos vazio: “Você não tem empréstimos em aberto.” + “Ir ao catálogo”.
- Operações vazia: “Nenhum empréstimo em aberto.”
- Sucesso de solicitação: “Empréstimo registrado. Devolva até {data}.”
- Devolução: “Devolução registrada.”; cadastro: “Equipamento cadastrado.”
- Nome obrigatório: “Informe o nome do equipamento”. Demais mensagens de
  bloqueio, labels e modais seguem layout.md e spec 03.

## Critérios de aceitação

- CA-01: login real, isolamento por usuário e restauração segura de sessão.
- CA-02: catálogo reflete banco, inclusive vazio/erro, sem fallback fictício.
- CA-03: solicitar persiste e atualiza catálogo e empréstimos após recarregar.
- CA-04: dono devolve e item volta a disponível, liberando o slot.
- CA-05: Operações vê todos os abertos e registra devolução; colaborador recebe
  recusa na API mesmo chamando os endpoints sem a interface.
- CA-06: quarta solicitação recusada, inclusive sob concorrência.
- CA-07: prazo é hoje + 14 dias no fuso de Brasília.
- CA-08: empréstimo vencido bloqueia nova solicitação.
- CA-09: manutenção nunca é solicitável nem contada como disponível.
- Cadastro permitido somente a Operações, com fallback TI-— para patrimônio vazio.

## Plano de verificação e aplicação

1. Inspecionar tabelas, funções, RLS e estrutura existentes por consultas de
   leitura antes de aplicar SQL; não presumir banco vazio ou schema instalado.
2. Se faltar o schema, revisar e aplicar baseline da spec 03 com autorização
   da etapa de banco. Alterações posteriores ficam em SQL adicional versionado;
   não decidir ferramenta de migrations nem reescrever histórico aplicado.
3. Revisar impacto antes da execução remota; preservar dados existentes e não
   usar produção para testes de escrita. Informar aplicação remota necessária.
4. Executar build TypeScript de backend/frontend e Jest para validação,
   autorização, limite/atraso, conflitos e contratos; usar ambiente isolado nos
   testes que exigem escrita. Registrar o que não pôde ser validado.
5. Verificar API local, CORS para origem configurada, rejeição de token inválido
   e integração de leitura com o banco real, sem expor informações privadas.
6. Verificar visualmente login/listas/formulários quando ferramenta disponível;
   documentar requisitos de usuário de teste em ambiente isolado para a jornada.
7. Atualizar comandos, exemplos sem valores, handoff e status da spec somente
   após registrar evidências e pendências reais. Deploy continua manual.

## Evidências e limites — 19/10/2026

- API NestJS, Prisma/Zod, Supabase Auth/RLS e frontend integrados; mocks removidos.
- Builds de backend e frontend passaram. Jest cobre contratos HTTP, autorização
  e nove cenários SQL isolados em PostgreSQL WASM, sem escrever no Supabase.
- Baseline 001 e complemento versionado 002 aplicados ao banco inspecionado
  vazio; tabelas com RLS, proteção de concorrência por pessoa e EXECUTE restrito.
- Leitura real confirmou TLS, caminho Prisma com papel authenticated e RLS;
  configuração pública do Auth retornou 200. API health 200; sem token e com
  token inválido, 401; CORS alinhado à origem local.
- Contas/perfis no projeto: zero na inspeção. Não criar conta privilegiada nem
  fixtures no remoto; responsável precisa criar conta real e atribuir Operações
  manualmente. Persistência por login de usuário real ainda não foi exercitada.
- Concorrência entre sessões precisa de teste adicional em PostgreSQL isolado
  com múltiplas conexões; o teste WASM não comprova esse cenário.
- Ajuste responsivo do login evita overflow em painel estreito, preservando
  tokens Nocturne e layout desktop. Estratégia de migrations e deploy inalterados.
