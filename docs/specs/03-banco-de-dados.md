# 03 — Banco de dados: schema inicial no Supabase

Status: aprovada

Tarefa de provisionamento: conectar o PostgreSQL do projeto Supabase e criar o
schema da v1 — perfis, equipamentos e empréstimos — com RLS e as funções que
aplicam as regras do PRD no banco. As telas seguem com dados em memória; a
integração de front/back com este banco é tarefa à parte (specs próprias).

## Escopo

Entra:

- Tabelas `public.profiles`, `public.equipamentos` e `public.emprestimos`, com
  nomes e valores de domínio em PT-BR, alinhados a `frontend/src/data/mock.ts`
  e layout §9 (`situacao` em `disponivel`/`emprestado`/`manutencao`; patrimônio
  vazio cai para `TI-—`).
- RLS em todas as tabelas: catálogo legível por qualquer usuário autenticado;
  cada pessoa lê somente os próprios empréstimos e o próprio perfil; visão
  completa apenas para o papel `operacoes` (PRD, item 5).
- Escrita direta em `emprestimos` bloqueada: solicitação e devolução só pelas
  funções `public.solicitar_emprestimo(uuid)` e
  `public.devolver_emprestimo(uuid)` (SECURITY DEFINER), que aplicam as regras
  1–3 do PRD de forma atômica.
- Trigger que cria o perfil quando um usuário é cadastrado no Supabase Auth.
- Trigger de coerência: `emprestado` exige empréstimo em aberto; item com
  empréstimo em aberto não muda de situação sem devolução registrada.
- Índice único parcial: um equipamento tem no máximo um empréstimo em aberto.
- Arquivo versionado `backend/db/001-schema-inicial.sql` (idempotente) e
  ferramenta `backend/db/aplicar-schema.mjs` (`npm run db:schema` em
  `backend/`), que lê `DIRECT_URL`/`DATABASE_URL` de `backend/.env` sem nunca
  imprimir segredo; a aplicação inteira roda em uma transação única.

Fica fora:

- Ferramenta de migrations — continua em aberto (ADR 001, "não decidido");
  este arquivo é o baseline a consolidar quando o ADR sair.
- Integração de sessão (Supabase Auth) nas telas e chamadas reais do
  front/back ao banco.
- Scaffold do NestJS e Prisma Client.
- Seed/dados de exemplo: o catálogo real começa vazio (rules/operation.md
  proíbe registros fictícios como fonte de dados).
- Concessão do papel `operacoes` a um usuário real: operação manual, documentada
  no próprio SQL.

## Fontes aplicadas

- `layout.md` §5.2 (cards), §5.5 (formulário de cadastro: categorias,
  observações), §7 (regras de interação), §9 (estado e domínio).
- `docs/PRD.md` regras 1–4 e item 5 (visibilidade).
- `docs/adr/001-stack.md` (PostgreSQL no Supabase; RLS; migrations em aberto).
- `rules/stack.md` (regras de acesso por linha no banco), `rules/migrations.md`,
  `rules/SECRETS.md`, `rules/business-rules.md`.
- `frontend/src/data/mock.ts` (domínio e valores fixados no front).

## Copy (mensagens das funções e triggers)

| Quando | Mensagem |
|---|---|
| Sem sessão (solicitar/devolver) | `Sessão necessária para solicitar empréstimo.` / `Sessão necessária para registrar devolução.` |
| Equipamento inexistente | `Equipamento não encontrado.` |
| Equipamento emprestado | `Equipamento indisponível.` |
| Equipamento em manutenção | `Equipamento em manutenção.` |
| Limite de 3 atingido | `Você já está com 3 itens emprestados.` |
| Item em atraso | `Você tem item em atraso. Devolva antes de pedir outro.` |
| Devolução repetida | `Empréstimo já devolvido.` |
| Devolução por terceiro sem papel | `Somente quem está com o item ou Operações pode registrar a devolução.` |
| Trigger: liberar item emprestado | `Item está emprestado; registre a devolução antes de alterar a situação.` |
| Trigger: marcar emprestado sem empréstimo | `Item só fica emprestado por uma solicitação de empréstimo.` |

O copy dos banners/botões das telas continua definido em `layout.md` §7; as
mensagens acima são as do banco, para quando a API repassá-las.

## Decisões que os documentos não fixavam

| Assunto | Decisão |
|---|---|
| Nome das tabelas | PT-BR (`equipamentos`, `emprestimos`), espelhando `mock.ts`; perfil do auth em `profiles` (convenção Supabase) com colunas PT-BR (`nome`, `papel`). |
| Papel de Operações | Coluna `profiles.papel` (`colaborador`/`operacoes`, padrão `colaborador`); conceder `operacoes` é SQL manual: `update public.profiles set papel = 'operacoes' where id = '<uuid>';` |
| Categoria | `text not null` com check nos 5 valores do select do layout §5.5: Notebook, Monitor, Cabo, Câmera, Acessório. |
| Observações | Coluna `observacoes` opcional (formulário de cadastro, layout §5.5; detalhe do card em manutenção). |
| Prazo | `devolver_ate date` = `(now() at time zone 'America/Sao_Paulo')::date + 14` — "hoje" no fuso de Brasília, evitando deslocar um dia após 21h (servidor em UTC). |
| Ordem do catálogo | `criado_em timestamptz default now()` + índice desc — cadastro entra no topo (AGENTS §4, regra 6). |
| Exclusões | Sem política de DELETE para usuários (fora da v1); exclusão de usuário apaga perfil e empréstimos por cascade; FK de `equipamento_id` sem cascade, preservando histórico. |
| Mensagens de erro | Diretas, em PT-BR, sem exclamação — exibíveis em toast/banner; ver Copy. |

## Estados e interações (efeitos de dados)

- Solicitar: `emprestimos` recebe a linha (`retirado_em = agora`,
  `devolver_ate = hoje + 14`) e `equipamentos.situacao` vira `emprestado` —
  numa transação só, com trava `for update` no equipamento.
- Devolver (pelo dono ou pelo balcão de Operações): `devolvido_em` preenchido
  e `situacao` volta a `disponivel`, liberando um slot.
- Cadastro (Operações): linha em `equipamentos` com `criado_em = agora` —
  entra no topo do catálogo; nome em branco ou patrimônio vazio são recusados
  pelo banco (`check`), cabendo ao app aplicar o fallback `TI-—`.
- Manutenção: Operações alterna `disponivel` ⇄ `manutencao` por update direto
  (política de update + trigger de coerência); item emprestado não muda.

## Critérios de aceitação

- CA-01/CA-05 (cada pessoa vê os próprios empréstimos; visão completa em
  Operações): **parcial** — garantido no banco por RLS; fecha com a integração
  de sessão e as telas.
- CA-06 (máx. 3 por pessoa): `solicitar_emprestimo` conta empréstimos em
  aberto e recusa o quarto.
- CA-07 (prazo padrão de 14 dias): `devolver_ate` calculado na função.
- CA-08 (atraso bloqueia): função recusa quando existe aberto com
  `devolver_ate < hoje`.
- CA-09 (manutenção nunca disponível): check de situação + função recusa
  `manutencao`; não existe caminho que marque `disponivel` sem devolução
  registrada.
- CA-02, CA-03, CA-04: telas e fluxos — não tocados aqui; o banco entrega os
  efeitos de dados que essas telas consumirão.

## Verificação

```bash
cd backend
npm install
npm run db:schema     # aplica 001-schema-inicial.sql e imprime o resumo estrutural
```

Pontos de inspeção (impressos pelo próprio script, sem segredos):

- Tabelas `emprestimos`, `equipamentos`, `profiles` em `public`, com RLS ativa
  nas três.
- Seis políticas RLS (2 em profiles, 3 em equipamentos, 1 em emprestimos).
- Funções `eh_operacoes`, `criar_perfil_ao_cadastrar`,
  `validar_situacao_equipamento`, `solicitar_emprestimo`, `devolver_emprestimo`.
- Triggers `on_auth_user_created` (auth.users) e `trg_situacao_equipamento`.
- Índices `uq_emprestimo_aberto_por_equipamento` e
  `idx_emprestimos_usuario_abertos`.
- Reaplicar o script não altera nada (idempotência).
- Nenhum segredo impresso em log, resposta ou arquivo versionado.

