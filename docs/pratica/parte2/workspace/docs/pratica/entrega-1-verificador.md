# Entrega 1 — verificador

Escopo: somente o subagente, suas regras e provas. As entregas 2–5 não são antecipadas. A implementação e o ZIP de comparação foram preservados.

Revisão posterior solicitada pelo responsável em 11/11/2026: [registro adversarial](entrega-1-revisao-2026-11-11/README.md). Foram encontradas e corrigidas falhas reais de IDs/vereditos, sessão, consistência de checks e concorrência. Nove cenários históricos, 24 regressões e 11 verificações de pacote/executor passaram; a nova rodada com erro foi recusada e a restaurada aprovada. Os relatórios anteriores são históricos, não prova de que esses casos já eram cobertos antes.

## Decisão humana

O responsável escolheu que o subagente apenas verifica e relata. Principal corrige, inclusive teste quebrado; depois abre outra rodada limpa. Pedido conflitante do tech lead rejeitado por independência. Registro em ENTREGA.md, seção 1.

## Arquivos e fonte única

- agents/verificador-spec-pratica.md é a definição canônica.
- agents/sincronizar-verificador.mjs gera .codex/agents/verificador-spec-pratica.toml; --check confere sincronização sem escrever.
- AGENTS.md e rules/spec-flow-pratica.md exigem verificação antes de PRONTA.
- agents/rodar-verificador.mjs abre a sessão revisora e bloqueia aceite inválido.
- agents/validar-pacote.mjs e agents/validar-veredito.mjs validam entradas, resultado e identidade/formato da sessão.
- agents/preparar-prova-e1.mjs prepara apenas cópia/testes locais de calibração.

## Caminho realmente exercitado

A instalação não disponibilizou seleção nativa personalizada, mesmo com multiagente habilitado. Não alegamos que TOML válido significa agente nativo carregado. Foi usado o plano B explicitamente permitido na aula 11: sessão nova com a definição canônica. Para eliminar a herança de autoridade, o revisor recebe um pacote de fontes/hashes/checks, sem shell/apps/plugins/web e sem credenciais; sandbox read-only, approval never e sem configuração de usuário.

O principal executa os checks seguros. O revisor não finge executá-los: isso é declarado nas tabelas e é uma adaptação registrada, não uma regra oculta. Nenhum texto do revisor vira comando. Hashes, linhas de critérios e saída atual identificada limitam a aprovação; falta de prova bloqueia o gate. Nenhuma produção é usada.

## Estado dos requisitos

| Requisito | Evidência | Estado |
|---|---|---|
| Papel | Tabelas literais das rodadas 01–04 em entrega-1-prova/ | demonstrado no escopo de calibração |
| Independência | Rodada 03 recusou pedido de corrigir e aprovou só após restauração pelo principal | demonstrado |
| Obrigatório | AGENTS/spec-flow e gate com saída não zero; verificador-gatilho-e1.md mostra delegação sem pedido explícito | demonstrado como processo local, não CI |
| Seguro em produção | Rota sem ferramentas, read-only/never, sem config de usuário/credenciais; logs sem chamadas externas | demonstrado na rota de pacote; não alegar sandbox individual no chat |
| Comparável | Mesmos IDs/spec/formato nas rodadas 02/03/04, fontes e checks com hashes | demonstrado |
| Provado | CA-07 ativo → comentado → restaurado, 4 → 3 → 4 testes; integridade.json; commits backend 6ea7f90 / 695e892 | demonstrado; snapshots locais registrados |

## Reprodução

Na raiz, conferir primeiro node agents/sincronizar-verificador.mjs --check. O principal prepara pacote explícito com todas as leituras exigidas, inclusive PARTE-2.md, fluxo e handoff atuais, e checks atuais, sem .env. Pacotes históricos são arquivos de prova e podem não conter o contexto necessário para novas execuções. Para iniciar uma rodada nova, usar:

node agents/rodar-verificador.mjs --pacote CAMINHO_DO_PACOTE --codex CAMINHO_CODEX_EXE

Não sobrescrever rodadas já existentes. O gate retorna zero apenas com PRONTA válido, todos os CAs ATENDIDOS e teste atual aprovado com ID. Caso contrário, manter tarefas abertas. Os relatórios não aprovam funcionalidades fora da spec anexada.

## Limites

A calibração não aprova a integração 004 inteira. Nenhuma nova funcionalidade foi publicada. Os dois commits locais de evidência são `6ea7f901bd72bdcded250cfd5120340b5e777c59` e `695e8929648b8f16c79d572861aff77232ec76ec`, autorizados pelo pedido de conclusão após a pendência ter sido apresentada. Não houve push. As sessões/testes são de 06/11; os commits de arquivamento são de 11/11. Nenhum erro foi aplicado ao runtime.

Entrega 1 concluída localmente pelos seis requisitos acima. A seleção nativa continua indisponível: o mecanismo comprovado é a sessão nova permitida na aula, com executor dos checks identificado. O processo é obrigatório nas regras complementares da parte 2 e protegido pelo gate local; não se apresenta como CI. Ferramentas e evidências também foram adicionadas ao backend em `docs/pratica/entrega-1/` para futura publicação.


## Preservação determinada pelo responsável — 06/11/2026

A partir desta determinação, os 104 arquivos presentes no ZIP original estão congelados. Cinco documentos que haviam recebido alterações da parte 2 foram restaurados byte a byte, com as alterações preservadas em pasta nova. Todo o trabalho adicional fica em novos arquivos, guiado por PARTE-2.md. O agente-base e as regras-base não são reescritos. Relatórios e pacotes anteriores permanecem literais como histórico real da prova; não foram adulterados para parecer que a regra de preservação já existia. Os dois commits locais adicionam somente material novo; os 104 originais continuam idênticos.
