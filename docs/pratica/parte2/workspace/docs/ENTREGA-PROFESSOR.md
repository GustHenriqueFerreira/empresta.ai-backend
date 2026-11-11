# EMPREST.AI — guia da entrega

Preparação: 05/11/2026. Código React/Vite + NestJS + Prisma/Zod + PostgreSQL/Supabase.

## Onde consultar

- README.md: configuração, comandos e limites.
- docs/PRD.md: regras do produto.
- docs/adr/: decisões existentes e pendências explícitas.
- docs/specs/NNN-nome/: spec, plano e tarefas por funcionalidade.
- docs/andar-zero.md: comparação AZ-01 a AZ-08 com as evidências existentes.
- docs/VALIDACAO.md: resultados atuais, limitações e relatório do verificador.
- agents/verificador-spec.md e rules/spec-flow.md: revisão independente antes do aceite.

## Links publicados

- Frontend: https://empresta-ai-frontend.vercel.app/
- GET de liveness: https://empresta-ai-backend-2xeh.vercel.app/api/health
- GitHub frontend: https://github.com/GustHenriqueFerreira/empresta.ai-frontend
- GitHub backend: https://github.com/GustHenriqueFerreira/empresta.ai-backend

O ZIP é a versão local preparada para esta entrega; não pressupõe push/deploy das alterações documentais. Credenciais são compartilhadas separadamente. Uma instalação nova requer seu próprio Supabase, configuração e conta Auth.

## Limites importantes

A organização de spec/plano/tarefas foi reconstruída retrospectivamente. O ZIP não prova cronologia de commits nem inclui o histórico Git. Não equivale a cumprimento integral da aula: migrations formais, prova completa do andar zero, testes de frontend e concorrência continuam pendentes. Consulte tasks.md e a validação.
