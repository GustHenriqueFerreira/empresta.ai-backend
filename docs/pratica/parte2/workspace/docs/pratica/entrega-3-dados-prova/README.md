# Entrega 3 — provas locais e pendências

Data: 11/11/2026. Executor dos checks: agente principal. Nenhuma escrita remota,
conta, upload, configuração Vercel ou empréstimo executado nesta etapa.

## Resultados reais iniciais

- TypeScript da pasta nova: passou, código 0, sem emissão de arquivos.
- Prisma validate com config isolado: passou, código 0. Sem dotenv, conexão,
  geração de cliente ou alterações no schema original.
- Jest com VM modules: 13/13 passaram, código 0. Banco PGlite em memória,
  fixtures sintéticas e teste de pacote offline sem fetch. Não é Supabase real.
- CLI com lote principal: código 1 esperado, falta inventário aprovado local;
  não houve pacote/publicação. Não preencher entrada fictícia para ultrapassar.
- Preservação: 104 originais idênticos ao ZIP após alterações, código 0.

Relatório Jest bruto fica em backend/db/pratica/entrega-3/.cache/jest.json.
checks.json vincula saídas/contagem e hashes atuais; mudanças posteriores exigem
novos checks/rodada antes de qualquer conclusão. Hash não autentica o executor.

Houve falhas operacionais antes da execução verde: caminho relativo do config
não resolvido pelo Jest no cwd da raiz; import PGlite sem flag VM; por fim testes
verdes mas código 1 ao gravar relatório em .cache inexistente. Corrigidos comando,
flag e diretório; a execução completa que terminou zero é a prova citada acima.
Nenhuma expectativa foi enfraquecida, teste removido ou acesso remoto usado.

## Revisão e correções locais

Parecer inicial literal em revisao-inicial.md: apontou três lacunas locais e
manteve NÃO PRONTA. Principal corrigiu expectativas independentes dos 12 nomes/
categorias, erro específico de credenciais e rastreabilidade do pacote (manifesto,
revisões, inventário e hashes dos bytes copiados, inclusive SQL/estrutura/plano).

Nova execução passou 13/13 e tsc; relatório bruto jest-final-local.json na .cache
da ferramenta. checks-revisao-02.json registra hashes do estado revisado; checks.json
é a rodada anterior histórica, não a prova das correções posteriores.

Sessão limpa E3-local-revisao-02 conferiu os hashes e as três correções, sem novo
defeito material local identificado. Parecer literal em revisao-02.md. Não executou
checks nem recebeu sandbox independente; foi análise estática autorizada. O
veredito da spec completa permanece NÃO PRONTA pelas provas reais pendentes.

## Pendências de comprovação

- Fotos reais escolhidas/revisadas pela pessoa, nem identificação de logos/textos.
- Bytes servidos publicamente pelo Supabase e políticas efetivas atuais do bucket.
- Estado atual dos registros, duplicatas remotas, identidade do destino ou D-08.
- Criação/confirmacão/perfil/login real do professor e zero empréstimos no deploy.
- Aplicação humana, repetição real, concorrência de conexões ou jornada da UI.

Sem essas provas, não declarar spec 006 ou Entrega 3 PRONTA. Preparação local não
substitui aceite do conjunto; revisão independente também não pode inventá-lo.
