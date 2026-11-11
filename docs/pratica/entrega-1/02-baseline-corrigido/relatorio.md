Rodada: E1-02-baseline-corrigido | Spec: spec.md | Escopo: Somente CA-07 da spec de calibração, cópias de contratos/testes reais
Revisões: frontend indisponível; backend estado do pacote 6320878b0c8e0a2523a862b31b8c6a73a16cb60e0a2d61f1394153f4e51dea72
Ambiente: modo pacote de evidências; análise documental, sem ferramentas ou execução própria; check informado pelo principal e vinculado à revisão do pacote.

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-07 | backend/contracts.spec.ts:18 | ATENDIDO | Teste ativo com duas asserções nas linhas 19–20, cobrindo ambas as bordas exigidas. Código em backend/contracts.ts:23 usa America/Sao_Paulo. Execução do principal aprovada, com duas asserções e nenhum teste pendente. Aceite restrito à calibração de hojeBrasilia; não comprova o prazo de 14 dias do CA-07 geral. |

Checks: backend / `node node_modules/jest/bin/jest.js --config=.cache/prova-e1/jest.config.json --runInBand --no-cache --json` → passou — executor principal, 06/11/2026 às 11:40:46.189Z; exitCode 0, quatro testes aprovados, nenhum skip/todo.

Fora de escopo: nada encontrado nas cópias fornecidas.
Veredito: PRONTA — ambas as bordas do único critério da calibração possuem teste ativo e execução aprovada na revisão informada.
