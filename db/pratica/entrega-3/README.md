# Entrega 3 — material local, aplicação humana

Contrato aprovado: docs/specs/006-dados-iniciais/proposta-tecnica.md, relativo à
raiz emprestai. Somente novos arquivos. Nenhum original, .env, API ou UI alterado.
Sem pacote pronto real enquanto faltarem inventário e 12 fotos humanas aprovadas.

## Primeiro: inventário pelo responsável

1. No painel Supabase, conferir organização e referência pública do projeto.
   Não copiar senha, connection string ou chave administrativa para este material.
2. Revisar e executar 000-inventario.sql, em duas partes, no SQL Editor. É somente
   leitura. Confirmar colunas antes da segunda parte. Não rodar o schema original
   ou scripts db:schema/db:integracao para fazer um erro de leitura desaparecer.
3. Conferir equipamentos fora dos 12, duplicatas e histórico. Se houver extras,
   parar e resolver D-08 com o responsável: o preparador e o SQL recusam o caso.
   Não apagar, renomear ou ocultar equipamentos/empréstimos para acertar contagem.
4. Na área Authentication/Users, procurar apenas o e-mail do professor definido
   na spec. Registrar se existe, confirmação, perfil e contagem total de seus
   empréstimos. Não exportar auth.users, senha criptografada, sessão ou identities.
   Para contagens sem expor linhas privadas, usar 003-conferir-professor.sql:
   preencher somente o placeholder do e-mail e executar pelo humano. Diagnóstico
   é somente leitura e conta também empréstimos já devolvidos; não comprova senha
   ou login. Esperado: parâmetro preenchido, uma conta confirmada, um perfil com
   nome/papel esperado e zero empréstimos totais. Não corrigir divergência por reset.
5. Conferir Storage: existência/configuração do bucket equipamentos-pratica e
   conteúdo conflitante. Não fazer outros buckets públicos nem liberar upload
   para clientes. Se há políticas gerais de escrita em storage.objects, revisá-las
   antes de criar o bucket; este material não altera políticas existentes.
6. Copiar inventario.modelo.json para entrada/inventario.aprovado.json, preencher
   projeto, observadoEm (ISO com fuso), responsável e dados reais da consulta.
   destinoConfirmado/catalogoExatoConfirmado são true só após conferência humana.
   Campos ainda desconhecidos não viram zero, lista vazia ou true por conveniência.
7. adotarIds fica vazio por padrão. Só preencher UUIDs de registros equivalentes
   realmente inventariados, sem histórico e cuja adoção foi decidida pelo humano.
   Campos de equipamento são exatamente id,nome,categoria,patrimonio,situacao,
   emprestimos_totais,emprestimos_abertos. Não incluir tokens ou campos extras.

O arquivo é declaração do operador, não assinatura autenticada nem consulta feita
pelo agente. Expira em 24 horas; refazer inventário para material antigo. O SQL
revalida conflitos correntes antes de escrever, mas a identidade do projeto
de destino deve ser conferida pelo humano no painel, não inferida por conexão.

## Preparar offline após as fotos

Receber um lote da skill com registros, fotos, revisoes.json e
manifesto.aprovado.json, todos atuais. O preparador relê as revisões e os bytes;
não aceita só uma lista de links ou imagens de triagem. A aprovação declarada
não é um detector automático de pessoas/marcas ou identidade do revisor.

Na raiz emprestai, em terminal sem credenciais de produção no ambiente:

```powershell
node backend/node_modules/tsx/dist/cli.mjs backend/db/pratica/entrega-3/preparar.ts principal
```

Não pede credencial, não carrega .env e não contém comando de conexão/publicação.
Entrada e saída são locais. Não passar caminho arbitrário, URL, senha ou flags
de upload. Lote só aceita letras minúsculas, números e hífens, até 40 caracteres.

O pacote novo em pacotes/<rodada>/ contém 12 fotos, plano.json, SQL de estrutura
e dados, manifesto.aprovado.json, revisoes.json, inventario.aprovado.json e
marcador PRONTO-PARA-REVISAO.json com hashes escrito por último. As revisões e o
inventário são prova operacional local, não arquivos para upload no bucket público.
Falha parcial de
disco pode deixar diretório sem marcador: não aplicar nem apagar provas para
simular sucesso. Corrigir a causa e gerar nova rodada; nunca sobrescrever pacote.
As URLs de plano.json são destinos esperados, não provas de que os uploads existem.

## Aplicação pelo humano, após revisão do material e D-08

1. Criar/verificar manualmente a conta do professor. Nome Marcelo Grilo, papel
   colaborador, e-mail na spec. Senha da turma somente no campo privado do painel.
   Confirmar individualmente apenas usuário novo; não desligar confirmação global.
   Se já existe, não recriar, resetar senha/papel nem confirmar automaticamente.
   O trigger pode usar prefixo do e-mail: conferir o perfil; eventual correção é
   operação humana explícita somente desse usuário, nunca update amplo de perfis.
2. Verificar que o professor tem zero empréstimos totais (não apenas abertos).
   Se houver histórico, interromper sem excluir. Conferir login sem solicitar
   equipamento nessa conta; usar outra conta para a futura jornada de empréstimo.
3. Criar/verificar bucket equipamentos-pratica: público, PNG, até 5 MiB/arquivo,
   sem policies de escrita para anon/authenticated. Uma política ampla existente
   pode conceder escrita apesar de não criarmos outra; revisar antes de publicar.
4. Fazer uploads com o caminho exato pratica-2026/TI-xxxx/<sha256>.png do plano.
   Se já existe equivalente, preservar. Conteúdo divergente exige parar, sem upsert.
   Diretório local fotos/TI-xxxx serve de origem; o prefixo remoto é pratica-2026.
5. Abrir os 12 URLs sem login e validar bytes 800×600, hash e tipo PNG. Não basta
   HTTP 200 de uma página HTML nem URL temporária. Guardar prova sanitizada.
6. Revisar 001-imagens.sql: índice parcial restringe os 12 patrimônios e pode
   falhar se há duplicatas. Aplicar uma vez pelo SQL Editor administrativo. Se
   tabela/índice existem, não reexecutar nem trocar por IF NOT EXISTS: comparar o
   schema real. SQL inteiro é transacional; nada é aplicado pelo agente.
7. Revisar e executar 002-dados.sql do pacote pelo humano. Travas curtas bloqueiam
   temporariamente escritas; timeout/conflito aborta a transação. Não mudar para
   UPDATE/DELETE ou remover guardas para passar. Conteúdo do manifesto é JSON
   codificado em hex, não sintaxe SQL; não concatenar autor/URL em comandos.
8. Repetir apenas 002-dados.sql com inventário vigente; registrar IDs estáveis,
   12 associações e nenhum empréstimo criado/resetado. Mudança legítima de situação
   operacional em conjunto já provisionado permanece intocada. Imagem diferente
   exige intervenção separada. Não repetir DDL nem criar novamente conta/objetos.
9. Guardar provas: referência pública confirmada, data/executor humano, hashes do
   material aplicado, contagens, IDs estáveis, URLs/bytes e login/zero professor.
   Nunca senha, token, cookie ou chave. Principal confere; verificador só relata.

Auth, Storage e SQL não compartilham uma transação. Marcar separadamente o que
ocorreu em cada etapa. Falha não autoriza apagar conta/foto/dado anterior nem
declarar sucesso geral. SQL não comprova existência dos bytes no Storage ou login.

schema-proposto.prisma representa a versão aditiva, sem substituir o modelo ou
cliente original. Não gerar cliente nem db push/migrate com ele. Não há integração
nova aos cards da interface nesta entrega: pertence à evolução aprovada depois.

## Checks locais do principal

Na raiz emprestai:

```powershell
node backend/node_modules/typescript/bin/tsc -p backend/db/pratica/entrega-3/tsconfig.json
node backend/node_modules/prisma/build/index.js validate --config=backend/db/pratica/entrega-3/prisma.config.ts
powershell -NoProfile -File agents/conferir-primeira-entrega.ps1
```

Jest, a partir desta pasta (para resolução inequívoca do config no Windows):

```powershell
New-Item -ItemType Directory -Path .cache -Force | Out-Null
node --experimental-vm-modules ../../../node_modules/jest/bin/jest.js --config=./jest.config.cjs --runInBand --json --outputFile=./.cache/jest.json
```

Reutiliza Jest/Zod/PGlite/TypeScript e sharp já aprovados/instalados. Não instala
dependências. PGlite é sempre criado sem endereço, em memória; nenhuma leitura
de .env. Flag VM é necessária ao import dinâmico local do PGlite dentro do Jest.
Testes não provam concorrência entre conexões, Auth real, acesso público do Storage
ou revisão visual humana. Fixtures são sintéticas em temp, não fotos do catálogo.
