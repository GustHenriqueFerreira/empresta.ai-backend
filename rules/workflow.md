# rules/workflow.md — Git, ambiente, specs e documentação

Fonte: `AGENTS.md` (§2, §2.1, §6, §7, §8, §9, §10).

## Git — o agente não versiona

1. O agente **não executa** `git commit`, `git push`, `git merge`, `git
   rebase` nem configura remote ou credenciais.
2. Commits e pushes são responsabilidade do **usuário**.
3. O agente apenas edita arquivos, deixa o working tree pronto para revisão e
   pode sugerir mensagem de commit em texto (sem executar).

## Ambiente

4. Copiar `.env.example` → `.env` localmente para rodar cada app; nunca commitar
   `.env` real (o `.gitignore` ignora `**/.env*` e preserva `!**/.env.example`).
5. Variável nova ⇒ atualizar o `.env.example` correspondente.
6. `SUPABASE_SECRET_KEY` e `DIRECT_URL` somente no backend; o frontend recebe
   apenas `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Documentação e decisões

7. Nova decisão arquitetural ⇒ ADR novo em `docs/adr/` (seguindo o formato do
   `001-stack.md`) **antes** de implementar.
8. Após o scaffold dos apps, atualizar: comandos reais no `AGENTS.md` §8 e
   neste arquivo; estado do repositório no `AGENTS.md` §10.
9. Spec antes de implementar (`AGENTS.md` §2.1): tarefa nova ou mudança
   relevante só ganha código após spec em `docs/specs/` (modelo em
   `docs/specs/README.md`), revisada com o usuário. Alvo construído sem spec
   recebe spec retroativa antes da alteração. Código em desacordo com a spec
   é tarefa não pronta.

## Comandos (frontend validado; backend ainda sem scaffold)

```bash
# frontend/ (Vite + React) — validado
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit && vite build
npm run preview

# backend/ (NestJS) — provisório: app ainda não inicializado
npm install
npm run start:dev
npm test
```
