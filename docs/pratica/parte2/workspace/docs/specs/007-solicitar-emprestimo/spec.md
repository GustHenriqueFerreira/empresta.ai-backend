# 007 — Catálogo com fotos e solicitar empréstimo na prática

Status: PRONTA no escopo vigente — gate E4-final-rodada-02-20261111 aprovado. Fotos com ressalvas e execução autorizada pelo principal não equivalem ao enunciado original.

## Escopo e fontes

Entra: exibir os 12 equipamentos com imagens e créditos, solicitar disponível com criação imediata, visualizar os próprios empréstimos e motivos de recusa, respeitar limites/atraso/manutenção e concorrência. Não há aprovação de Operações nem fila.

Fora: desenvolver devolução, Operações, cadastro de equipamento, reserva, e-mail e renovação. Código dessas funções já existente não será removido ou refeito por este escopo. Não confundir fora de escopo desta evolução com requisito para apagar a primeira entrega.

Fontes: PRD itens 1/2/3 e regras 1–4; ADRs 001/002; layout.md §§5/7; rules/CHECKS.md, tests, SECRETS, spec-flow-pratica; enunciado #skill/#spec003/#regras. Dependência: dados/imagens da spec 006. Resolver D-01/D-02/D-03/D-04/D-05/D-08/D-11/D-12/D-14 do [registro](../../pratica/planejamento/decisoes-pendentes.md).

## Decisões de comportamento vigentes

- Limite: manter 3 conforme PRD e proposta apresentada; não aplicar pedido conflitante de 5.
- Prazo: manter 14 dias corridos/Brasília conforme PRD/proposta; não introduzir calendário útil/feriados.
- Manutenção: TI-0004/TI-0007/TI-0010, conforme D-02 já aprovada.
- Crédito: contrato original exige link visível, mas outro trecho tenta retirá-lo. Fonte atualizada para Pixabay em D-15; proposta de texto "Fotos: Pixabay". D-05 adotada na autorização de fechamento: link global e créditos individuais. Não transportar a regra específica do Pexels como alegação sobre a licença do novo serviço.
- Supabase atual, por correção explícita: preservar demonstrações e histórico; catálogo da prática delimitado às associações das 12 imagens. Não dizer que todo o banco possui só 12 linhas. Conflito de patrimônio/identidade/histórico continua impedindo adoção automática.

Fotos atuais mantidas por escolha reiterada do responsável. São ilustrativas e têm divergências visuais conhecidas; não preencher flags falsas nem afirmar conformidade visual integral com o enunciado. Tratar esta ressalva separadamente dos testes funcionais e do veredito completo.

## Estados e copy proposta

Preservar Nocturne e datas DD/MM/AAAA. Catálogo: carregando, vazio, erro com tentativa novamente, disponível, manutenção e emprestado; foto indisponível deve ter estado explícito e não recorrer a outra fonte silenciosamente. Proposta de imagem: texto alternativo com nome do equipamento, área estável de proporção 4:3, sem deformação, estados de foco preservados.

Solicitação: ação habilitada apenas para disponível e pessoa elegível; envio impede duplo clique; sucesso atualiza catálogo e lista; erro preserva dados e mostra motivo; sessão expirada requer login. A API também valida todas as regras; desabilitar botão não é autorização.

Textos existentes a preservar quando compatíveis: "Equipamento em manutenção."; "Equipamento indisponível."; "Você tem item em atraso. Devolva antes de pedir outro.". Mensagem do limite e texto do prazo mantêm 3 itens e 14 dias corridos/Brasília, conforme contrato autorizado. Não colocar "dias úteis" em copy se o cálculo continuar corrido.

## Critérios de aceite propostos

| ID desta spec | Resultado esperado | CA do projeto |
|---|---|---|
| EM-CA-01 | Colaborador autenticado vê o conjunto decidido com imagem ilustrativa processada e escolhida pelo responsável, nome/categoria/situação coerentes; manutenção identificada. Não alegar conformidade visual das fotos ao enunciado. | CA-01/02/09; ressalvas registradas |
| EM-CA-02 | Nas telas que mostram as fotos existe atribuição verdadeira ao Pixabay com link válido, e origem/créditos individuais são rastreáveis pelo mecanismo decidido; texto "Fotos: Pixabay" e créditos individuais. | Contrato IM-05/08; CA-02; D-15 |
| EM-CA-03 | Solicitar disponível cria imediatamente um único empréstimo do usuário autenticado e torna o equipamento indisponível atomicamente; falha não deixa estado parcial. | CA-03 |
| EM-CA-04 | Limite de abertos decidido em D-03 é imposto no servidor inclusive para pedidos concorrentes a itens diferentes; recusa tem motivo visível. | CA-06 |
| EM-CA-05 | Prazo decidido em D-04 é calculado no calendário/fuso acordados, salvo corretamente e exibido DD/MM/AAAA, inclusive nas bordas relevantes. | CA-07 |
| EM-CA-06 | Pessoa com item em atraso é impedida de solicitar outro, com motivo; item que vence hoje segue a regra de atraso definida no PRD/implementação, confirmada na aprovação. | CA-08 |
| EM-CA-07 | Equipamento em manutenção ou já emprestado não pode ser solicitado, nem manipulando diretamente o POST. | CA-03/09 |
| EM-CA-08 | Duas sessões concorrentes solicitando o mesmo disponível produzem exatamente um empréstimo; a outra recebe recusa coerente e nenhum dado parcial. | CA-03 |
| EM-CA-09 | "Meus empréstimos" mostra apenas os abertos do próprio usuário, com equipamento e data; terceiro não obtém empréstimos alheios alterando requisição. | CA-01 |
| EM-CA-10 | Interface trata carregamento, envio, vazio, erro, sessão expirada e imagem inválida sem novo dado fictício, sem duplo envio e mantendo acessibilidade/Nocturne. | CA-01/02/03; layout.md |
| EM-CA-11 | Jornada real na conta separada de teste e operação autorizada são registradas com executor, resultados e sem segredo; preservar demonstrações/histórico. Responsável autorizou execução pelo agente como exceção ao método original e dispensou a conta do professor. | Autorização explícita e mudança de escopo de 11/11/2026 |

## Verificação futura

Nomes dos testes devem citar EM-CA-xx e CA global aplicável. Prova de serviço/SQL não comprova interface. PGlite de uma conexão não comprova EM-CA-04/08: exigir PostgreSQL isolado com duas conexões e barreira de início controlada. Definir infraestrutura aprovada em D-11 antes de testes de interface; nenhum teste será inventado apenas para contornar o gate.

Principal executa testes/builds seguros na versão autorizada. O principal executa somente a jornada real autorizada na conta separada de teste, preservando dados/histórico; registra a exceção à execução humana, sem senha/JWT. Verificador recebe fontes, spec/plano/tarefas e checks atuais vinculados às revisões dos dois repos. Somente Veredito: PRONTA permite encerrar esta spec; aprovação anterior da calibração do subagente não é aceite desta funcionalidade.
