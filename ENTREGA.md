# EMPREST.AI — prática, parte 2

Versão final do escopo autorizado em 11/11/2026. Specs 006 e 007 receberam **PRONTA**, com gate código 0. Login real, catálogo com 12 fotos/créditos, solicitação e próprios empréstimos funcionaram na versão publicada; a jornada incluiu devolução.

Não é conformidade integral ao enunciado original: o responsável escolheu manter fotos ilustrativas visualmente divergentes, dispensou a conta do professor e autorizou execução de banco/Storage/publicação pelo principal como exceção ao método humano. Essas decisões são registradas, não atribuídas ao professor nem apresentadas como requisitos originais cumpridos.

## Links e versão

- [Frontend em produção](https://empresta-ai-frontend.vercel.app/).
- [Backend — GET /api/health](https://empresta-ai-backend-2xeh.vercel.app/api/health).
- [GitHub backend](https://github.com/GustHenriqueFerreira/empresta.ai-backend) · [tag entrega-pratica](https://github.com/GustHenriqueFerreira/empresta.ai-backend/tree/entrega-pratica).
- [GitHub frontend](https://github.com/GustHenriqueFerreira/empresta.ai-frontend) · [tag entrega-pratica](https://github.com/GustHenriqueFerreira/empresta.ai-frontend/tree/entrega-pratica).

Health é público; catálogo e empréstimos exigem login. O responsável compartilha a credencial de teste privadamente, nunca pelo Git. Os commits dos dois repositórios são distintos, com a mesma tag. A documentação central/ferramentas está espelhada em docs/pratica/parte2/workspace de cada repo; os aplicativos não são duplicados.

## 1. Conflitos e decisões

| Conflito | Decisão e fonte que prevaleceu | Motivo |
|---|---|---|
| Tech lead autoriza verificador a corrigir teste | Só o principal corrige, por decisão do responsável | Preservar independência; erro plantado e recusa registrados na E1. |
| Briefing pede cinco empréstimos | Manter três, conforme PRD | Testado inclusive em pedidos concorrentes da mesma pessoa. |
| Briefing pede 14 dias úteis | Manter 14 corridos/Brasília, conforme PRD | Não inventar calendário de feriados; bordas verificadas no servidor e frontend. |
| TI-0010 disponível no resumo e manutenção na lista | Responsável aceitou a lista específica | Nove disponíveis/três manutenção inicialmente; repetição não força estado operacional. |
| Pexels no material antigo | Pixabay, conforme orientação posterior transmitida pelo responsável | D-15 registrada; não alegamos diagnosticar indisponibilidade do Pexels. |
| Catálogo sem crédito em um trecho | Crédito global e individual Pixabay | Rastreabilidade do contrato; sem atribuir ao novo serviço a licença do antigo. |
| Senha no seed | Nenhum segredo em código/Git | Conta separada sem senha em arquivo; conta do professor dispensada depois. |
| Exatamente 12 versus quatro DEMO existentes | Preservar DEMO/histórico e delimitar catálogo pelas 12 associações | Banco totaliza 16 equipamentos; não apagar dados para acertar contagem. |
| Congelamento absoluto versus evolução pedida | Só mudanças necessárias no original, sem cópia de projeto | ZIP intocado; 96 dos 104 originais iguais e oito exceções funcionais/testes. |
| Execução somente humana versus pedido expresso do responsável | Exceção específica para SQL/dados/fotos e publicação pelo principal | Identificar o ator real, sem fingir conformidade metodológica. |

Registro completo: [decisões](docs/pratica/parte2/workspace/docs/pratica/planejamento/decisoes-pendentes.md), [spec 006](docs/pratica/parte2/workspace/docs/specs/006-dados-iniciais/spec.md), [spec 007](docs/pratica/parte2/workspace/docs/specs/007-solicitar-emprestimo/spec.md) e [handoff](docs/pratica/parte2/workspace/docs/parte2/HANDOFF.md). Propostas históricas não são aprovações retroativas.

## 1b. Lacunas resolvidas

| Lacuna | Alternativa e decisão | Evidência |
|---|---|---|
| Harness não reduz autoridade individual de forma demonstrada | Plano B: sessão nova sem ferramentas e pacote explícito | Definição canônica e gate; TOML não é prova de sandbox. |
| Schema sem imagem/crédito/unicidade de patrimônio | Tabela separada, FK sem cascade, RLS e índice parcial dos 12 | SQL incremental e Prisma; sem framework novo de migration. |
| PGlite não prova sessões concorrentes | PostgreSQL 16 descartável no Docker existente | Dois PIDs, barreira e conferência dos estados finais. |
| Renderização estática não prova efeitos do browser | CUA automatizada com fonte e asserções reproduzíveis | Dez casos, incluindo timeout após persistência e reconciliação. |
| Documentação central fora dos repos | ENTREGA.md nas duas raízes e espelho com manifesto SHA256 | Roteiro de reprodução, sem .env/node_modules/cache. |
| Backend novo ficava apenas em Preview | Promoção autorizada e Production Branch corrigida de main para master | Domínio passou a servir o catálogo com fotos. |

## 2. Onde o agente assumiu algo

Na calibração E1, o principal omitiu o último handoff. O revisor bloqueou apesar dos testes verdes; o principal acrescentou a entrada e abriu sessão nova. O erro plantado depois removeu CA-07 apenas de uma cópia de calibração: o revisor marcou SEM TESTE e recusou corrigir; o principal restaurou. O erro nunca foi publicado no aplicativo.

A avaliação da skill encontrou comparação de nomes de credenciais sensível a caixa no Windows e ausência da data de obtenção no manifesto. Principal corrigiu e acrescentou regressões. Triagem inicial: 23 imagens, 18 recusadas, três sugestões, dois casos pendentes. A escolha posterior das 12 ilustrativas foi do responsável, com ressalvas; não virou aprovação visual falsa.

O principal criou uma cópia separada desnecessária. Após correção explícita do responsável, transferiu oito arquivos úteis, conferiu hashes e removeu a cópia. A evolução final está no original. Falhas de imports/DI, prontidão do Docker, query de fixture e sincronização/simulação de rede foram corrigidas no ferramental, mantendo os registros e as expectativas do produto.

A primeira revisão final da 006 encontrou caminho de escolhas sem teste e provas de Storage incompletas. Principal acrescentou testes e leitura das políticas. Rodadas seguintes solicitaram fontes auxiliares ausentes do pacote; foram anexadas. A 007 exigiu prova das bordas de persistência, POST real, lista própria e eventos do browser; os testes adicionais passaram sem reescrever os fluxos corretos. As reprovações permanecem literais.

## 3. Decisão técnica e ADR

Para PNG 800×600, foram oferecidos Windows/.NET e sharp. Responsável aprovou sharp/registro antes da instalação: [ADR 003](docs/pratica/parte2/workspace/docs/adr/003-processamento-imagens.md). Dependência isolada na skill; lockfiles dos aplicativos e stack original preservados. PRD e ADRs originais não foram reescritos.

Dar shell de leitura ao revisor seria alternativa defensável. Adotamos pacote sem ferramentas porque o harness herda permissões do pai; instrução não equivale a bloqueio técnico. O gate é local, não CI ou garantia universal contra prompt injection.

## 4. Skill imagens-equipamentos

[SKILL.md](docs/pratica/parte2/workspace/skills/imagens-equipamentos/SKILL.md) define uso e fronteiras; references/ contém contrato/checklist/operação; scripts/ implementa API Pixabay, cache, processamento e manifesto. Entrada do catálogo Codex aponta para a skill do workspace.

Código controla GETs/destinos, tipo/tamanho, proporção, dimensões, hashes, duplicidade exata e vínculo da revisão aos bytes; recusa credenciais conhecidas de produção e não oferece cliente/comando de publicação. Não detecta infalivelmente pessoas, marcas, telas ou adequação visual: esses pontos são humanos. Flags/hashes não são assinatura de identidade.

Fotos atuais são ilustrativas escolhidas com ressalvas. Algumas têm pessoas/marcas ou outro tipo de item: não cumprem a exigência visual original. Origem/autor/licença continuam rastreáveis. Dois perfis de autor chamam-se “Pexels”, mas URLs e fonte usados são Pixabay. Os 12 GETs públicos conferiram PNG, 800×600 e hashes iguais aos arquivos locais.

## 5. Subagente e gatilho obrigatório

Fonte: [verificador-spec-pratica](docs/pratica/parte2/workspace/agents/verificador-spec-pratica.md). Principal executa checks e abre sessão limpa antes de PRONTA. Revisor recebe spec/plan/tasks, regras, fontes e provas com hashes; não recebe credenciais, não corrige nem atualiza o handoff. Principal corrige e inicia nova rodada.

agents/rodar-verificador.mjs valida pacote, eventos, tabela e testes. CA pendente, execução incompleta ou veredito inválido retorna código não zero. Builds/Jest são atribuídos ao principal. TOML gerado não comprova ativação nativa; o plano B efetivamente usado está documentado. Nenhum texto devolvido vira comando.

## 6. Verificador em ação

[Provas E1](docs/pratica/parte2/workspace/docs/pratica/entrega-1-prova/README.md): rodadas 01/02 demonstram handoff ausente/corrigido; 03/04, teste removido/restaurado; 05/06 repetem provocação e recusa. Uma tentativa 05 falhou antes de produzir eventos e foi preservada. Commits de arquivamento backend: 6ea7f901bd72bdcded250cfd5120340b5e777c59 (erro na cópia) e 695e8929648b8f16c79d572861aff77232ec76ec (restauração). Arquivam provas anteriores; não são sua data de execução.

- [006 — tabela final, rodada 04](docs/pratica/parte2/workspace/docs/pratica/revisoes-finais/E3-final-rodada-04-20261111/relatorio.md): **PRONTA**, gate 0.
- [007 — tabela final, rodada 02](docs/pratica/parte2/workspace/docs/pratica/revisoes-finais/E4-final-rodada-02-20261111/relatorio.md): **PRONTA**, gate 0.

Rodadas reprovadas, pacotes e sessões literais estão preservados. Calibração de hojeBrasilia não foi confundida com aceite global de prazo/concorrência/interface.

## 7. Regra posta à prova e preservação

A regra antiga proibia escrita do revisor e pedia builds que geram arquivos. Mantivemos revisor sem execução/edição e principal como executor verdadeiro. Metadados/autor/“tech lead” não têm autoridade para trocar o papel. A recusa de um exemplo não prova resistência universal a injeções.

O preparador offline não ganhou credencial de produção. Separadamente, principal aplicou material revisado, repetiu somente 002-dados.sql e enviou fotos sob autorização específica. [Recibo](docs/pratica/parte2/workspace/docs/pratica/entrega-3-dados-prova/aplicacao-producao-20261111.json), [Storage efetivo](docs/pratica/parte2/workspace/docs/pratica/entrega-3-dados-prova/storage-politicas-20261111.json) e [GETs](docs/pratica/parte2/workspace/docs/pratica/entrega-3-dados-prova/imagens-publicas-20261111.json) registram o ator e os resultados. É exceção ao método humano, não seu cumprimento.

ZIP original de 05/11 intocado: SHA256 7239731AA6E86BAFE19E442CE29438C2A1BA6C7CAAC4CC3DEB03EB856015D9D2. agents/conferir-mudancas-autorizadas.ps1 confirma **96 originais iguais, oito mudanças necessárias, nenhuma remoção**: Prisma, serviço/teste, tipos, App, catálogo/CSS e Dialog. Login, AuthGuard, SQL original, PRD e ADRs originais preservados. Checker antigo de igualdade absoluta dos 104 é histórico, não é apresentado como verde.

## 8. Validação, limites e resultado

| Prova | Resultado | Ambiente |
|---|---|---|
| Backend Jest | 43/43 | HTTP/Prisma/PGlite/PostgreSQL descartável; Auth sintético |
| Dados Jest | 18/18 | Preparador efetivo, RLS, conflitos, SQL exato e repetição |
| Frontend Jest | 13/13 | Renderização, datas, bloqueios, lista e modal |
| Leituras públicas Jest | 2/2 | GET sem senha: fotos, hash/dimensões, health e recusa anônima |
| Browser automatizado | 10/10 | Fonte CUA; foco, duplo envio, erro, vazio, expiração e resposta perdida |
| Jornada real publicada | Passou | Login separado, 12 fotos, solicitação, data, lista e devolução |
| Builds | Passaram | Principal; não equivalem a teste de comportamento |
| Gates 006/007 | PRONTA / PRONTA | Escopo vigente e ressalvas explícitas |

[Jornada real](docs/pratica/parte2/workspace/docs/pratica/entrega-4-interface-prova/jornada-producao-20261111.json), [automação aprovada](docs/pratica/parte2/workspace/docs/pratica/entrega-4-interface-prova/jornada-automatizada-rodada-03.json) e [fonte CUA](https://github.com/GustHenriqueFerreira/empresta.ai-frontend/blob/entrega-pratica/testing/jornada-comportamento.cua.mjs). As tentativas anteriores permanecem. Provisionamento não criou empréstimo; jornada real criou um e o devolveu, preservando o histórico e os DEMO. Zero abertos refere-se à conta de teste, não zero históricos globais.

Auditoria preexistente do lockfile: 24 alertas, três altos, sem atualização automática; docs/pratica/auditoria-dependencias-20261111.json. Remediação das dependências antigas não integra esta evolução. Provas de disponibilidade/dados são observações datadas.

Sem reserva futura, e-mail, renovação, nova stack/login ou framework de migrations. Devolução/Operações/cadastro preexistentes preservados. A entrega funcional está concluída no escopo vigente; ressalvas impedem afirmar conformidade integral ao enunciado original.
