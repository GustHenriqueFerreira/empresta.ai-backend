# docs/specs/ — Especificações de tarefa (spec-first)

Regra: `AGENTS.md` §2.1. Resumo operacional: `rules/workflow.md` (item 9).

Nenhuma tarefa nova — tela, componente, endpoint, integração ou mudança
relevante em algo que já existe — entra em código sem uma spec aprovada aqui.
Uma pasta por funcionalidade: `NNN-nome/spec.md`, `plan.md` e `tasks.md`. A separação inicial destes artefatos foi feita retrospectivamente em 05/11/2026; não comprova a ordem histórica de desenvolvimento.

`layout.md`, `docs/PRD.md` e `docs/adr/` continuam sendo as fontes de design,
requisito e stack. A spec da tarefa registra como a tarefa os aplica e fixa o
que eles não definem (copy, estados, mensagens, comportamento).

## Modelo (copie para cada spec nova)

```markdown
# NN — <Nome da tarefa>

Status: proposta | aprovada | implementada (aceite formal separado)

## Escopo
- Entra:
- Fica fora:

## Fontes aplicadas
- (seções de layout.md, PRD.md e ADRs que a tarefa usa)

## Copy
- (textos da interface em PT-BR, tom direto e operacional,
  sem exclamações e sem emoji)

## Estados e interações
- (vazio, erro, bloqueio, hover/foco, o que acontece em cada ação)

## Critérios de aceitação
- CA-xx: (mapa em rules/CHECKS.md)

## Verificação
- (comandos: build/testes; o que inspecionar no layout.md)
```

## Precedência

- Código em desacordo com a spec está errado até que a spec seja atualizada
  primeiro (`AGENTS.md` §2.1).
- Alvo construído sem spec e que precise ser alterado recebe spec retroativa
  antes da alteração (`AGENTS.md` §2.1).

## Specs existentes

| Spec | Tarefa | Status |
|---|---|---|
| `001-login/spec.md` | Tela de Login | implementada (retroativa) |
| `002-catalogo/spec.md` | Shell de navegação + tela de Catálogo (primeira tela após o login) | implementada |
| `003-banco-de-dados/spec.md` | Schema inicial Supabase e RLS | aplicada |
| `004-integracao-front-back/spec.md` | Sessão real, API e fluxos persistidos | implementada; revisão formal e jornada completa pendentes |

| `005-deploy-vercel/spec.md` | Correções de hospedagem | implementada; revisão formal pendente |

## Plano e tarefas

`spec.md` descreve objetivo, vínculo ao PRD, regras, critérios com entrada/saída, fora de escopo e contratos afetados. `plan.md` registra a abordagem e os riscos. `tasks.md` contém passos verificáveis com caixas de seleção. Tasks só encerram após evidência; a spec continua vigente. Mudança de comportamento começa pela spec. Evoluções usam a mesma pasta; uma redefinição maior cria uma nova pasta referenciando a anterior.
