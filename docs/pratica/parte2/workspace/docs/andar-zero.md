# Andar zero — prova da stack

Registro retrospectivo de 05/11/2026, adaptado às aulas 7 e 8. Não é spec de produto nem comprova que a prova técnica precedeu as features. O projeto existente usa React/Vite e NestJS em processos separados e PostgreSQL/Supabase externo. Não impor outro banco ou Docker sem decisão do time.

| ID | Critério da aula | Situação e evidência no projeto |
|---|---|---|
| AZ-01 | Um comando sobe tudo, incluindo PostgreSQL, em máquina limpa | PENDENTE: README descreve dois processos e exige projeto Supabase configurado; não há comando que provisione tudo localmente. |
| AZ-02 | Conecta ao banco e falha com mensagem clara se indisponível | PARCIAL: DatabaseService usa TLS e sanitiza erros; db/verificar-conexao.mjs verifica conexão por leitura. A aplicação não faz conexão antecipada no startup. |
| AZ-03 | Migration versionada e aplicada | PARCIAL: há SQL numerado 001/002 e provisionador transacional. Estratégia formal de evolução/migrations ainda não decidida; não equivale a histórico de migrations gerenciado. |
| AZ-04 | Endpoint de saúde informa conexão com banco | PENDENTE: GET /api/health retorna estado do processo, sem consulta ao banco. |
| AZ-05 | Página mostra resultado desse endpoint | PENDENTE: login/catálogo consomem Auth/API; não há página de prova do endpoint de saúde. |
| AZ-06 | Suíte em um comando com teste AZ-04 | PARCIAL: backend npm test tem testes HTTP e PostgreSQL isolado; não comprova saúde do banco via endpoint. |
| AZ-07 | Configuração por ambiente com exemplo versionado | IMPLEMENTADO: backend/.env.example e frontend/.env.example, sem valores reais. A execução depende de preenchimento privado. |
| AZ-08 | .env real ignorado, sem segredos no material | IMPLEMENTADO NA DISTRIBUIÇÃO: ZIP exclui .env reais, Git, cache e builds; exemplos vazios permanecem. Histórico remoto não é auditável pelo ZIP. |

## Tarefas técnicas pendentes

- [ ] Time decidir execução limpa de ponta a ponta compatível com Supabase Auth e migrations.
- [ ] Aprovar contrato de readiness do banco sem mudar a semântica atual de liveness.
- [ ] Implementar a consulta trivial, falha segura, página consumidora e teste integrado em banco isolado.
- [ ] Validar AZ-01 a AZ-08 em máquina limpa e registrar comandos/resultados.

Não registrar como concluída uma tarefa cujo código ou evidência ainda não existe. Não alterar o banco hospedado para satisfazer um exercício.
