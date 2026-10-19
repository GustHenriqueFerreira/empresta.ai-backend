# Handoff em tempo real
> **Nota de escopo (2026-10-01).** Este log foi escrito contra um estado de
> repositório que NÃO é o atual: nele existiam `docs/rules/` (as regras hoje
> vivem em `rules/`), `docs/adr/002-estrutura.md` e
> `docs/adr/003-design-system.md` (neste repositório os ADRs são
> `001-stack.md` e `002-design-system.md`), `backend/` com código Prisma
> (`backend/src/`, `backend/prisma/`) e `frontend/src/App.jsx` (aqui o front é
> TypeScript: `frontend/src/App.tsx`). `docs/andar-zero.md` também não existe
> aqui. Não trate as tarefas registradas abaixo como concluídas neste
> repositório: verifique o estado real do disco antes de agir.



## Pergunta / tarefa (atual — novo ADR de design system)
Criar um novo ADR para o design system do produto, usando `layout.md` como referência.

## Contexto (atual — novo ADR de design system)
O layout estabelece a linguagem visual Nocturne adaptada à marca EMPREST.AI, com tokens de cor, semântica de estados, tipografia, espaçamento, raios, elevação e padrões para componentes e páginas. ADRs existentes são 001 (stack) e 002 (estrutura); o novo documento recebe o número 003.

## Regras e restrições (atuais — novo ADR de design system)
- Seguir o fluxo e o formato documental do repositório.
- Não alterar ADRs existentes nem inventar decisões visuais ausentes do layout.
- Não modificar PRD ou assumir decisões de negócio.
- Não introduzir dependências ou contrariar a stack aprovada.
- Não executar commits ou alterar o histórico Git.

## Investigação / análise (atual — novo ADR de design system)
Não havia handoff posterior ao registro atual para esta tarefa; o handoff existente foi lido antes de iniciar. A inspeção de `layout.md` confirmou diretrizes explícitas de paleta, uso contido do teal, estados semânticos, família Raleway, hierarquia tipográfica, espaçamento e padrões de layout. A decisão pode formalizar o papel do layout como referência normativa sem alterar os valores definidos nele.

## Solução proposta (atual — novo ADR de design system)
Adicionar `docs/adr/003-design-system.md` com contexto, decisão, alternativa, consequências e limites explícitos sobre o que não fica decidido. Atualizar este handoff com implementação e validação.

## Implementação (atual — novo ADR de design system)
- Criado `docs/adr/003-design-system.md`, estabelecendo `layout.md` como referência visual normativa e regras de aplicação coerentes com o material existente.

## Validação (atual — novo ADR de design system)
- Conferidos os links relativos para `layout.md`, ADR 001 e ADR 002; os três arquivos existem.
- Revisadas as decisões contra `layout.md`: paleta e uso contido do acento, cores semânticas, tipografia, espaçamento e padrões de componentes/páginas foram refletidos sem criar valores novos.
- Confirmado que o ADR não seleciona biblioteca nem dependência e não altera ADRs existentes ou PRD.

## Estado atual (novo ADR de design system)
Concluído.

## Próximo passo (novo ADR de design system)
Usar `layout.md` e ADR 003 como referências complementares nas próximas mudanças de interface.

---

## Pergunta / tarefa (atual — atualizar AGENTS.md)
Atualizar o `AGENTS.md` com as seções “Comandos”, “Mapa de diretórios”, “Convenções não óbvias” e “Como testar”, refletindo o estado atual do projeto.

## Contexto (atual — atualizar AGENTS.md)
O pedido retoma a atualização anteriormente bloqueada. Agora existem ADR 002 e regras de spec flow, skill e operação que permitem documentar decisões verificadas sem depender da lista ausente do passo 5. O `AGENTS.md` atual não possui seção “Estado atual do projeto”, portanto as novas seções serão acrescentadas sem remover conteúdo válido.

## Regras e restrições (atuais — atualizar AGENTS.md)
- Documentar somente comandos executados com sucesso neste repositório.
- Listar somente diretórios existentes.
- Incluir como convenção não óbvia apenas informação que não seja evidente pela leitura isolada de um arquivo.
- Apontar para ADRs, sem repetir suas decisões.
- Não alterar PRD ou ADRs.
- Não executar commits ou alterar o histórico Git.

## Investigação / análise (atual — atualizar AGENTS.md)
Foram relidos o handoff, `AGENTS.md`, os dois ADRs e as regras atuais. A estrutura real contém `backend/`, `frontend/`, `docs/`, `docs/adr/`, `docs/rules/`, `backend/src/`, `backend/prisma/`, `backend/prisma/migrations/` e `frontend/src/`. Não existe script de testes nos pacotes atuais, apesar de Jest estar definido no ADR 001; isso deve ser declarado, não contornado com um comando inventado.

## Solução proposta (atual — atualizar AGENTS.md)
Executar os comandos candidatos de desenvolvimento e validação; documentar apenas os que passarem. Acrescentar um mapa enxuto de diretórios existentes, convenções realmente não óbvias e uma seção de testes que diferencie build/checagem de tipo de testes automatizados.

## Implementação (atual — atualizar AGENTS.md)
- Substituída a repetição da stack por referências aos ADRs 001 e 002.
- Acrescentada a seção “Comandos” com somente três comandos comprovados neste repositório: desenvolvimento e build do frontend, e checagem TypeScript do backend sem emissão.
- Acrescentado “Mapa de diretórios” com nove diretórios existentes.
- Acrescentada “Convenções não óbvias” com distinções sobre andar zero, regra de skill, ambientes separados, dados reais e papel histórico do handoff.
- Acrescentada “Como testar”, distinguindo build, checagem de tipos e testes de comportamento, e registrando que ainda não existe suíte automatizada configurada.

## Validação (atual — atualizar AGENTS.md)
- `npm run dev` executado em `frontend/` e servidor Vite iniciado com sucesso; encerrado após a comprovação.
- `npm run build` executado em `frontend/` com sucesso.
- `node ./node_modules/typescript/bin/tsc --noEmit --incremental false` executado em `backend/` com sucesso.
- `npm run start:dev` do backend não foi documentado porque falhou ao limpar `backend/dist` com `EPERM`.
- Confirmada a existência dos nove diretórios e de todas as referências citadas.
- Confirmadas as quatro seções pedidas, ausência de “Estado atual do projeto” e ausência de espaços residuais.
- A skill de SDLC foi consultada, mas o MCP indicado não está disponível nesta sessão; nenhuma política interna foi inventada.

## Estado atual (AGENTS.md — retomada)
Concluído.

## Próximo passo (atual — atualizar AGENTS.md)
Configurar a suíte automatizada e corrigir o bloqueio de `backend/dist` antes de acrescentar comandos correspondentes ao `AGENTS.md`.

---

## Handoff anterior

## Pergunta / tarefa (atual — regras de skill e operação)
Renomear `docs/rules/specflow.md` para `docs/rules/spec-flow.md`, criar arquivos de regras para skill e operação no mesmo diretório e manter as decisões coerentes com o projeto existente.

## Contexto (atual — regras de skill e operação)
O pedido está no contexto dos documentos de governança mantidos em `docs/rules`. Assim, “arquivo de skill” e “arquivo de operação” serão tratados como `docs/rules/skill.md` e `docs/rules/operation.md`, não como um pacote executável de Agent Skill. As fontes de verdade são PRD, ADRs, layout, andar zero e regras já existentes.

## Regras e restrições (atuais — regras de skill e operação)
- Não criar decisões de produto ou arquitetura que contradigam PRD e ADRs.
- Não apresentar critérios do andar zero como funcionalidades já implementadas.
- Não duplicar regras existentes; referenciá-las quando aplicáveis.
- Atualizar referências estruturais afetadas pela renomeação.
- Não executar commits ou alterar o histórico Git.

## Investigação / análise (atual — regras de skill e operação)
`specflow.md` existia somente em `docs/rules`; a única referência estrutural ativa fora do handoff estava na árvore do ADR 002. As demais ocorrências estão no histórico do handoff e devem permanecer como registro do nome usado na época. O projeto não possui diretório executável de skills, portanto criar documentação em `docs/rules` evita inventar uma nova unidade arquitetural. A revisão de coerência também encontrou que `docs/andar-zero.md` ainda apresentava a organização de pastas como não decidida, embora o ADR 002 já registre essa decisão posterior.

## Solução proposta (atual — regras de skill e operação)
Renomear o documento sem alterar seu conteúdo, atualizar a árvore do ADR 002 e criar `skill.md` e `operation.md` com decisões derivadas das fontes existentes, incluindo limites explícitos para evitar contradições.

## Implementação (atual — regras de skill e operação)
- Renomeado `docs/rules/specflow.md` para `docs/rules/spec-flow.md`, preservando o conteúdo.
- Criado `docs/rules/skill.md` como regra de governança para instruções reutilizáveis, sem criar uma Agent Skill executável ou nova unidade arquitetural.
- Criado `docs/rules/operation.md` com limites operacionais derivados dos ADRs, regras de ambiente, migrations, dados reais e critérios do andar zero.
- Atualizada a árvore do ADR 002 com os três nomes atuais.
- Atualizado `docs/andar-zero.md` para registrar que a estrutura foi decidida posteriormente no ADR 002, sem atribuir essa decisão ao andar zero.

## Validação (atual — regras de skill e operação)
- Confirmada a existência de `spec-flow.md`, `skill.md` e `operation.md` e a ausência do arquivo antigo `specflow.md`.
- Confirmada a existência de todas as referências locais usadas pelos novos documentos.
- Confirmada a ausência do nome antigo fora do histórico do handoff.
- Revisadas as decisões contra PRD, ADR 001, ADR 002, andar zero e regras existentes.
- Confirmada a ausência de espaços residuais nos cinco arquivos alterados.
- A skill de SDLC foi consultada, mas o MCP indicado não está disponível nesta sessão; nenhuma política interna foi inventada.

## Estado atual (regras de skill e operação)
Concluído.

## Próximo passo (atual — regras de skill e operação)
Usar `spec-flow.md`, `skill.md` e `operation.md` como regras complementares, mantendo PRD e ADRs como fontes das decisões do projeto.

---

## Handoff anterior

## Pergunta / tarefa (atual — AGENTS.md)
Atualizar `AGENTS.md` agora que o projeto possui código executável, acrescentando as seções “Comandos”, “Mapa de diretórios”, “Convenções não óbvias” e “Como testar”, e distribuindo nelas as decisões tomadas durante o andar zero.

## Contexto (atual — AGENTS.md)
Todo comando documentado precisa ter sido executado com sucesso neste repositório; o mapa deve conter apenas pastas existentes; convenções não óbvias devem registrar somente informações que não são evidentes ao abrir arquivos; e os ADRs devem ser referenciados, não repetidos.

## Regras e restrições (atuais — AGENTS.md)
- Não inventar a lista de decisões do passo 5.
- Não documentar comando sem execução bem-sucedida.
- Não listar pastas planejadas.
- Não repetir conteúdo dos ADRs.
- Não alterar PRD ou ADRs.
- Não executar commits ou alterar o histórico Git.

## Investigação / análise (atual — AGENTS.md)
O `AGENTS.md` atual não contém uma seção chamada “Estado atual do projeto”, portanto as quatro novas seções deverão ser acrescentadas em posição coerente, não substituir texto inexistente. A solicitação contém apenas o placeholder `[colar aqui a lista do passo 5]`; a busca no repositório e no handoff não encontrou essa lista. Sem ela, não é possível distribuir fielmente as decisões pedidas sem inventar conteúdo.

## Solução proposta (atual — AGENTS.md)
Solicitar a lista do passo 5. Depois de recebê-la, executar e registrar somente comandos comprovados, levantar as pastas existentes e atualizar `AGENTS.md` em uma única alteração.

## Implementação (atual — AGENTS.md)
Nenhuma alteração no `AGENTS.md` ainda; o handoff foi atualizado com a lacuna encontrada.

## Validação (atual — AGENTS.md)
- Handoff e `AGENTS.md` relidos.
- Confirmada a ausência da seção “Estado atual do projeto”.
- Busca por “passo 5” e decisões do andar zero não encontrou a lista solicitada.
- A skill de SDLC foi consultada, mas o MCP indicado não está disponível nesta sessão.

## Estado atual (AGENTS.md)
Bloqueado aguardando a lista do passo 5.

## Próximo passo (atual — AGENTS.md)
Receber a lista de decisões e atualizar o `AGENTS.md` sem inventar conteúdo.

---

## Handoff anterior

## Pergunta / tarefa (atual — ADR 002)
Criar `docs/adr/002-estrutura.md` registrando somente a organização de pastas que já existe no repositório, separando convenções herdadas dos frameworks das escolhas do projeto, registrando a alternativa não escolhida e explicitando o que fica caro de mudar depois.

## Contexto (atual — ADR 002)
A criação deste ADR foi autorizada explicitamente. A estrutura observada possui três áreas de primeira ordem: `frontend/`, `backend/` e `docs/`, além de documentos de orientação na raiz. Frontend e backend têm manifestos e lockfiles próprios. O backend contém `src/` e `prisma/`; o frontend contém `src/`, `index.html` e configuração do Vite; a documentação separa produto, ADRs e regras operacionais.

## Regras e restrições (atuais — ADR 002)
- Registrar apenas diretórios e arquivos observados na árvore real.
- Identificar como convenção herdada — e não decisão própria — os caminhos impostos ou padronizados por Nest, Vite/React, Prisma e Node.
- Tratar como decisão somente os limites escolhidos pelo projeto.
- Não alterar o ADR 001 nem o PRD.
- Não executar commits ou alterar o histórico Git.

## Investigação / análise (atual — ADR 002)
Foram confirmadas como convenções herdadas: `backend/src/main.ts` e `backend/dist` no fluxo Nest/TypeScript; `frontend/index.html`, `frontend/src/main.jsx`, `frontend/src/App.jsx` e `frontend/dist` no fluxo Vite/React; `backend/prisma/schema.prisma` e `backend/prisma/migrations/<identificador>/migration.sql` no fluxo Prisma; manifests e lockfiles por pacote no ecossistema Node. A escolha própria observada é manter frontend e backend como pacotes irmãos independentes, com documentação transversal separada em `docs/` e arquivos de ambiente delimitados por aplicação.

## Solução proposta (atual — ADR 002)
Registrar a estrutura observada em uma árvore curta; separar “Convenções herdadas” de “Decisão”; comparar a decisão com a alternativa de um único pacote na raiz contendo frontend e backend; justificar a separação por limites de execução, dependências e configuração; e listar os custos futuros de fundir os pacotes, mover os limites ou redistribuir a documentação.

## Implementação (atual — ADR 002)
Criado `docs/adr/002-estrutura.md` com:
- árvore da estrutura real, excluindo apenas artefatos gerados e arquivos locais;
- seção explícita de convenções herdadas de Nest/TypeScript, Vite/React, Prisma e Node, identificadas como não sendo decisões deste ADR;
- decisão limitada aos pacotes irmãos independentes, persistência dentro do backend, documentação transversal e configuração separada por aplicação;
- alternativa de pacote único na raiz e justificativa para não adotá-la;
- consequências, incluindo os aspectos que ficam caros de mudar depois;
- lista de pontos que o ADR deliberadamente não decide.

## Validação (atual — ADR 002)
- Conferidos 32 caminhos descritos na árvore; todos existem no repositório.
- Confirmadas as seções de convenções herdadas, decisão, alternativa, consequências e custo de mudança.
- Confirmada a ausência de espaços residuais ao fim das linhas.
- Nenhum arquivo de código, PRD ou ADR anterior foi alterado.
- A skill de SDLC foi consultada, mas o MCP indicado não está disponível nesta sessão; nenhuma política interna foi inventada.

## Estado atual (ADR 002)
Concluído.

## Próximo passo (atual — ADR 002)
Usar o ADR 002 como referência ao criar novas pastas ou propor mudança nos limites entre frontend, backend, persistência e documentação.

---

## Handoff anterior

## Pergunta / tarefa (atual — revisão de caminhos)
Analisar todo o projeto e corrigir os caminhos que estejam incorretos, desatualizados ou incompatíveis com a estrutura real do repositório.

## Contexto (atual — revisão de caminhos)
O projeto contém frontend, backend, schema e migrations Prisma, documentação de produto, ADR, layout e regras operacionais em `docs/rules`. A revisão deve considerar referências documentais, imports, scripts, arquivos de configuração e caminhos de ambiente, ignorando dependências instaladas e artefatos gerados como fonte de verdade.

## Regras e restrições (atuais — revisão de caminhos)
- Corrigir apenas divergências comprovadas pela árvore real do projeto.
- Não decidir uma nova organização de pastas, pois isso permanece fora do escopo de `docs/andar-zero.md`.
- Não alterar PRD nem ADR.
- Não expor segredos ou conteúdo de arquivos de ambiente.
- Não executar commits nem alterar o histórico Git.

## Investigação / análise (atual — revisão de caminhos)
Foram verificados os arquivos relevantes, referências documentais, imports, scripts, configuração do compilador, entrypoints, proxy da API, schema e migrations. Os caminhos de código existentes resolvem corretamente. Duas divergências foram comprovadas: `docs/rules/SECRETS.md` ainda contém placeholders de caminho e cita `.env.local`, embora o projeto use `backend/.env`, `frontend/.env` e seus respectivos `.env.example`; o `.gitignore` raiz protege arquivos de ambiente, mas não explicita os diretórios gerados `node_modules` e `dist` existentes no frontend e backend.

## Solução proposta (atual — revisão de caminhos)
Substituir os placeholders de `SECRETS.md` pelos caminhos reais e documentar a separação entre variáveis de backend e frontend. Acrescentar ao `.gitignore` raiz os quatro diretórios gerados específicos do projeto. Manter inalterados os caminhos de código e configuração que já resolvem corretamente.

## Implementação (atual — revisão de caminhos)
- Atualizado `docs/rules/SECRETS.md`: removidos placeholders de caminho; adicionados os caminhos reais de backend, frontend, schema, fontes e configuração; substituída a referência genérica a `.env.local` pelos pares `backend/.env`/`backend/.env.example` e `frontend/.env`/`frontend/.env.example`.
- Atualizado `.gitignore`: adicionados os caminhos específicos de `node_modules` e `dist` do backend e frontend, preservando a exceção dos arquivos `.env.example`.
- Imports, `sourceRoot`, `outDir`, entrypoints, proxy `/api`, schema e diretório de migrations foram mantidos porque apontam para destinos existentes.

## Validação (atual — revisão de caminhos)
- Confirmada a remoção dos placeholders das regras ativas; ocorrências restantes existem apenas no histórico do handoff.
- Confirmada a existência dos caminhos estruturais referenciados.
- Confirmada a ausência de espaços residuais nos arquivos alterados.
- Frontend: `npm run build` concluído com sucesso, validando entrypoint, imports e saída em `frontend/dist`.
- Backend: `node ./node_modules/typescript/bin/tsc --noEmit --incremental false` concluído com sucesso, validando imports e caminhos TypeScript sem gerar arquivos.
- Backend: `npm run build` encontrou corretamente o compilador, mas não concluiu porque o Windows/OneDrive negou a remoção de `backend/dist` com `EPERM`; o diretório não foi forçado nem apagado.
- Prisma: o CLI encontrou `backend/prisma/schema.prisma` e carregou `backend/.env`, mas a validação parou com P1012 porque `DIRECT_URL` não está definida no ambiente local. O arquivo sensível não foi lido nem alterado.
- A documentação oficial de SDLC não pôde ser consultada porque o MCP indicado pela skill não está disponível nesta sessão.

## Estado atual (revisão de caminhos)
Concluído, com duas limitações ambientais registradas na validação.

## Próximo passo (atual — revisão de caminhos)
Definir `DIRECT_URL` manualmente em `backend/.env` e liberar o bloqueio de `backend/dist` antes de repetir a validação completa do backend.

---

## Handoff anterior

## Pergunta / tarefa (atual — retomada)
Criar `docs/andar-zero.md` com exatamente oito critérios, AZ-01 a AZ-08, fornecidos pelo usuário.

## Contexto (atual — retomada)
O documento deve declarar que não é uma spec nem descreve comportamento de produto; deve verificar a integração da stack de `docs/adr/001-stack.md` em uma máquina limpa. Também deve conter “Fora de escopo” com as funcionalidades do PRD e “Não decidido ainda” para a organização de pastas.

## Regras e restrições (atuais — retomada)
- Não inventar nenhum critério.
- Não converter critério em tarefa técnica ou nome de biblioteca.
- Critério deve dizer o que precisa ser verdade, não como implementar.
- Não alterar PRD ou ADR.

## Investigação / análise (atual — retomada)
O usuário forneceu os oito enunciados de AZ-01 a AZ-08. O PRD foi relido e suas cinco funcionalidades da primeira versão serão listadas como fora de escopo, pois o andar zero verifica somente a integração da stack. O ADR foi relido e confirma que a estratégia de migration não foi decidida; a organização de pastas também permanecerá explicitamente não decidida.

## Solução proposta (atual — retomada)
Criar `docs/andar-zero.md` com uma abertura explícita de que não é uma spec, reproduzir exatamente os oito critérios ditados e incluir as seções “Fora de escopo” e “Não decidido ainda”.

## Implementação (atual — retomada)
Criado `docs/andar-zero.md` com:
- abertura explícita de que o documento não é uma spec e não define comportamento de produto;
- os oito critérios AZ-01 a AZ-08 exatamente como ditados;
- seção “Fora de escopo” com as cinco funcionalidades da primeira versão do PRD;
- seção “Não decidido ainda” preservando a organização de pastas como decisão em aberto.

## Validação (atual — retomada)
- Handoff relido.
- Skill de SDLC relida; o MCP indicado continua indisponível nesta sessão.
- PRD e ADR de stack relidos.
- Oito critérios recebidos e contados, de AZ-01 a AZ-08.
- Confirmada a existência do arquivo e sua leitura em UTF-8.
- Confirmados oito identificadores únicos, AZ-01 a AZ-08, sem critério adicional.
- Confirmadas as seções “Fora de escopo” e “Não decidido ainda”.
- Confirmada a ausência de espaços residuais ao fim das linhas.

## Estado atual (retomada)
Concluído.

## Próximo passo (atual — retomada)
Usar os critérios do andar zero como referência para uma futura implementação, sem tratá-los como funcionalidades do produto.

---

## Handoff anterior

## Pergunta / tarefa (atual — 2026-09-28)
Criar, dentro de `docs/rules`, os documentos `migrations.md`, `specflow.md` e um arquivo de regras de testes.

## Contexto (atual — 2026-09-28)
Os novos documentos devem orientar o fluxo de desenvolvimento do EMPREST.AI e permanecer compatíveis com o PRD, o ADR de stack, o layout e as regras já existentes em `docs/rules`.

## Regras e restrições (atuais — 2026-09-28)
- Não alterar `docs/PRD.md`, `docs/adr/001-stack.md` nem outros ADRs.
- Não decidir arquitetura ou regras de negócio novas.
- Não executar commits nem comandos que alterem o histórico Git.
- Não duplicar ou contradizer `CHECKS.md`, `RESTRICTIONS.md` e `SECRETS.md`.

## Investigação / análise (atual — 2026-09-28)
`docs/rules` já possui regras gerais de checagem, restrições, segredos e handoff, mas não possui documentos específicos para migrations, fluxo de especificação ou testes. O backend contém schema Prisma e uma migration SQL inicial em `backend/prisma/migrations`. O ADR declara a estratégia de migration como não decidida. Jest está definido na stack, porém ainda não há dependência, script ou suíte de testes configurados nos pacotes atuais. Assim, os documentos devem definir guardrails e evidências esperadas sem afirmar que esses fluxos já estão implantados.

## Solução proposta (atual — 2026-09-28)
Criar `docs/rules/migrations.md`, `docs/rules/specflow.md` e `docs/rules/tests.md`, cada um com escopo, procedimento, critérios de validação e proibições proporcionais ao projeto. A regra de migrations preservará explicitamente como não decididos o fluxo de aplicação, deploy e rollback; a regra de testes registrará Jest como escolha do ADR, mas distinguirá isso da configuração ainda pendente.

## Implementação (atual — 2026-09-28)
- Criado `docs/rules/migrations.md` com fontes de verdade, fluxo obrigatório, tratamento de mudanças destrutivas, validação e pontos ainda não decididos pelo ADR.
- Criado `docs/rules/specflow.md` com hierarquia das fontes, fluxo de entendimento até encerramento e separação entre spec, verificação de stack e tarefa técnica.
- Criado `docs/rules/tests.md` com regras de escrita, níveis de validação, isolamento de dados, evidências de conclusão e registro explícito do estado atual sem Jest configurado.

## Validação (atual — 2026-09-28)
- Confirmada a existência dos três arquivos e a leitura em UTF-8.
- Confirmada a ausência de espaços residuais ao fim das linhas.
- Confirmada a existência de todas as referências locais citadas nos documentos.
- Testes da aplicação não foram executados porque a alteração é exclusivamente documental e não há suíte Jest configurada.
- `git diff --check` não pôde ser executado porque o Git não está disponível no terminal atual.
- A documentação oficial de SDLC não pôde ser consultada porque o servidor MCP indicado pela skill não está disponível nesta sessão; nenhuma política interna foi inventada.

## Estado atual (2026-09-28)
Concluído.

## Próximo passo (atual — 2026-09-28)
Quando o projeto configurar Jest ou decidir a estratégia oficial de migrations, atualizar os documentos para refletir os comandos e responsabilidades aprovados.

---

## Handoff anterior

## Pergunta / tarefa (atual)
Criar `docs/andar-zero.md` com oito critérios identificados de AZ-01 a AZ-08, esclarecendo que o documento não é uma spec, mas uma verificação de integração da stack de `docs/adr/001-stack.md` em máquina limpa.

## Contexto (atual)
O documento deve conter também as seções "Fora de escopo", com as funcionalidades do PRD que não participam desta verificação, e "Não decidido ainda", registrando a organização de pastas.

## Regras e restrições (atuais)
- Não inventar critérios.
- Não converter critérios em tarefas técnicas nem nomeá-los por bibliotecas.
- Cada critério deve declarar o que precisa ser verdade, não como implementar.
- Não alterar `docs/PRD.md` nem qualquer ADR.
- Não executar commits nem alterar o histórico Git.

## Investigação / análise (atual)
A solicitação recebida contém o marcador `[ditar aqui os oito AZ do checklist acima]`, mas não inclui o texto dos oito critérios. A busca no repositório não encontrou outra ocorrência de AZ-01–AZ-08 nem um checklist de andar zero. O PRD confirma como funcionalidades de produto: login, catálogo, solicitação, devolução e visão de Operações; todas devem ficar fora desta verificação de stack. O ADR confirma que o objetivo é verificar a integração das tecnologias escolhidas e que organização de pastas não foi decidida por ele.

## Solução proposta (atual)
Solicitar ao usuário o texto literal dos oito critérios e, depois de recebê-lo, redigir o documento sem acrescentar critérios ou prescrever bibliotecas nos enunciados.

## Implementação (atual)
Nenhuma alteração em `docs/andar-zero.md`: o arquivo não foi criado para evitar consolidar placeholders ou conteúdo inventado. Apenas o handoff foi atualizado.

## Validação (atual)
- `docs/PRD.md`, `docs/adr/001-stack.md` e `layout.md` foram lidos.
- Busca textual por `AZ-01`–`AZ-08`, “andar zero” e pelo placeholder não encontrou fonte dos critérios.
- A skill de SDLC foi consultada, mas o servidor MCP `picpay-sdlc-documentation` não está disponível nesta sessão.

## Estado atual
Bloqueado aguardando o conteúdo dos oito critérios.

## Próximo passo (atual)
Receber os oito critérios ditados pelo usuário e criar `docs/andar-zero.md`.

---

## Handoff anterior

## Pergunta / tarefa
Remover todos os dados mockados da aplicação, mantendo somente dados reais vindos do banco.

## Contexto
O frontend estava usando dados de demonstração no catálogo, empréstimos e operações. O backend também retornava uma lista fixa, embora o projeto já tivesse schema Prisma e migration para PostgreSQL/Supabase.

## Regras e restrições
- Respeitar o layout e a linguagem descrita em layout.md.
- Priorizar experiência de Colaborador e Operações.
- Não alterar PRD nem ADR sem autorização explícita.
- Manter stack compatível com React + Vite.
- Não executar commits, git push, git merge ou qualquer alteração de histórico do repositório.

## Investigação / análise
Foi identificado que a fonte mockada estava em dois pontos: a constante de equipamentos no backend e o fallback/local state no frontend. A rota foi alterada para consultar `equipment` com os empréstimos ativos relacionados, e o frontend passou a exibir erro/estado vazio quando a API não responde, sem inventar registros.

## Solução proposta
Usar Prisma como única fonte do catálogo e dos responsáveis por empréstimos. Derivar contagens e tabelas de operações dos dados retornados pela API. Manter a autenticação temporariamente desativada, deixando “Meus empréstimos” sem registros até existir um usuário autenticado para filtragem.

## Implementação
- Backend: adicionado `@prisma/client` e Prisma Client gerado a partir de `schema.prisma`.
- Backend: `GET /api/equipment` consulta o banco, inclui empréstimo ativo e usuário responsável, e calcula status de atraso a partir do registro real.
- Frontend: removidos fallback e dados fixos do catálogo.
- Frontend: operações usa equipamentos retornados pela API; empréstimos sem usuário autenticado mostram estado vazio.

## Validação
- `node ./node_modules/prisma/build/index.js generate` executado com sucesso.
- Backend compilado com `npm run build` sem erros.
- Frontend compilado com `npm run build` sem erros.
- Diagnósticos sem erros em `backend/src/main.ts` e `frontend/src/App.jsx`.
- GET `http://localhost:3001/api/equipment` respondeu com registros do banco configurado.

## Estado atual
Concluído para remoção dos mocks; autenticação ainda está temporariamente desativada.

## Próximo passo
Implementar autenticação e endpoint específico de empréstimos do usuário antes de preencher “Meus empréstimos” com dados personalizados.

## Restrições obrigatórias
- Não deve executar commits.
- Não deve executar git commit, git push, git merge, git rebase, git cherry-pick, git reset --hard, git amend ou qualquer comando que gere histórico de commit.
- Não deve alterar o conteúdo de docs/PRD.md sem autorização explícita do responsável do projeto.
- Não deve criar, renomear, editar ou remover ADRs em docs/adr/ sem autorização explícita.
- Não deve alterar arquivos sensíveis sem necessidade e sem contexto claro.
- Não deve expor segredos, tokens, chaves ou credenciais.
- Não deve assumir decisões de negócio sem confirmar com o contexto do projeto.
