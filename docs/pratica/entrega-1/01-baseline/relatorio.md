Rodada: E1-01-baseline | Spec: spec.md | Escopo: Somente CA-07 da spec de calibração, cópias de contratos/testes reais
Revisões: frontend indisponível; backend 9179d1a96f5e0c24c99b4f5d6ecbea41752f191f62dce682257669429d58dc5e
Ambiente: modo pacote de evidências; análise estática, sem ferramentas ou execução própria; checks atribuídos ao principal.

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-07 | backend/contracts.spec.ts:18 | ATENDIDO | Asserções nas linhas 19–20 verificam ambas as bordas exigidas; código em backend/contracts.ts:23. Teste ativo aprovado pelo principal, com duas asserções. Aceite restrito à calibração de data, sem comprovar o prazo de 14 dias do CA-07 geral. |

Checks: backend — `node node_modules/jest/bin/jest.js --config=.cache/prova-e1/jest.config.json --runInBand --no-cache --json` → passou — executor principal; revisão indicada; 4 testes aprovados, nenhum pendente ou todo.

Fora de escopo: nada encontrado nas cópias fornecidas.
Veredito: NÃO PRONTA — critério técnico atendido, mas o último registro de rules/HANDOFF.md, de leitura obrigatória, está ausente do pacote.
