Rodada: E1-04-restaurado | Spec: spec.md | Escopo: Somente CA-07 da spec de calibração, cópias de contratos/testes reais
Revisões: frontend indisponível; backend estado local do pacote, revisão 6d0d9e9dd642d80f3d6c670ffe2eeae261dd8fff47349eb69606c6120eae11b6
Ambiente: modo pacote de evidências; análise estática dos documentos fornecidos, sem ferramentas; execução atribuída ao principal.

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-07 | backend/contracts.spec.ts:18 | ATENDIDO | Teste ativo verifica ambas as bordas nas linhas 19–20, exercitando backend/contracts.ts:23. Execução atual do principal aprovada, com duas asserções. Aceite restrito à data de Brasília da calibração; não comprova o prazo de 14 dias do CA-07 de rules/CHECKS.md. |

Checks: backend/ — `node node_modules/jest/bin/jest.js --config=.cache/prova-e1/jest.config.json --runInBand --no-cache --json` → passou — executor principal; revisão correspondente ao pacote; 4 testes aprovados, nenhum pendente/todo e nenhuma falha.

Fora de escopo: nada encontrado nas cópias fornecidas; demais contratos e testes não foram atribuídos à calibração.

Veredito: PRONTA — ambas as bordas do único critério da calibração possuem teste ativo e execução atual aprovada.
