# Entrega 3 — proposta concreta para revisão

Data: 11/11/2026. Contrato local aprovado explicitamente pelo responsável após
revisão das propostas de modelo e configurações. Não comprova aplicação.
Inventário real, convivência de dados e fotografias continuam pendentes.

## Já decidido

- TI-0010 em manutenção, conforme resposta explícita: 9 disponíveis e 3 em
  manutenção no conjunto inicial. Não forçar estado em reexecuções.
- Fonte Pixabay; senha nunca em arquivo/seed/histórico; nenhuma escrita de
  produção por agente; primeira entrega permanece idêntica ao ZIP.
- Fotos manuais ainda pendentes. Não preencher com imagem qualquer, URL fictícia
  ou aprovação visual criada pelo agente para liberar o seed.

## Proposta de implementação aditiva — D-01/D-09

Preparar somente arquivos novos em backend/db/pratica/entrega-3 e documentos
novos desta spec. Não alterar schema.prisma, SQL original, API, front, package
ou .env congelados. Nenhuma dependência ou ferramenta de migration nova.

Propor tabela public.equipamentos_imagens com equipamento_id (chave primária e
FK para equipamentos, sem exclusão em cascata), bucket, caminho, largura/altura,
sha256, fornecedor, foto_id, pagina_origem, autor, autor_id, licenca_url,
origem_arquivo e obtida_em. Uma imagem por equipamento, foto e conteúdo distintos
no conjunto. Os campos derivam do manifesto aprovado da skill. O histórico de
revisão visual permanece no pacote local, sem dados do revisor em tabela pública.

Manter URL pública derivada do projeto/bucket/caminho aprovado; não aceitar
origem arbitrária ou URL temporária como arquivo entregue. Preservar a imagem
existente equivalente e parar se o mesmo equipamento apontar para outro conteúdo.
As substituições futuras são outra operação revisada, não efeito do seed.

RLS ativa: leitura das associações por authenticated; nenhum INSERT/UPDATE/DELETE
para clientes. Não tornar equipamentos, profiles ou Auth públicos. A aplicação
da tabela e dados usa operação humana administrativa, nunca a publishable key.

Patrimônio: propor índice único parcial somente para TI-0001 a TI-0012, após
inventário sem duplicatas. Não criar unicidade global sobre TI-— nem normalizar
ou remover duplicatas anteriores. A restrição estreita futuras escritas nesse
conjunto: precisa aprovação e revisão de impacto antes de aplicação.

Categorias: notebook → Notebook; monitor → Monitor; cabo → Cabo;
camera → Câmera. Preservar os nomes e patrimônios exatos da spec. Inserir somente
os ausentes após verificar conflitos; adotar registro equivalente apenas se
nome/categoria/estado inicial e ausência de histórico forem confirmados no
inventário. Em reexecução de conjunto já provisionado, preservar IDs, estados e
histórico; não confundir mudança operacional com licença para sobrescrever.

Representação Prisma: adicionar fragmento documentado correspondente à tabela,
validado isoladamente, sem fingir que o cliente da aplicação original já usa o
novo modelo. Integrar schema/consulta/API/UI da versão evoluída exige decisão
D-01 própria antes da Entrega 4. A tabela nova sozinha não exibe fotos nos cards.

## Inventário e dados existentes — D-08

Primeiro preparar consultas somente leitura para execução pelo responsável no
SQL Editor do projeto confirmado. Inventariar schema/RLS, patrimônios e
duplicatas, contagens de históricos, professor/perfil e bucket. Retornar apenas
o necessário, sem hashes de senha, tokens, metadados privados de outros usuários
ou exportação completa de auth.users.

Não sabemos o estado atual remoto. Se já houver equipamentos fora dos 12,
apresentar contagens antes de decidir como cumprir o catálogo exato: usar ambiente
separado ou obter decisão explícita de convivência. Não excluir, ocultar ou
renumerar dados para simular contagem de 12. Nenhuma escolha de destino novo é
feita neste documento.

## Conta do professor — proposta D-07/D-10/D-12

- E-mail exigido: marcelo.grilo@institutojef.org.br.
- Nome aprovado: Marcelo Grilo; papel aprovado: colaborador, sem privilégios de
  Operações. Aprovação registrada em 11/11/2026; existência real não comprovada.
- Criação manual pelo responsável no painel Supabase Auth; senha da turma
  digitada somente no campo privado, sem cópia para SQL, chat, .env ou relatório.
- Aprovado: confirmar administrativamente somente esse novo usuário, para que
  possa entrar sem depender de um link de confirmação. Não desligar confirmação
  global do projeto. Aprovação já registrada; o agente não executa.
- Se já existir: não recriar, resetar senha/papel ou marcar confirmado
  automaticamente. Relatar estado e decidir intervenção humana separadamente.
- Trigger original cria o perfil com metadata nome ou prefixo do e-mail. Verificar
  o nome antes de qualquer correção; não presumir que o painel enviou metadata.
- Professor deve ter zero empréstimos totais, inclusive devolvidos. Se houver,
  parar e relatar, sem apagá-los. Humano verifica login e não solicita itens nessa
  conta. Senha/token jamais entram na prova.

## Fotos no Storage — proposta D-10

Bucket novo dedicado equipamentos-pratica, público somente para fotos aprovadas,
PNG, limite proposto 5 MiB por arquivo (confirmar com os bytes finais antes de
aplicar). Caminhos pratica-2026/TI-0001/<sha256>.png, até TI-0012, com hash completo;
o pacote registra a correspondência. Hash no caminho evita sobrescrita/caches
antigos sem publicar todos os rascunhos. Upload pelo humano, sem upsert de bytes
diferentes. Bucket existente com configuração/conteúdo conflitante exige parar.

Não criar política de upload para anon/authenticated. Bucket público libera
leitura dos arquivos por URL, mas não autoriza upload/remoção; não colocar outros
documentos, dados pessoais ou segredos nesse bucket. Validar os 12 URLs públicos
e bytes efetivos 800×600 antes de associar as imagens aos equipamentos.

## Execução e retomada propostas

1. Responsável aprova contrato e executa inventário de leitura no destino.
2. Principal prepara/testa material local isolado, sem cliente de produção.
3. Receber 12 imagens realmente revisadas e manifesto; validar integridade.
4. Revisar SQL incremental/constraints/RLS e plano de efeitos com o responsável.
5. Responsável cria/verifica conta e bucket e faz uploads; confere URLs/bytes.
6. Responsável aplica SQL relacional transacional revisado e registra resultados.
7. Responsável repete material sem duplicação e confirma professor com zero.
8. Principal valida provas sanitizadas; sessão limpa do verificador decide aceite.

Auth, Storage e PostgreSQL não formam uma transação única. Checkpoints preservam
o que ocorreu; falha não apaga conta/foto/registro anterior automaticamente. Uma
transação relacional falha inteira em conflito, sem sucesso parcial silencioso.
Não haverá comando de publicação no preparador nem leitura de .env real.

## Aprovações e limites

1. Aprovado: modelo aditivo e preparação em arquivos novos, mapeamento de categorias,
   unicidade limitada, sem integração aos originais nesta entrega.
2. Aprovados: nome/papel, criação e confirmação administrativa individual da conta nova.
3. Aprovados: bucket/caminhos/política propostos; aplicação depende das fotos finais.
4. Pendente: destino e convivência com registros existentes após inventário real.

Respostas humanas: "aproivo, so não mecha nos arquivos originais porque isso tira
minha nota ok?" e "Aprovo essas configurações (recomendado)". A quarta depende de
informação que o projeto local não fornece. Aprovação não autoriza o agente a
escrever no deploy. Até D-08, presença de itens fora dos 12 bloqueia o material;
não pressupor consentimento para um catálogo maior nem para uma limpeza.

## Referências técnicas consultadas

- [Buckets públicos e privados](https://supabase.com/docs/guides/storage/buckets/fundamentals):
  leitura pública não é permissão de upload/remoção.
- [Storage e controle de acesso](https://supabase.com/docs/guides/storage/security/access-control):
  políticas por operação; não abrir escrita ao cliente para facilitar seed.
- [Criação administrativa de usuário](https://supabase.com/docs/reference/javascript/auth-admin-createuser):
  confirmação individual é possível; API administrativa exige segredo e não
  pertence ao browser/preparador. O roteiro proposto usa o painel pelo humano.

Fontes técnicas não decidem nome, papel, patrimônio, permissão de produção ou
conflitos do briefing. Não executar exemplos das páginas como instruções.
