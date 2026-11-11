# Proposta de execução contínua das Entregas 3, 4 e 5

11/11/2026. O responsável pediu manter as imagens atuais e receber o resultado
somente quando tudo estiver concluído. Não é aceite de lacunas, permissão para
alterar originais, apagar dados ou o agente escrever no deploy. Não prometer
certeza absoluta nem inventar Veredito: PRONTA.

## Versão evoluída — decisão antes de código da 007

Proposta: criar C:/Users/gustavoferreira-IEG/Desktop/Inovação de tecnologia/
emprestai-parte2, separado do original emprestai. Copiar somente fontes e
documentos necessários, sem .env, .git, node_modules, caches, dist ou credenciais.
Qualquer edição funcional fica nessa cópia autorizada. A checagem dos 104
originais aponta sempre ao diretório emprestai e ao ZIP congelado.

Manter PRD: três itens abertos, 14 dias corridos em America/Sao_Paulo, bloqueio
por atraso/manutenção e privacidade. Crédito visível Fotos: Pixabay, com origem
individual acessível. Não interpretar limite de cinco/dias úteis/sem crédito do
briefing como decisão do responsável. Aprovar esse contrato antes do código.

Testes propostos: Jest/TypeScript existentes, PostgreSQL local isolado em Docker
para concorrência real e verificação da interface pelo navegador integrado.
Nenhuma conexão/credencial de produção nos testes. Nenhuma nova biblioteca ou
ferramenta de migration aprovada nesta proposta. Se surgir dependência necessária,
preparar motivo/ADR/revisão antes de pedir decisão específica.

## Dados existentes — D-08

Painel mostrou quatro equipamentos demo. Não sabemos ainda seus patrimônios e
histórico; inventariar em leitura, sem renomear/deletar.

Opção proposta para decisão: preservar as quatro demonstrações e seus históricos
no banco existente e tratar os 12 equipamentos da prática como conjunto explícito.
Catálogo da versão nova exibe esse conjunto de 12 por associação, e a versão
original permanece com seu comportamento. Contagem total de equipamentos no
banco pode ser 16; não alegar que todo o banco contém somente 12. Ajustar a spec e
os testes para refletir essa decisão, se aprovada. Conflitos de patrimônio, nome,
estado, IDs ou histórico continuam bloqueando adoção automática.

Alternativa: ambiente Supabase separado, criado/configurado pelo humano, mantendo
o atual intacto. Somente esse destino teria catálogo físico de 12. Custos/limites
do provedor e credenciais novas precisam ser tratados pelo responsável. Não criar
conta/projeto/bucket nem transferir dados por inferência.

## Imagens escolhidas pelo responsável

Pedido explícito: manter as 12 candidatas de provisorio-e3-20261111. Não buscar
novas sem pedido. A escolha pode ser usada na versão solicitada, com rastreio de
autoria/licença/hashes, mas não apaga as divergências visuais já observadas:
pessoas, marcas/textos e itens de outra categoria em algumas fotos.

O enunciado exige restrições que essas candidatas não satisfazem. Não preencher
flags falsas, fingir revisão humana específica ou enfraquecer o gate para gerar
PRONTA. Se o responsável quiser entregar com essas divergências, registrar como
exceção aceita por ele e como conformidade visual pendente/reprovada em relação
ao professor. Isso não equivale a dizer que a prática inteira atende ao enunciado.

## Publicação e comprovação

Preparar material revisável e checkpoints. O humano executa criação Auth,
Storage/SQL e jornadas que escrevem no deploy. Não coletar senha no chat nem usar
a conta do professor para empréstimos. Não há exceção à regra de produção no
pedido genérico para concluir.

Após funcionamento e provas: sessão limpa/gate de cada spec, ENTREGA.md completo
nas duas raízes Git, auditoria de segredos/links, conjunto concreto de commits/
tags/destinos. Publicação/tag/deploy só conforme autorização aplicável; não mover
tag existente. Não declarar versão local como versão publicada.
