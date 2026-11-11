# Entrega 2 — implementação local e pendências

Estado atual em 11/11/2026: **Entrega 2 inteira não concluída**. As 12 consultas
reais terminaram com 20 candidatas cada; chave recebida só em prompt privado.
Agente triou 23 imagens: 18 recusas, três sugestões para revisão humana e dois
casos pendentes de identificação/compatibilidade. Revisões/aprovações humanas:
0/0; nenhum manifesto real. Responsável decidiu buscar as fotos manualmente;
seleção automática interrompida e material atual preservado. Registro em
triagem-2026-11-11.json. Resumo.json e registros da primeira busca preservam os
estados anteriores; não são contagens atuais nem fotos aprovadas.

## Decisões aplicadas

- Pedido autorizou iniciar a tarefa seguindo o plano próprio.
- D-15: Pixabay substitui Pexels por orientação posterior do professor informada
  pelo responsável; não se diagnosticou o site anterior como indisponível.
- D-06: responsável aprovou sharp e registro técnico. ADR 003 foi criado antes
  da instalação; sharp 0.35.5 ficou no pacote isolado com lockfile. Nenhuma
  dependência/variável do front/back foi alterada.
- Situação de TI-0010, bucket e posição de crédito na UI permanecem nas tarefas
  seguintes. Nenhuma decisão de dados foi embutida na lista de consultas.

## Artefatos e garantias efetivamente verificadas

- `skills/imagens-equipamentos/SKILL.md`: entrada, escopo e interrupções.
- `references/`: fontes/contrato, operação por lotes e revisão visual humana.
- `scripts/pipeline.ts`: origem/GET/hosts permitidos, limite de download,
  processamento sharp, dimensões reais, unicidade e hashes, cache de 24 horas,
  revisão vinculada aos bytes e manifesto dos 12 itens.
- `scripts/cli.ts` e `buscar.ps1`: entrada de chave mascarada por stdin e
  comandos locais; chave não é argumento, arquivo ou variável nova.
- Saída real futura em `.cache/lotes/<lote>/`: fotos, registros, revisão e
  manifesto. Auxiliares/cache/node_modules ficam fora de publicação; o conjunto
  aprovado será separado pelo humano conforme operação.md na tarefa 3.
- Descoberta: entrada do workspace `.agents/skills/imagens-equipamentos`
  aponta para a fonte; o host registrou a skill no catálogo desta sessão.

O preparador fornecido só oferece GETs de pesquisa/download Pixabay e arquivos
locais. Não inclui SDK, credenciais ou comando de publicação Supabase. Recusa
credenciais de produção conhecidas no ambiente. Isso não cria sandbox sobre
todas as ferramentas do principal nem autentica a identidade declarada de
quem preenche uma revisão; esses limites são explícitos na skill.

## Checks executados pelo principal

| Check | Resultado |
|---|---|
| `npm run typecheck` no pacote da skill | passou, sem emissão |
| Jest da skill, `--runInBand --no-cache --json` | 23 testes passam, zero falhas; saída em jest.json |
| Cenários negativos do CLI | 7 recusas esperadas; cli.json, sem consultas externas |
| `node agents/validar-skill-local.mjs` | YAML/nomes/referências/descoberta válidos |
| Parser do PowerShell em buscar.ps1 | sintaxe válida |
| `agents/conferir-primeira-entrega.ps1` | 104 arquivos originais idênticos ao ZIP |

O quick_validate.py da skill-creator depende de PyYAML, ausente nos intérpretes
checados. Não foi instalado pacote extra nem declarado que esse comando passou.
A alternativa local usa js-yaml já instalado com Jest. Validação estrutural
não comprova comportamento; por isso scripts, CLI e fluxo foram exercitados.

## Falhas reais encontradas e tratadas

A execução inicial encontrou erro de sintaxe TypeScript, corrigido pelo
principal. O cache inicial dependia de rename, que falhou no sandbox Windows;
foi substituído por versões de cache sem sobrescrita. Os testes passaram depois.

A primeira tentativa de avaliação independente não produziu parecer por limite
de uso. Retomada após o pedido "continue", encontrou duas falhas que 22 testes
iniciais não haviam exercitado: nomes de credenciais em outra caixa no Windows
ultrapassavam o guard; data de obtenção não era retida no manifesto. O principal
corrigiu ambos, incluiu origemArquivo/obtidaEm e regressão de retenção na repetição;
23 testes passaram. Também esclareceu lotes, material de publicação e handoff.

[Rechecagem independente](avaliacao-independente.md) confirmou os ajustes,
execução local e pendências, sem correções pelo avaliador. Essa revisão não é
aceite de fotos reais nem substitui o verificador antes do encerramento completo.

## O que falta antes de concluir

1. Responsável possui chave e já a usou em prompt privado; ela não foi salva.
   Não enviar valor ao chat. Usar -Todos no prompt privado para as consultas
   restantes, aproveitando cache do primeiro patrimônio sem repetir a API.
2. Selecionar e preparar 12 fotos distintas reais; nenhum download em massa.
3. Revisar os PNGs finais e registrar decisões, recusas/motivos reais e hashes.
4. Gerar e validar manifesto real, guardar evidência atual e concluir revisão
   aplicável. Se faltar teste/prova/decisão, não marcar PRONTA.
5. Storage público e crédito na tela serão exercitados nas specs 006/007;
   nenhuma escrita em produção é executada pelo agente.

Nenhum commit, push, deploy, usuário ou empréstimo foi criado nesta tarefa.
O ZIP anterior, .env e os 104 originais permanecem preservados.
