# rules/stack.md — Stack obrigatória

Fonte: `docs/adr/001-stack.md`. Qualquer exceção exige novo ADR antes do código.

## Ferramentas fixas

| Camada | Ferramenta |
|---|---|
| Linguagem | TypeScript (front e back) |
| Front | React + Vite |
| Back | NestJS, API REST organizada em MVC |
| ORM / validação | Prisma + Zod |
| Banco | PostgreSQL no Supabase |
| Auth | Supabase com RLS no banco |
| Testes | Jest |
| Migration | **não decidido** — não escolher sem ADR |

## Obrigatório

1. Todo endpoint REST segue a estrutura MVC do NestJS (controller/service/module).
2. Todo dado que atravessa a fronteira da API é validado com Zod.
3. Regras de acesso por linha (quem vê o quê) ficam no banco via RLS; só
   duplicar na aplicação o que não puder ser garantido no banco.
4. Testes com Jest no backend e no frontend.

## Pontos ainda em aberto (decidir via ADR)

- **Migration:** registrar a escolha em `docs/adr/003-*.md` antes da primeira
  migration (o número 002 já é o `002-design-system.md`); só então atualizar
  `AGENTS.md` (seção 3) e este arquivo.
- **Estrutura fina de pastas** de `backend/` e `frontend/`: definir no scaffold
  e documentar em `AGENTS.md` (seção 6).
