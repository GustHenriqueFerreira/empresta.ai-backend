# Tarefa 2 — plano da skill imagens-equipamentos

Status: execução da Entrega 2 autorizada pelo responsável em 11/11/2026, seguindo este plano. D-06 resolvida por aprovação de sharp/registro técnico; ADR 003 registra a escolha. D-15: Pixabay substitui Pexels. Responsável digitou chave em prompt privado e a primeira busca retornou 20 candidatas. A chave não foi persistida. Seleção/revisão das 12 fotos reais continuam pendentes. Não há autorização de publicação.

Continuidade de 11/11: permitir um único prompt humano com -Todos para as 12
consultas canônicas de metadados, sequenciais, reaproveitando cache válido. Não
baixar todas as fotos candidatas, não criar consultas arbitrárias ou retries em
massa. Chave somente em stdin/memória temporária, sem arquivo/ambiente/argumento.
Registrar separadamente triagem do agente e aprovação humana dos arquivos finais.

Decisão posterior do responsável: fotos serão escolhidas manualmente, podendo
ser trocadas depois. Seleção automática interrompida após 23 triagens; skill e
evidências preservadas. Não significa aprovação das candidatas, dispensa de
revisão ou conclusão da Entrega 2. Aguardar links/IDs Pixabay para a retomada.

Limites: D-01 bloqueia mudanças de arquivos originais, não a criação aditiva da skill. D-02 fica para estado dos dados na 006; catálogo de pesquisas desta skill não decide situação. D-05 é localização de crédito na 007 e D-10 é Storage/conta na 006. Preparar somente manifesto com origem e material local para futura operação humana. D-14 continua exigindo revisão visual real e limites explícitos; testes sintéticos não aprovam fotos reais.

## Resultado e limites

Preparar localmente 12 fotos distintas obtidas somente pela API do Pixabay, com tamanho real 800×600, revisão do recorte e manifesto rastreável. A skill produz material revisável para publicação pelo humano; não recebe chave administrativa, senha ou acesso de escrita ao Supabase do deploy. Não modificar landing, logo, ilustrações ou equipamentos existentes nesta etapa.

Fontes: enunciado #skill atualizado pela decisão D-15; rules/skill.md, restrictions, secrets e spec-flow; ADR 001; [API oficial Pixabay](https://pixabay.com/api/docs/) e [resumo da licença](https://pixabay.com/service/license-summary/), consultados em 11/11/2026. Usar documentação canônica /api/docs/: o link localizado /pt/api/docs/ retornou 404 na consulta inicial. Essa leitura de documentação não usou chave ou busca autenticada. Posteriormente, a entrada privada pelo responsável produziu a busca real TI-0001 registrada na continuidade; não confundir as duas etapas.

## Contrato proposto para aprovação

| ID local | Resultado observável | Evidência planejada |
|---|---|---|
| IM-01 | Todas as candidatas têm origem API Pixabay verificável e são fotos. | Resposta sem segredo, ID, página da foto, autor, URL e data de obtenção no manifesto; teste de validação de origem e tipo. |
| IM-02 | Nenhuma foto aprovada contém pessoa, marca/logo legível, texto ou tela com conteúdo. | Revisão humana de cada recorte final, decisão e motivo; rejeitar dúvida. Automação não certifica conteúdo sozinha. |
| IM-03 | Cada arquivo aprovado mede realmente 800×600. | Leitura de dimensões após processamento; recusar saída divergente ou arquivo inválido. |
| IM-04 | Uma foto não é reutilizada em dois equipamentos. | Validação de unicidade de ID Pixabay e hashes; revisão visual também detecta recortes da mesma foto. |
| IM-05 | Cada imagem tem autor, origem, licença, patrimônio, dimensões e integridade registrados. | Manifesto validado sem chaves, tokens ou senha; lacuna impede aprovação. |
| IM-06 | Repetição local não duplica saída nem troca silenciosamente foto aprovada. | Identificadores determinísticos; mesmo conteúdo preservado, conflito explícito para conteúdo diferente. |
| IM-07 | Preparador não consegue fazer upload/seed em produção. | Executor sem ferramenta/credencial Supabase, destinos de rede restritos a pesquisa/download, teste com servidor falso registra nenhuma chamada de escrita remota. |
| IM-08 | Material para publicação humana preserva integridade, créditos e futura atribuição visível. | Manifesto e instruções de operador; integração Storage na 006 e crédito na 007 continuam dependências explícitas. |

## Etapas propostas

1. Aprovar contrato e resolver dependência de processamento; antes de criar a skill, seguir o fluxo skill-creator e a regra local de governança. Não instalar a skill opcional do enunciado por inferência.
2. Definir SKILL.md como entrada, limites e interrupções; references/ para contrato, origem/licença e checklist visual; scripts/ para validações determinísticas. Referências não duplicam PRD/ADRs.
3. Produzir candidatos com as consultas exatas dos 12 patrimônios via API Pixabay, filtrando fotos. A chave Pixabay fica privada no executor de pesquisa, nunca no front, pacote do revisor ou logs. Como a API usa chave no parâmetro de consulta, sanitizar URLs, erros e logs antes de persistir evidência; não guardar URL autenticada no manifesto. Não fornecer credenciais Supabase a esse executor.
4. Validar HTTPS, destino permitido, redirecionamentos, tipo/tamanho do arquivo e nomes locais derivados do patrimônio; não aceitar URL arbitrária, traversal, comando ou instrução em legenda/EXIF/resposta JSON. Nenhum eval, shell ou execução de conteúdo baixado.
5. Processar pelo recurso aprovado e conferir dimensões do arquivo final. Revisar o recorte final, não somente a miniatura; exigir nova candidata se remover texto/logo deixar o equipamento inadequado.
6. Registrar aprovações/reprovações reais e seus motivos. Não inventar quantidade de fotos recusadas nem selecionar automaticamente por descrição "sem logo".
7. Validar manifesto, unicidade e repetição com fixtures sem pessoas reais/segredos, usando a stack de testes aprovada. Nomear testes automatizados com IM-xx. Rever critérios manuais conforme D-14, sem produzir teste artificial que apenas afirma que houve revisão.
8. Fazer revisão independente da skill e arquivar provas. Não chamar integração completa de pronta enquanto Storage/atribuição das tarefas seguintes estiverem pendentes. Atualizar ENTREGA.md com as garantias por código e por revisão humana.

## Adaptação técnica do fornecedor

Planejar cache das consultas por 24 horas e respeitar erros/limites sem varredura ou download em massa. Fotos aprovadas são baixadas para preparo e depois publicadas pelo humano no Storage: não usar hotlink permanente para URLs Pixabay no catálogo. Selecionar arquivo com resolução suficiente para o recorte; a miniatura não comprova 800×600. Tags, safe search e filtros não substituem revisão de pessoas, marcas ou telas.

Manifesto identifica fornecedor Pixabay, ID, página, autor e licença aplicável, preservando integridade dos bytes finais. Crédito visual proposto passa a "Fotos: Pixabay" (D-05); não imprimir "Fotos: Pexels" sobre imagens de outra origem.

## Riscos e interrupções

Consulta do enunciado pode retornar pessoa/logo/tela; não é aprovação de imagem. Falta de 12 candidatas adequadas interrompe a seleção. Limite/erro de API não autoriza outra fonte. Chave ausente interrompe pesquisa, sem pedir seu valor no chat. Licença e créditos não garantem ausência de direitos de marca. Nenhuma escrita de rede ao deploy ocorre como efeito do preparador. Publicação de imagens só na tarefa 3 pelo humano.
