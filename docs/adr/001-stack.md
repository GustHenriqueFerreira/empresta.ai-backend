# ADR 001 — Stack

| Item | Escolha |
|---|---|
| Host | Supabase |
| Front | TypeScript → React |
| Back | TypeScript → Nest |
| ORM | Prisma → Zod |
| Autenticação | RLS |
| Autorização | Supabase |
| Banco | PostgreSQL → Supabase |
| API | REST → MVC |
| Testes | Jest |
| Migration | não decidido |

## Justificativas

- **Host:** Supabase para o host.
- **Front:** TypeScript com React no front.
- **Back:** TypeScript com Nest no back.
- **ORM:** Prisma com Zod no ORM.
- **Autenticação:** RLS para autenticação.
- **Autorização:** Supabase para autorização.
- **Banco:** PostgreSQL no Supabase para o banco.
- **API:** REST com MVC para a API.
- **Testes:** Jest para os testes.
- **Migration:** não decidido.

## Alternativas descartadas

Não decidido — nenhuma alternativa descartada foi ditada.

## Consequências

- **Fica mais fácil:** usar TypeScript no front e no back, manter o banco PostgreSQL no Supabase e organizar a API em REST com MVC.
- **Fica mais difícil:** usar outra stack no front ou no back, outro banco, outro formato de API ou outra estrutura no back.
- **Não dá para fazer depois sem custo:** sair do Supabase, trocar React, Nest, Prisma, Zod, PostgreSQL, REST, MVC ou Jest.

## O que este ADR NÃO decide

Este ADR não decide Migration, alternativas descartadas nem qualquer item que não foi ditado.
