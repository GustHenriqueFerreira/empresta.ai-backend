# rules/ — Regras operacionais do projeto

Resumo aplicável por tema, derivado dos documentos-fonte. O documento-fonte é
sempre a referência completa; este diretório não substitui o conteúdo, apenas
fixa o que é proibido/obrigatório no dia a dia.

| Arquivo | Tema | Fonte |
|---|---|---|
| `restrictions.md` | "O que não fazer" — commits, handoff, regras gerais e restrições de documentação | `AGENTS.md`, `docs/PRD.md`, `docs/adr/` |
| `CHECKS.md` | Checklist de fim de tarefa + mapa dos critérios de aceitação (CA-xx) | `AGENTS.md`, `docs/PRD.md` |
| `stack.md` | Stack fixa e processo de ADR | `docs/adr/001-stack.md` |
| `business-rules.md` | Regras de negócio da v1 | `docs/PRD.md`, `layout.md` §7 |
| `design-system.md` | Cores, tipografia, componentes | `layout.md` |
| `workflow.md` | Git, ambiente, decisões, specs, comandos | `AGENTS.md` |
| `spec-flow.md` | Fluxo spec-first: das fontes ao encerramento | `AGENTS.md` §2.1 |
| `tests.md` | Estratégia e evidência de testes (Jest ainda não configurado) | `docs/adr/001-stack.md`, `docs/PRD.md` |
| `migrations.md` | Guardrails de migration (estratégia ainda não decidida) | `docs/adr/001-stack.md` |
| `SECRETS.md` | Onde cada variável de ambiente vive e qual chave usar | `AGENTS.md` §7 |
| `operation.md` | Regras de operação: ADRs, ambiente, migrations, dados reais | `docs/adr/`, `rules/*` |
| `operacao.md` | Contrato de operação: níveis de autorização (commit, push, deploy) | decisões do usuário (`<DECIDIR>`) |
| `skill.md` | Governança de skills (instruções reutilizáveis) | `docs/adr/`, `rules/spec-flow.md` |
| `HANDOFF.md` | Handoff em tempo real (registro vivo por tarefa) | `rules/restrictions.md` |

Nota: `operacao.md` e `operation.md` convivem com escopos próximos (contrato de
autorizações × regras de execução); consolidá-los é decisão pendente do usuário.

Precedência em conflito: vale o documento-fonte; entre duas regras
operacionais, vale a mais restritiva.

`AGENTS.md` continua sendo o manual completo do agente; `rules/` é o resumo
por tema.
