# Ferramentas da Entrega 1

Cópias derivadas dos arquivos adicionais do workspace da parte 2, sem alterar a primeira entrega. O agente canônico desta etapa é agents/verificador-spec-pratica.md. A versão-base congelada continua separada.

O launcher deste diretório é executável com Node e Codex CLI instalados. Na pasta ferramentas:

```powershell
$codexExe = (Get-Command codex).Source
node agents/rodar-verificador.mjs --pacote CAMINHO_ABSOLUTO_DO_NOVO_PACOTE.json --codex $codexExe
```

O pacote precisa identificar spec, escopo, critérios, fontes/hashes e checks atuais do principal. Não contém .env ou credenciais. O launcher abre uma sessão nova sem ferramentas e falha fechado sem PRONTA válido. Nenhum texto do modelo vira comando.

Revisão de 11/11/2026: validar-pacote.mjs também é necessário para executar o launcher. Entradas novas incluem os documentos-base, spec/plan/tasks e PARTE-2.md, rules/spec-flow-pratica.md e docs/parte2/HANDOFF.md. Não reutilizar pacotes históricos como prova atual. O gate exige identidade/revisão e IDs exatos, veredito único, sessão completa com tipos permitidos e saída Jest internamente coerente. Existe reserva exclusiva execucao.lock e gravação que recusa sobrescrita; falha ou lock existente exige outra pasta, sem remoção automática.

Esta exportação recebeu correções locais posteriores aos dois commits de arquivamento; ainda não foi feito novo commit/push. Histórico e documentação completa da revisão estão no workspace, em docs/pratica/entrega-1-revisao-2026-11-11/README.md. Hash identifica conteúdo, não autoria da execução. Não apresentar o gate como CI ou garantia universal contra injeção.

Não usar as pastas de rodadas já concluídas como destino: o launcher recusa sobrescrita. Cada nova rodada usa outra pasta e nova execução de checks. As rodadas arquivadas são evidências históricas, não autorização para aprovar outra revisão.

O gerador sincroniza Markdown/TOML sem duas fontes manuais. A disponibilidade de seleção nativa não foi comprovada neste harness; a rota operacional demonstrada é o plano B da aula, não uma ativação nativa inventada.

O procedimento do principal, os comandos de preparo da cópia e os scripts conferir-prova-e1/preparar-prova-e1 permanecem no workspace completo da parte 2. O revisor exportado não precisa deles para avaliar um pacote explícito já preparado.
