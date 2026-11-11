# Plano — 002-catalogo

Registro retrospectivo organizado em 05/11/2026; não comprova aprovação prévia ao código.

## Arquivos e contratos

Áreas: frontend/src/features/catalogo/, frontend/src/components/, backend/src/app.service.ts.

GET /api/equipamentos retorna catálogo autorizado. Os estados de empréstimo vêm do banco.

## Etapas de revisão

1. Conferir catálogo, busca, filtros e estados vazio/carregando/erro.
2. Conferir exclusão de dados de terceiros e ações apenas para situação disponível.
3. Validar atualização após solicitação/devolução e navegação sem dados fictícios fixos.

## Riscos e verificação

Não usar produção como banco de teste. Frontend e backend têm configurações próprias. Builds verificam compilação, não jornada completa. PGlite não comprova concorrência entre conexões. O relatório do verificador e docs/VALIDACAO.md registram evidências atuais.
