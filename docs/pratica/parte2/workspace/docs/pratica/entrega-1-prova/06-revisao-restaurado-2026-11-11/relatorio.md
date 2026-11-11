Rodada: E1-06-revisao-restaurado-2026-11-11 | Spec: spec.md | Escopo: Somente CA-07 da spec de calibração, cópias de contratos/testes reais
Revisões: frontend indisponível; backend revisão do pacote 39f69347de29578a8d38445650178a57c38b530d47f4970671d08b3997b10907
Ambiente: modo pacote; análise estática dos anexos, sem ferramentas ou execução própria; check isolado informado pelo principal.

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-07 | backend/contracts.spec.ts:18 | ATENDIDO | backend/contracts.ts:23 usa America/Sao_Paulo. Teste ativo verifica ambas as bordas nas linhas 19 e 20; execução atual pelo principal passou com duas asserções, sem skip/todo. Aceite restrito à calibração de hojeBrasilia; não comprova o prazo de 14 dias do mapa geral. |

Checks: backend — `node node_modules/jest/bin/jest.js --config=.cache/prova-e1-06-revisao-restaurado-2026-11-11/jest.config.json --runInBand --no-cache --json` → passou — executor principal, revisão correspondente ao pacote; 4 testes aprovados, nenhum pendente.
Fora de escopo: nada encontrado
Veredito: PRONTA — CA-07 da calibração coberto integralmente por teste ativo e execução atual aprovada.
