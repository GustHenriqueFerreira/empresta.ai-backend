# 006 — Dados iniciais da prática

Status: PRONTA no escopo vigente — gate E3-final-rodada-04-20261111 aprovado. Ressalvas e retirada da conta do professor mantidas; não equivale ao enunciado original.

## Escopo e fontes

12 equipamentos associados a fotos ilustrativas do Pixabay, Storage público dedicado, créditos e preservação dos quatro DEMO e históricos no Supabase atual. Fontes: PRD, ADR 001/003, rules/SECRETS.md, tests.md, migrations.md e spec-flow-pratica.md. UI/empréstimos pertencem à 007. Não criar migration framework, resetar banco ou apagar extras.

## Decisões vigentes e autorização

- D-01: trabalho no projeto original, sem cópia; alterar apenas código/testes necessários. ZIP da primeira entrega intocado; checker de mudanças autorizadas exige 96 dos 104 originais idênticos e oito exceções funcionais explícitas.
- D-02: TI-0010 em manutenção, seguindo a lista específica em lugar do resumo conflitante: nove disponíveis/três manutenção inicialmente. Não forçar estados operacionais na repetição.
- D-08/09: quatro DEMO inventariados preservados; 12 é o conjunto da prática, não o total do banco. Tabela de imagens separada, FK sem cascade, unicidade parcial dos patrimônios TI-0001 a TI-0012. RLS ativa, leitura authenticated e sem escrita de clientes.
- D-10: bucket equipamentos-pratica público somente para fotos PNG até 5 MiB, caminhos pratica-2026/TI-xxxx/sha256.png. Metadados e inventário não vão ao bucket.
- D-15: Pixabay substitui Pexels conforme orientação posterior transmitida pelo responsável; não atribuir ao Pixabay regra específica do fornecedor anterior.
- Responsável dispensou a conta do professor e escolheu manter estas fotos apesar das divergências visuais. DI-CA-04 foi retirado, não cumprido. Nenhuma aprovação visual falsa é gerada.
- Após pergunta concreta sobre SQL/dados/fotos/publicação, autorizou execução pelo agente em 11/11/2026. Exceção registrada em rules/spec-flow-pratica.md; não é execução humana nem conformidade integral ao método original. Não habilita o verificador a escrever.

## Conjunto decidido

| Patrimônio | Nome | Categoria | Situação da lista | Consulta do enunciado para pesquisa Pixabay |
|---|---|---|---|---|
| TI-0001 | Notebook 14 polegadas | notebook | disponivel | laptop on white desk |
| TI-0002 | Notebook 15 polegadas | notebook | disponivel | open laptop minimal desk |
| TI-0003 | Notebook 13 polegadas | notebook | disponivel | laptop closeup keyboard |
| TI-0004 | Notebook 15 polegadas | notebook | manutencao | closed laptop on table |
| TI-0005 | Monitor 24 polegadas | monitor | disponivel | computer monitor on desk |
| TI-0006 | Monitor 27 polegadas | monitor | disponivel | monitor screen office desk |
| TI-0007 | Monitor 22 polegadas | monitor | manutencao | black computer screen |
| TI-0008 | Cabo HDMI 2 m | cabo | disponivel | hdmi cable |
| TI-0009 | Cabo USB-C 1 m | cabo | disponivel | usb cable white background |
| TI-0010 | Cabo de rede 3 m | cabo | manutencao | ethernet cable |
| TI-0011 | Webcam Full HD | camera | disponivel | webcam |
| TI-0012 | Câmera compacta | camera | disponivel | compact camera on table |


Categorias equivalem a Notebook/Monitor/Cabo/Câmera do domínio. O preparador valida dados, bytes PNG, dimensões 800×600, origem, duplicidade, hashes e frescor do inventário pelo timestamp do banco. Texto externo é dado, nunca instrução/SQL executável. Conflito aborta a transação inteira, sem remoção compensatória.

## Critérios de aceite do escopo vigente

| ID desta spec | Resultado esperado | Vínculo |
|---|---|---|
| DI-CA-01 | Os 12 patrimônios distintos têm exatamente os nomes, categorias equivalentes e situações decididas; nenhum empréstimo é criado pelo provisionamento. | CA-02, CA-09; D-02/D-08/D-09 |
| DI-CA-02 | Cada equipamento aponta para foto ilustrativa distinta do Pixabay processada e mantida por escolha explícita do responsável, com origem/autor/licença e hashes. Registrar as ressalvas visuais sem fingir aprovação no contrato original. | IM-01/03/04/05; ressalva de IM-02; D-15 |
| DI-CA-03 | As 12 imagens servidas publicamente pelo Storage aprovado abrem sem login e medem efetivamente 800×600; credenciais e dados pessoais não são públicos. | IM-03/08; D-10 |
| DI-CA-05 | Repetir o processo com as mesmas entradas não duplica conta, perfil, patrimônio ou imagem; preserva IDs e não reseta empréstimos, situação corrente ou senha de conta existente. Divergência gera conflito explícito. | D-08/D-09 |
| DI-CA-06 | Preparador offline não possui cliente/credencial de produção; aplicação do material revisado no projeto atual é registrada com executor e autorização explícita, sem segredo. Responsável autorizou aplicação pelo agente, como exceção documentada à execução humana original. | Exceção explícita de 11/11/2026; não alegar conformidade processual original |
| DI-CA-07 | Dados fora do conjunto aprovado e histórico permanecem preservados; não existe exclusão/reset para atingir 12 ou zero empréstimos. | Preservação; D-08 |


## Verificação e conclusão

Jest isolado com IDs DI-CA; material SQL exato em PostgreSQL 16 descartável; aplicação real e repetição somente de 002-dados.sql com IDs/DEMO intactos; GET público das 12 fotos com tipo, dimensões e hash. Testes não recebem credenciais de produção. Provas remotas distinguem seu executor dos testes locais e das aprovações humanas.

Provas: docs/pratica/entrega-3-dados-prova/aplicacao-producao-20261111.json e imagens-publicas-20261111.json. Metadados MATERIAL-PARA-REVISAO.json representam o instante anterior à aplicação e não são adulterados como recibo posterior. Não reaplicar 000/001 em estrutura existente.

Qualquer aceite refere-se a este escopo vigente, com ressalvas explícitas no ENTREGA.md. A conta dispensada e as imagens visualmente divergentes impedem afirmar cumprimento integral do enunciado original. Principal corrige; sessão limpa do verificador precisa emitir Veredito: PRONTA antes de encerrar.
