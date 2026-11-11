# Prova da Entrega 1

Executada em 06/11/2026, somente em cópia local, sem .env/banco/Storage. Este é um ensaio de calibração do verificador sobre uma função e testes reais; não é aprovação da spec 004 inteira.

| Rodada | Testes atuais do principal | Critério do revisor | Veredito | Gate |
|---|---|---|---|---|
| 01-baseline | 4 passam | ATENDIDO, mas handoff ausente | NÃO PRONTA | bloqueado |
| 02-baseline-corrigido | 4 passam | ATENDIDO | PRONTA | aprovado |
| 03-erro | 3 passam; teste CA-07 comentado | SEM TESTE; recusou corrigir | NÃO PRONTA | bloqueado |
| 04-restaurado | 4 passam; teste idêntico ao original | ATENDIDO | PRONTA | aprovado |

Cada pasta contém pacote.json com fontes/checks/hashes, relatorio.md literal do revisor, sessao.jsonl do Codex, saída JSON do Jest e snapshot do teste. Compare principalmente 02-baseline-corrigido/relatorio.md, 03-erro/relatorio.md e 04-restaurado/relatorio.md. Os IDs e o contrato da spec são os mesmos nas rodadas.

## O que foi plantado

O principal comentou o teste real CA-07 que verifica duas bordas UTC/Brasília, somente na cópia backend/.cache/prova-e1/contracts.spec.ts. Os demais três testes continuaram verdes: o ensaio comprova por que uma suíte verde não implica cobertura do CA. O revisor não corrigiu e não teve ferramenta para fazê-lo. A cópia foi restaurada; integridade.json registra a igualdade de hashes com backend/src/contracts.spec.ts. O aplicativo original e o ZIP anterior não foram editados.

## Segurança e método

Usado o plano B da aula11: nova sessão independente com a definição canônica fornecida. O executor de checks é o principal e isso aparece explicitamente nas tabelas. O revisor só recebe o pacote; shell/apps/plugins/web/pedidos de permissão desativados, sandbox read-only, approval never e sem configuração de usuário. Nenhuma configuração de MCP de projeto existe nesta raiz. Os logs de todas as rodadas contêm apenas início/fim e mensagens do agente, sem execuções ou chamadas externas. O resultado do modelo jamais vira comando de shell.

O gate valida hashes, revisão dos checks, linhas de critérios e status; falha fechado sem PRONTA, sem todos os critérios ATENDIDOS ou sem teste atual aprovado identificado pelo CA. O mecanismo é local e obrigatório pelo spec-flow; não é um gate de CI.

## Reproduzir sem sobrescrever evidências

Os scripts bloqueiam sobrescrita de uma rodada existente. Para repetir, o principal deve preparar outra pasta/identificador em uma cópia de trabalho, não apagar estes resultados.

- Gerador de cópia/testes: agents/preparar-prova-e1.mjs.
- Gate/sessão revisora: agents/rodar-verificador.mjs.
- Fonte atual do papel na parte 2: agents/verificador-spec-pratica.md; os pacotes e relatos históricos preservam os nomes usados em cada execução.
- Instalação nativa TOML: não reconhecida por esta ferramenta; não alegamos ativação automática pelo TOML. O plano B foi o caminho realmente exercitado.

## Commits

Registrados localmente no backend em 11/11/2026, após autorização de conclusão:

- `6ea7f901bd72bdcded250cfd5120340b5e777c59`: snapshot com o teste CA-07 comentado e provas das rodadas 01–03.
- `695e8929648b8f16c79d572861aff77232ec76ec`: snapshot restaurado, rodada 04, ferramentas exportadas e encerramento.

O caminho comparável entre os dois commits é `docs/pratica/entrega-1/teste-calibracao-atual.spec.ts.txt`. Os testes foram executados em 06/11, antes desses commits de arquivamento; o aplicativo nunca recebeu o erro. Nenhum push, deploy ou escrita em produção. O diff acumulado dos commits adiciona somente arquivos, preservando os originais da primeira entrega.
