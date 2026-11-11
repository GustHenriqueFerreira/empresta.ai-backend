# Plano — 004-integracao-front-back

Registro retrospectivo organizado em 05/11/2026; não comprova aprovação prévia ao código.

## Arquivos e contratos

Áreas: frontend/src/, backend/src/, backend/db/.

REST JSON com Bearer token; GET /me, /equipamentos, /emprestimos/meus, /operacoes; POST /emprestimos, /emprestimos/:id/devolucao e /equipamentos. Health público não acessa banco.

## Etapas de revisão

1. Conferir login, restauração e expiração da sessão no frontend.
2. Conferir API validando token, payload e autorização antes de acessar dados.
3. Conferir transação Prisma com papel authenticated e claims locais, sem bypass de RLS.
4. Validar contratos HTTP e regras com cenários isolados; executar builds.
5. Revisar a jornada no navegador em ambiente apropriado e concorrência entre conexões.

## Riscos e verificação

Não usar produção como banco de teste. Frontend e backend têm configurações próprias. Builds verificam compilação, não jornada completa. PGlite não comprova concorrência entre conexões. O relatório do verificador e docs/VALIDACAO.md registram evidências atuais.
