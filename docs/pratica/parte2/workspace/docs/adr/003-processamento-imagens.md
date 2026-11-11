# ADR 003 — Processamento local das imagens de equipamentos

Status: autorizado pelo responsável em 11/11/2026 para a Entrega 2.

## Contexto e autorização

O contrato exige fotos com tamanho real 800×600. O briefing sugere sharp,
mas o ADR 001 não havia autorizado nova dependência. Antes da instalação,
o responsável escolheu: "Usar sharp e aprovar a dependência e o registro
técnico necessário". A chave Pixabay ainda não está disponível.

## Decisão

- Usar sharp 0.35.5, fixado com lockfile em pacote isolado da skill
  skills/imagens-equipamentos; não alterar os pacotes do front/back.
- Scripts de preparo em TypeScript/Node. Reutilizar a infraestrutura local
  tsx/Jest/ts-jest instalada no backend. Esta decisão não autoriza outra dependência.
- Gerar PNG 800×600 mantendo proporção, com preenchimento Nocturne #232532,
  preservando o enquadramento inteiro. Conferir dimensões dos bytes finais e
  remover metadados ao reencodar. Não cortar marca/texto para aprovar foto inadequada.
- Chave Pixabay privada por stdin durante execução humana, sem variável nova,
  argumento público ou arquivo .env. Preparar somente arquivos locais.
- Não fornecer cliente, comando ou credencial de upload/banco Supabase à skill.
  Publicação é operação humana em etapa posterior.

## Alternativas consideradas

1. Recurso nativo Windows/.NET: disponível na sondagem, sem instalação, mas
   dependente de plataforma. Oferecido ao responsável, que escolheu sharp.
2. Confiar no tamanho pedido à busca: filtro/URL não comprova dimensões finais.
3. Serviço remoto de transformação: integração/envio de imagens desnecessários;
   não autorizado nem implementado.

## Consequências e limites

Uma dependência nativa isolada, sem mudança da stack do produto. Testes de
dimensão/duplicidade não certificam ausência de pessoas, marcas, texto ou telas;
revisão da foto final continua necessária. Não decide TI-0010, bucket, crédito
na tela, migrations, limites de empréstimo ou publicação. Os 104 originais
permanecem intactos; node_modules e saídas não são material versionado.

Fontes consultadas em 11/11/2026: [instalação](https://sharp.pixelplumbing.com/install/),
[redimensionamento](https://sharp.pixelplumbing.com/api-resize/), [Pixabay](https://pixabay.com/api/docs/).
