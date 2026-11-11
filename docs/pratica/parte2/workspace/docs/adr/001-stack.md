# ADR 001 — Stack

Status: decisões existentes preservadas; documentação técnica esclarecida em 05/11/2026.
Contexto do produto: docs/PRD.md. A versão inicial não registrou todos os motivos e alternativas do time; este documento não inventa esse histórico.

## Decisões existentes e implementação observada

| Item | Escolha |
|---|---|
| Linguagem/runtime | TypeScript; Node.js (requisito local 22.12+, validado originalmente em 22.20) |
| Front | React com Vite, build independente |
| Back | NestJS, processo separado |
| API | REST/JSON; organização MVC |
| Acesso ao banco | Prisma; Zod valida entradas, não é ORM |
| Autenticação/sessão | Supabase Auth; frontend gerencia sessão pelo SDK; API verifica token com getUser |
| Autorização | Perfil colaborador/operacoes, guard/API e RLS no PostgreSQL |
| Banco | PostgreSQL no Supabase |
| Hospedagem atual | Front/backend publicados separadamente na Vercel; Supabase hospeda banco e Auth |
| Migrations | Estratégia formal não decidida; existem scripts SQL numerados |
| Testes | Jest no backend; PGlite isolado para regras e RLS; sem suíte própria de frontend |
| Execução local | npm por pacote, dois terminais; Supabase externo configurado |
| Segredos | .env local/variáveis do host; .env.example vazio distribuído |

RLS aplica políticas de acesso: não autentica a pessoa. A formulação original invertia autenticação e autorização. Nenhuma tecnologia foi substituída nesta revisão.

## Justificativas e limites do registro

O registro original listava as escolhas, mas não explicava seus critérios. A implementação atual permite descrever suas funções e custos, sem afirmar que esses foram os motivos históricos do time:

- TypeScript é usado nos dois pacotes; frontend e backend continuam exigindo builds e operação separados.
- React/Vite serve a interface e NestJS a API REST; é preciso manter contrato HTTP e CORS entre eles.
- Supabase Auth verifica identidade; RLS e papéis restringem acesso. Isso depende de sessão e políticas configuradas corretamente.
- Prisma representa o schema e acessa PostgreSQL; Zod rejeita payloads fora do contrato antes de executá-los.
- Jest valida contratos e regras; PGlite evita escrita remota, mas não comprova concorrência entre conexões nem jornada real de navegador.
- PostgreSQL/Supabase é a decisão de banco existente. Um ambiente novo precisa de configuração e provisionamento revisado.

## Alternativas descartadas

Não registradas pelo time. Não declarar alternativas fictícias como discutidas ou rejeitadas. Para completar a entrega da aula, o time precisa registrar pelo menos três alternativas reais com seus motivos e confirmar as justificativas acima.

## Consequências

- Mais fácil: reaproveitar TypeScript e centralizar identidade e políticas no Supabase.
- Mais difícil: configurar dois pacotes, CORS, sessão, TLS e banco externo; testar toda a jornada exige mais que testes unitários.
- Custo de mudança: trocar React, NestJS, Prisma, Supabase ou o contrato REST exige rever código e operação.

## O que este ADR NÃO decide

Ferramenta de migrations, promoção/rollback do banco, novo orquestrador local, novas bibliotecas, alternativas não discutidas ou uma reorganização de camadas. Essas decisões exigem aprovação do time. Não introduzir soluções por inferência da aula.
