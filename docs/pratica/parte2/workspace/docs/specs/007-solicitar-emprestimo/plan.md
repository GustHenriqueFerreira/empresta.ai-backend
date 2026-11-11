# Tarefa 4 — plano de catálogo com fotos e empréstimos

Status: execução autorizada no projeto original em 11/11/2026, somente mudanças necessárias; nenhuma cópia separada. Supabase atual, dados preservados, PRD mantido e testes isolados antes de comprovação humana remota. Um único plano para esta evolução. Fotos escolhidas com ressalvas e provas/gate final continuam pendentes.

## Aproveitar o estado existente

Já existem GET /api/equipamentos, GET /api/emprestimos/meus e POST /api/emprestimos; AuthGuard verifica a identidade. Serviço chama solicitar_emprestimo; SQL já bloqueia perfil/equipamento e possui índice de empréstimo aberto único. Tipos de equipamento ainda não incluem imagem/créditos. Nenhuma dessas constatações comprova o funcionamento atual completo: ler testes e verificar comportamento antes de alterar. Não criar segundo endpoint ou reimplementar o fluxo por causa do briefing.

## Etapas propostas

1. Responsável resolve conflitos, confirma limite/calendário/manutenção/créditos e aprova spec/plan/tasks. Não atualizar PRD/ADRs/arquivos originais por inferência; D-01 precisa de resposta antes de tocar em código.
2. Mapear cada EM-CA ao código e provas existentes na versão autorizada; apontar as lacunas reais. Reaproveitar comportamento já correto. Definir alterações mínimas de schema/contrato vindas da 006 e testar compatibilidade do front/back.
3. Expor imagem/créditos de modo tipado e sem informações de terceiros. Preservar Supabase Auth, verificação de token, perfil, transação com claims e RLS. Não usar service_role no frontend ou para contornar autorização da API.
4. Integrar fotos aprovadas e atribuição visível no catálogo, com layout Nocturne e tratamento de imagem indisponível. Só substituir imagens de equipamentos; outras imagens ficam fora. Aprovar localização do crédito antes de CSS.
5. Conservar solicitação imediata; corrigir somente lacunas demonstradas de atomicidade, limite, data, atraso ou manutenção. A identidade vem da sessão, nunca de usuarioId fornecido pelo cliente. Resultado incerto após timeout deve levar a reconciliação do estado, não retry cego do POST.
6. Cobrir solicitações sequenciais e simultâneas: mesmo equipamento para duas pessoas; mesma pessoa disputando itens diferentes na fronteira do limite; estado inicial/final e número de linhas; rollback/falha parcial. PostgreSQL isolado com duas conexões, sem Supabase do deploy, com dados sintéticos e limpeza controlada.
7. Cobrir datas na virada UTC/Brasília, vencimento hoje/ontem e fim de semana. Se dias úteis forem autorizados, definir e testar feriados/calendário; não improvisar. Verificar isolamento dos próprios empréstimos na API e RLS, além da UI.
8. Implementar e executar testes de comportamento da interface com a infraestrutura aprovada em D-11. Validar estados, motivo visível, duplo clique, erro de rede, expiração de sessão, atribuição e imagem. Inspeção visual humana complementa, sem ser substituída por teste estático da presença de texto em arquivo.
9. Após revisar scripts da versão autorizada, principal executa backend npm test, backend npm run build e frontend npm run build. Registrar precisamente o que passou, falhou ou ficou sem execução. Nunca chamar build de prova da jornada.
10. Delegar revisão em sessão limpa com spec/plano/tarefas, arquivos e revisões de ambos os repos, IDs de critérios e saídas atuais. Principal corrige, preserva reprovações e pede nova rodada até PRONTA; não adaptar critério para acomodar defeito.
11. Após preparo/revisão e autorização específica, principal publica e executa a jornada remota na conta separada de teste. Confirmar fotos/atribuição, solicitação, próprios empréstimos e devolução, preservando histórico/DEMO. Registrar exceção ao método humano original. Conta do professor dispensada, sem alegação de zero.

## Mapa de validação

| Critérios | Prova necessária |
|---|---|
| EM-CA-01/02/10 | Contrato API e testes de interface; imagens/atribuição reais e inspeção do layout. |
| EM-CA-03/07 | Teste HTTP autenticado e regra SQL; uma operação cria linha e muda situação atomicamente, recusas mantêm estado. |
| EM-CA-04/08 | Integração com PostgreSQL isolado e duas conexões; corrida observada, não simulação serial. |
| EM-CA-05/06 | Datas determinísticas e regra SQL, incluindo fronteiras; mensagem/tela compatíveis com a decisão. |
| EM-CA-09 | Duas identidades isoladas em testes HTTP/RLS, conferindo ausência de dados alheios e renderização da lista. |
| EM-CA-11 | Registro da jornada real autorizada na conta separada; executor e resultados sem segredo. |

## Limites

Não adicionar devolução ou Operações nesta evolução; não apagar os fluxos existentes por estarem fora do briefing. Não aumentar limite ou mudar calendário sem decisão. Não tocar em produção para provar concorrência. Sem infraestrutura autorizada ou teste apropriado, registrar pendência e não declarar spec pronta. A preservação e a ausência de segredos fazem parte da revisão de cada diff.
