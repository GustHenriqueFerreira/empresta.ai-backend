# Operação local

Na pasta emprestai/skills/imagens-equipamentos. Node compatível e backend/node_modules
local devem existir para reutilizar tsx/Jest; não instalar pacotes nos apps originais.

```powershell
npm ci
npm test
npm run typecheck
powershell -NoProfile -File scripts/buscar.ps1 -Patrimonio TI-0001
npm run imagens -- preparar TI-0001 ID_ESCOLHIDO_NA_BUSCA
```

O prompt de buscar.ps1 mascara a chave, passa-a por stdin e não a registra em
arquivo, variável nova ou linha de comando. Nunca substituir o prompt por chave
literal em comando/chat. Se não houver chave, pare a pesquisa: obter em
[Pixabay API](https://pixabay.com/api/docs/) usando a conta do responsável.

Repita a seleção/preparo por patrimônio, sem automatizar downloads em massa.
Para consultar os 12 patrimônios com um único prompt privado, use
`powershell -NoProfile -File scripts/buscar.ps1 -Todos`. Essa opção faz somente
as consultas fixas de metadados, em sequência, e reutiliza cache de 24h.
Não baixa todas as candidatas e para na primeira falha, preservando resultados.
O segredo permanece em memória durante essa execução humana e é descartado
ao terminar; cada filho o recebe por stdin. Não automatizar a digitação da chave.
O catálogo de consultas está em scripts/pipeline.ts; não contém situação de dados.
O lote padrão é principal. Cache local: .cache/lotes/principal/buscas.
Fotos finais: .cache/lotes/principal/fotos/TI-0001.png etc. Origem, URL de
download sem chave, data de obtenção e hashes: .cache/lotes/principal/registros.
Nenhum desses arquivos contém chave da API. A data de obtenção é registrada
no preparo após receber a imagem; repetição preserva a primeira obtenção.

Depois dos 12 preparos:

```powershell
npm run imagens -- revisoes
```

O arquivo .cache/lotes/principal/revisoes.json começa com decisões nulas. Humano inspeciona
cada PNG final e preenche revisor/data/hash/decisão/flags/motivo. Uma recusa
deve ser registrada com motivo, não convertida em aprovação para passar o gate.
Se escolher outra candidata, seguir o procedimento de novo lote abaixo;
não apagar lock ou aprovação automaticamente.

```powershell
npm run imagens -- empacotar
```

Gera .cache/lotes/principal/manifesto.aprovado.json só com 12 imagens verificadas
e revisões de hash correspondente. Não existe comando upload. Para a tarefa 3,
o humano separa do lote aprovado o manifesto, a pasta fotos com os 12 PNGs,
os registros de origem e revisoes.json, preservando caminhos relativos/hashes.
Esses arquivos são o material de operação humana, mesmo estando na área .cache.
Não versionar node_modules, caches de consultas ou temporários; não confundir
esses arquivos auxiliares com o conjunto aprovado para publicação. O humano
confere novamente hashes antes de aplicar. Nenhuma variável nova em .env/Vercel.

## Nova candidata sem perder evidência

Use outro lote com identificador simples, por exemplo lote-02. Não copiar a skill
ou suas dependências. Preserve inteiro o lote anterior, incluindo recusas.

1. Crie .cache/lotes/lote-02. Copie buscas do lote anterior para reutilizar
   respostas que ainda estejam nas 24 horas. O timestamp original deve permanecer.
2. Copie para fotos/registros do novo lote somente os pares PNG/JSON que você
   vai manter, com bytes intactos; não copie o par do patrimônio a substituir.
3. Prepare a nova candidata no novo lote. Exemplo de sintaxe, não uma decisão
   sobre qual equipamento foi recusado:

```powershell
powershell -NoProfile -File scripts/buscar.ps1 -Patrimonio TI-0001 -Lote lote-02
npm run imagens -- --lote lote-02 preparar TI-0001 ID_ESCOLHIDO_NA_BUSCA
npm run imagens -- --lote lote-02 revisoes
```

4. Com os 12 pares presentes, o modelo de revisão começa nulo. Para reutilizar
   revisão real de imagem mantida, transcreva o registro anterior apenas se o
   hash for idêntico; item trocado exige nova inspeção/decisão humana/data/hash.
   Não reusar uma aprovação sobre bytes diferentes.
5. Execute npm run imagens -- --lote lote-02 empacotar. O manifesto deve conter
   12 registros; nunca misturar pastas de lotes diferentes para contornar recusa.
   O teste de integridade precisa passar de novo no lote escolhido.

Falha de processo pode deixar arquivo parcial/lock; parar, preservar evidência e
revisar o caso. Reexecução não deve redefinir escolhas ou ocultar corrupção.
