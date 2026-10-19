# docs/specs/ — Especificações de tarefa (spec-first)

Regra: `AGENTS.md` §2.1. Resumo operacional: `rules/workflow.md` (item 9).

Nenhuma tarefa nova — tela, componente, endpoint, integração ou mudança
relevante em algo que já existe — entra em código sem uma spec aprovada aqui.
Uma spec por tarefa, nomeada `NN-nome.md` (ex.: `01-login.md`).

`layout.md`, `docs/PRD.md` e `docs/adr/` continuam sendo as fontes de design,
requisito e stack. A spec da tarefa registra como a tarefa os aplica e fixa o
que eles não definem (copy, estados, mensagens, comportamento).

## Modelo (copie para cada spec nova)

```markdown
# NN — <Nome da tarefa>

Status: proposta | aprovada | implementada

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
| `01-login.md` | Tela de Login | implementada (retroativa) |
| `02-catalogo.md` | Shell de navegação + tela de Catálogo (primeira tela após o login) | implementada |
