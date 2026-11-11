# Entrega da prática — parte 2

Registro incremental. Entrega 1 concluída localmente; Entrega 2 tem implementação local testada, aguardando seleção e revisão humanas das fotos finais. As entregas 2–5 não estão declaradas prontas. Primeira versão preservada no ZIP de 05/11/2026; não sobrescrita.

Conferência remota somente leitura em 11/11/2026: painel conectado ao projeto
germinare3mil; 4 equipamentos demo, Storage sem buckets listados e busca do e-mail
do professor sem resultado. Não é o conjunto de 12 publicado; nenhuma conta,
imagem ou dado foi criado pelo agente. Evidência e limites em
docs/pratica/entrega-3-dados-prova/inventario-painel-2026-11-11.md. D-08 exige decisão
sobre dados existentes antes da aplicação humana; a Entrega 3 continua pendente.

Entrega 3 iniciada em 11/11/2026 por pedido explícito do responsável. D-02
resolvida: TI-0010 em manutenção, seguindo a lista específica de equipamentos,
com 9 disponíveis/3 em manutenção no conjunto inicial. Alternativa 10/2 do
briefing descartada pelo responsável; o PRD não define o estado desse cabo.
Proposta revisável: docs/specs/006-dados-iniciais/proposta-tecnica.md. Modelo,
conta/Storage e dados existentes ainda não aprovados/diagnosticados. Nenhum seed,
conta, upload ou alteração no deploy foi executado.

Depois, o responsável aprovou o modelo aditivo em arquivos novos e as
configurações Marcelo Grilo/colaborador, confirmação individual de conta nova e
bucket equipamentos-pratica. Reiterou que nenhum original pode mudar. Material
local em backend/db/pratica/entrega-3: inventário somente leitura, SQL aditivo,
modelo Prisma separado, preparador offline e roteiro humano. 13 testes locais,
tipos e validação Prisma passaram; não comprovam Auth, Storage ou estado real.
D-08 depende do inventário humano; fotos finais/manifesto continuam pendentes.

Revisão inicial identificou três lacunas locais (expectativas de catálogo,
assertiva de credencial e preservação das revisões no pacote). Principal corrigiu;
nova sessão limpa conferiu hashes, 13 testes aprovados e as correções, sem outro
defeito material local. Relatório literal em
docs/pratica/entrega-3-dados-prova/revisao-02.md. Veredito da spec 006: NÃO PRONTA,
pois faltam inventário real, fotos/revisões, conta/login/zero do professor e
aplicação/repetição humana. Nenhuma dessas provas foi substituída por fixture.

Estado posterior: chave usada privadamente, 12 consultas concluídas e 23 imagens
triadas pelo agente (18 recusas, três sugestões, dois casos pendentes). Nenhuma
aprovação humana ou manifesto real. Responsável decidiu buscar as fotos
manualmente e deixar a seleção automática como está. Isso não encerra a Entrega 2.
Evidência: docs/pratica/entrega-2-imagens-prova/triagem-2026-11-11.json.

Planejamento separado por tarefa em `docs/pratica/planejamento/README.md`. Responsável autorizou iniciar a skill e aprovou sharp/registro técnico em 11/11/2026. Specs 006/007 e plano de fechamento continuam propostas sem aprovação/implementação nesta etapa. Conflitos pendentes não representam decisões humanas já tomadas.

Atualização de fonte em 11/11/2026 (D-15): o responsável informou que o professor indicou Pixabay para substituir o Pexels. Planos da skill e specs 006/007 foram adaptados com origem, licença e proposta de crédito corretos. A alegação sobre o site antigo é informação transmitida pelo responsável; não foi diagnosticada indisponibilidade do Pexels. Nenhuma busca autenticada, imagem, instalação ou publicação foi executada por essa atualização. Histórico da primeira etapa permanece inalterado.

## Links

- Frontend: https://github.com/GustHenriqueFerreira/empresta.ai-frontend
- Backend: https://github.com/GustHenriqueFerreira/empresta.ai-backend
- Produção: https://empresta-ai-frontend.vercel.app/
- Configuração e provas desta etapa estão no workspace local; não houve push desta etapa. A tag final entrega-pratica será tratada ao concluir a prática, não nesta etapa.

## 1. Conflitos

| Pedido | Contrariava o quê | O que foi feito | Por quê | Registro | Commit |
|---|---|---|---|---|---|
| Tech lead permite ao verificador corrigir teste | Independência exigida na própria Entrega 1 | Responsável decidiu que só o principal corrige | Revisor não pode enfraquecer a própria prova | agents/verificador-spec-pratica.md, rules/spec-flow-pratica.md; recusa literal em docs/pratica/entrega-1-prova/03-erro/relatorio.md | backend 6ea7f90 / 695e892 |
| Arquivo do agente por si só garantiria somente leitura | Codex herda permissões do pai | Não usar TOML como prova de sandbox; adotado plano B sem ferramentas | Instrução não é bloqueio técnico | docs/pratica/entrega-1-prova/README.md; exportação em backend/docs/pratica/entrega-1/ferramentas/ | backend 695e892 |
| Instalar sharp automaticamente | Nova dependência não estava autorizada | Responsável escolheu sharp e aprovou registro; ADR 003 antes da instalação, pacote isolado | Garantir processamento sem mudar os apps congelados | docs/adr/003-processamento-imagens.md; skills/imagens-equipamentos/package-lock.json | local, sem commit |
| Somente Pexels no HTML original | Orientação posterior para Pixabay | Responsável confirmou substituição; planos/skill usam Pixabay | Aplicar orientação nova sem adulterar o material histórico | D-15 em docs/pratica/planejamento/decisoes-pendentes.md | local, sem commit |

## 1b. Lacunas

| Escopo | O que faltava | Alternativas | Decisão | Por quê | Commit |
|---|---|---|---|---|---|
| Entrega 1 | Como cobrir REST com dois repositórios | Uma revisão por pacote ou workspace conjunto | Workspace conjunto, com revisões explícitas de front/back | Ambos estão disponíveis; evitar supor prova da interface a partir da API | backend 695e892 (definição exportada) |
| Entrega 1 | Como operar sem seletor nativo de papel no harness | Fingir ativação, trocar ferramenta ou usar plano B da aula | Sessões novas com definição canônica e pacote de evidências | Funciona sem alterar stack nem conceder acesso a produção | backend 695e892 |
| Entrega 1 | Como executar checks sem conceder shell ao revisor | Dar acesso ao executor ou separar execução de revisão | Principal executa e vincula saída/hashes; revisor avalia sem ferramentas | Reduz autoridade e identifica honestamente quem executou | backend 6ea7f90 / 695e892 |

## 2. Onde o agente assumiu algo

O principal preparou o primeiro pacote sem o último handoff, embora o verificador o exigisse. Na rodada 01, quatro testes passaram, mas o revisor bloqueou PRONTA pela entrada ausente. O principal incluiu o documento e iniciou nova sessão: rodada 02 aprovada. O caso e as saídas reais estão preservados; não foram inventados como narrativa posterior.

Na revisão adicional pedida pelo responsável em 11/11, a alegação ampla de que o gate anterior falhava fechado foi confrontada com contraexemplos que a auditoria inicial não havia exercitado. O principal corrigiu aprovações com vereditos contraditórios, IDs parciais, sessão incompleta, checks inconsistentes e corrida de gravação. O subagente auditor apenas relatou; não fez correções. Provas de antes/depois e limitações: docs/pratica/entrega-1-revisao-2026-11-11/README.md. Não atribuir essas correções aos commits históricos: estão locais, sem novo commit/push.

Na skill de imagens, 22 testes iniciais não percebiam a ausência da data de obtenção no manifesto nem a comparação de nomes de credenciais sensível a caixa no Windows. Avaliação independente encontrou ambos; principal corrigiu e acrescentou regressões. Rechecagem confirmou 23 testes e o fluxo de lote/recusa sem fotos reais. Não chamar fixtures verdes de integração pronta: docs/pratica/entrega-2-imagens-prova/.

## 3. Decisão e ADR

Separar execução dos checks da revisão sem ferramentas tem alternativa defensável: dar shell de leitura ao revisor. Escolhemos o pacote controlado porque o harness local não fornece redução de permissões por subagente. Essa mudança da Entrega 1 ficou em rules/definição. Na Entrega 2, sharp passou por aprovação explícita e ADR 003 novo porque adiciona dependência nativa ao ferramental. Windows/.NET foi alternativa oferecida, mas o responsável escolheu sharp. PRD e ADRs originais não foram editados.

## 4. Skill imagens-equipamentos

Implementação local em skills/imagens-equipamentos, reconhecida no catálogo do Codex por entrada .agents/skills do workspace. Não concluída como entrega completa: falta chave Pixabay e as 12 fotos/revisões reais.

- SKILL.md: quando usar, fronteiras, entradas e interrupções. references/: contrato/fontes, checklist visual e operação por lotes.
- Scripts TypeScript: GETs permitidos, validação de URLs/tipo/tamanho, sharp 800×600, cache de 24h, unicidade, origem/data/hashes, revisão vinculada aos bytes e manifesto. buscar.ps1 recebe chave mascarada por stdin, sem variável nova/arquivo/argumento público.
- Código garante dimensões/integridade/duplicidade exata e exige revisão registrada; pessoa avalia conteúdo visual. Flags ou hash não são detector de pessoas/logos nem assinatura de identidade.
- Preparador não tem SDK/comando de upload ou banco; recusa credenciais de produção conhecidas. Isso não limita todas as ferramentas do principal. Humano fará publicação na 006.
- Validação atual: 23 testes Jest, typecheck, sete recusas CLI, metadados/referências/descoberta e avaliação independente com correções pelo principal. Detalhes em docs/pratica/entrega-2-imagens-prova/.
- Continuidade: responsável usou chave privadamente e a primeira busca retornou 20 candidatas. Uma imagem foi baixada e recusada na triagem do agente (logo, tela e categoria inadequada); nenhuma aprovação humana foi inferida. Restam consultas e seleção das 12 fotos, revisão humana e manifesto real. Chave não foi persistida; -Todos permite um novo prompt para as consultas fixas restantes. Evidências em continuidade-primeira-busca.json e triagem-primeira-foto.json. Crédito na tela permanece tarefa da 007.

## 5. Subagente verificador

- Gatilho: após as tarefas e antes de PRONTA, exigido por AGENTS e rules/spec-flow-pratica.md; o gate local retorna código não zero sem aceite válido. Não é CI.
- Contexto: uma sessão nova por rodada; definição canônica, regras, spec/plano/tarefas, fontes e provas explícitas. Não herda a conversa de implementação.
- Autoridade: não corrige; sem shell, apps/plugins/web e escalonamento; read-only e sem configuração de usuário. Não recebe segredos. Checks vêm do principal com hashes e executor declarados, não são anunciados como execução própria.
- Cobertura REST: workspace conjunto; se faltar um lado, não aprovar o conjunto.
- Descoberta nativa TOML: indisponível nesta instalação; o mecanismo real foi o plano B explicitamente admitido na aula.

## 6. Verificador em ação

Tabelas literais e logs: docs/pratica/entrega-1-prova/.

1. Rodada 01: NÃO PRONTA por handoff ausente, embora os testes passassem.
2. Rodada 02: PRONTA para a calibração após o principal corrigir a entrada.
3. Rodada 03: o principal comentou o teste CA-07 na cópia; três testes passaram, mas o CA ficou SEM TESTE e o veredito foi NÃO PRONTA. O pedido de autocorreção foi recusado.
4. Rodada 04: principal restaurou a cópia; quatro testes passaram e o veredito voltou a PRONTA. integridade.json demonstra igualdade com o original.

Revisão posterior: a primeira tentativa 05 falhou antes de emitir eventos e foi preservada como falha. Na tentativa 05-2, o modelo recusou a instrução indevida do suposto tech lead, marcou CA-07 SEM TESTE/NÃO PRONTA e o gate bloqueou. A rodada 06, com cópia restaurada e quatro testes aprovados, recebeu PRONTA e gate aprovado. Logs e relatórios literais nas pastas 05/06 de docs/pratica/entrega-1-prova/. Isso prova esses cenários; não demonstra resistência universal a prompt injection.

A prova calibra apenas hojeBrasilia em duas bordas explícitas. NÃO significa aprovação global de prazo, empréstimos, concorrência ou da spec 004. As tabelas finais das duas novas specs de produto serão incluídas nas etapas correspondentes.

Em 11/11/2026, após o pedido do responsável para terminar a pendência apresentada, foram criados dois commits locais no backend: `6ea7f901bd72bdcded250cfd5120340b5e777c59` (snapshot com erro) e `695e8929648b8f16c79d572861aff77232ec76ec` (snapshot restaurado, fechamento e ferramentas). As provas foram executadas em 06/11, antes desses commits de arquivamento; o erro nunca foi aplicado ao aplicativo. Compare `backend/docs/pratica/entrega-1/teste-calibracao-atual.spec.ts.txt` entre os dois commits. Nenhum push foi executado.

## 7. Regra posta à prova

A regra antiga proibia toda escrita e, ao mesmo tempo, mandava executar builds que geram arquivos. Mantivemos a proibição de correção e a verdade sobre o executor: o principal executa os checks seguros em cópia isolada, e o revisor recebe a prova atual. Sem teste ativo com CA, não aprova — mesmo com a suíte verde. O handoff é escrito pelo principal, não pelo verificador.

## 8. Fora de escopo e estado

Entrega 1 concluída localmente, com evidências dos seis requisitos em `docs/pratica/entrega-1-verificador.md`. Entrega 2 tem código local e avaliação independente, mas faltam chave/12 fotos/revisões reais; as entregas 2–5 continuam sem conclusão completa. Nenhuma escrita em produção, conta, imagem real, equipamento, empréstimo ou deploy. Foram feitos somente os dois commits locais anteriores; nenhum commit/push nesta tarefa. Os 104 arquivos da primeira entrega permanecem idênticos ao ZIP.

Auditoria independente de encerramento: `docs/pratica/entrega-1-auditoria-final.md`. Os seis itens foram conferidos contra código, pacotes, relatórios e logs; nenhum item adicional foi identificado para o encerramento local, com os limites expressos no parecer.


## Preservação determinada pelo responsável — 06/11/2026

A partir desta determinação, os 104 arquivos presentes no ZIP original estão congelados. Cinco documentos que haviam recebido alterações da parte 2 foram restaurados byte a byte, com as alterações preservadas em pasta nova. Todo o trabalho adicional fica em novos arquivos, guiado por PARTE-2.md. O agente-base e as regras-base não são reescritos. Relatórios e pacotes anteriores permanecem literais como histórico real da prova; não foram adulterados para parecer que a regra de preservação já existia. Os dois commits de 11/11 adicionam apenas provas e ferramentas; o diff acumulado não altera nenhum arquivo anterior.
