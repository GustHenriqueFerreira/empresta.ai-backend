# Plano — 003-banco-de-dados

Registro retrospectivo organizado em 05/11/2026; não comprova aprovação prévia ao código.

## Arquivos e contratos

Áreas: backend/db/001-schema-inicial.sql, backend/db/002-integracao.sql, backend/prisma/schema.prisma.

Schema e funções SQL existentes. SQL numerado não decide uma ferramenta de migrations.

## Etapas de revisão

1. Conferir tabelas, restrições, perfil por trigger e políticas RLS.
2. Conferir funções de solicitação/devolução em transação e bloqueios por limite/atraso/manutenção.
3. Executar SQL em PGlite; separar prova funcional de concorrência com múltiplas sessões.

## Riscos e verificação

Não usar produção como banco de teste. Frontend e backend têm configurações próprias. Builds verificam compilação, não jornada completa. PGlite não comprova concorrência entre conexões. O relatório do verificador e docs/VALIDACAO.md registram evidências atuais.
