# Revisão independente — spec 004

Verificador-spec, contexto limpo, 05/11/2026. Escopo: tudo que implementa a spec em frontend/ e backend/. Revisão somente de leitura. Resumo fiel do segundo relatório; nenhuma aprovação global inferida de resultados parciais.

| CA | Evidência | Status | Observação |
|---|---|---|---|
| CA-01 login real | backend/src/http.spec.ts:38 | REPROVADO | Auth simulado não comprova login real. |
| CA-01 isolamento | backend/src/app.service.spec.ts:17; backend/src/database.integration.spec.ts:11 | ATENDIDO | Filtro por identidade e RLS passaram. |
| CA-01 restauração/renovação/logout | ausente | SEM TESTE | Falta suíte de jornada frontend. |
| CA-02 catálogo, vazio/erro, sem fallback | backend/src/app.service.spec.ts:22 | REPROVADO | Privacidade coberta; vazio, erro, ordenação e interface não comprovados integralmente. |
| CA-03 persistência | backend/src/database.integration.spec.ts:7; backend/src/http.spec.ts:49 | ATENDIDO | Persistência SQL e contrato HTTP passaram. |
| CA-03 atualização após recarregar | ausente | SEM TESTE | Falta jornada de recarga. |
| CA-04 devolução pelo dono | backend/src/database.integration.spec.ts:12 | ATENDIDO | Terceiro recusado; dono libera item/slot. |
| CA-05 visão/devolução de Operações | backend/src/database.integration.spec.ts:11; backend/src/database.integration.spec.ts:13 | ATENDIDO | Cenários SQL passaram. |
| CA-05 recusa HTTP de colaborador | backend/src/http.spec.ts:76; backend/src/http.spec.ts:82 | ATENDIDO | GET Operações e POST equipamento retornam 403 sem executar acesso privilegiado. |
| CA-05 interface e indicadores | ausente | SEM TESTE | Falta jornada. |
| CA-06 limite sequencial | backend/src/database.integration.spec.ts:8 | ATENDIDO | Quarta solicitação recusada, total três. |
| CA-06 concorrência | backend/src/database.integration.spec.ts:8 | REPROVADO | Sessão única não comprova múltiplas conexões. |
| CA-07 prazo Brasília | backend/src/database.integration.spec.ts:7; backend/src/contracts.spec.ts:18 | ATENDIDO | Prazo SQL e virada de data passaram. |
| CA-08 atraso | backend/src/database.integration.spec.ts:9 | ATENDIDO | Bloqueio SQL passou. |
| CA-09 manutenção não solicitável | backend/src/database.integration.spec.ts:10 | ATENDIDO | Recusa SQL passou. |
| CA-09 contagem de disponíveis | ausente | SEM TESTE | Falta asserção de indicadores e catálogo. |
| Cadastro e patrimônio padrão | backend/src/http.spec.ts:82; backend/src/contracts.spec.ts:10; backend/src/database.integration.spec.ts:15 | AMBÍGUO | Evidências sob CA-05; falta identificação formal do critério. |
| Estados, copy, preservação visual | ausente | AMBÍGUO | Sem IDs individuais e testes frontend; erro de conexão tem texto diferente do copy genérico da spec. |
| Prisma/claims/erros seguros | ausente | AMBÍGUO | SQL isolado não testa DatabaseService real. |

Checks do verificador: Jest sem cache, somente contracts/app.service/http/database.integration → PASSOU, 24 testes em quatro suítes com loopback autorizado. TypeScript sem emissão nos dois pacotes → PASSOU. Builds completos e startup com fixtures não executados pelo verificador devido à proibição de escrita; o principal os validou separadamente (docs/VALIDACAO.md). Nenhum acesso a produção pelo verificador.

Fora de escopo: nada encontrado atribuível à spec 004; hospedagem pertence à spec 005.

Veredito: NÃO PRONTA — faltam provas de jornada frontend, login/restauração real, concorrência entre conexões e rastreabilidade.

REPROVADO por falta de prova não significa que um defeito de comportamento foi demonstrado. As tarefas voltam ao principal, conforme tasks.md.
