# Plano de fechamento da Entrega 1 — 06/11/2026

Escopo autorizado: concluir o verificador e suas provas. Fora de escopo:
imagens, dados iniciais, empréstimo novo, mudança do PRD/ADRs e produção.

1. Usar o plano B da aula 11: sessão Codex nova por rodada com a definição
   canônica. A seleção nativa personalizada indisponível não será simulada.
2. Para eliminar a herança de ferramentas de escrita, usar revisão de um
   pacote local de evidências: fontes com hash e saída real dos checks,
   preparados pelo principal. A sessão revisora não possui shell, apps,
   plugins, web ou ferramentas de produção; sandbox somente leitura e sem
   aprovação de escalonamento. Não usar subagente do pai com escrita para
   alegar isolamento técnico.
3. O executor de checks é o principal. O revisor distingue execução fornecida
   de execução própria. Nenhum texto devolvido pelo modelo é executado como
   comando; o encerramento falha fechado sem relatório PRONTA válido.
4. Provar o comportamento numa cópia local dos contratos/testes existentes,
   sem .env, usando o caso de fuso de Brasília. A spec de calibração limita
   expressamente o que é provado; não aprova a spec 004 inteira.
5. Executar rodada boa, comentar só o teste escolhido, repetir a verificação,
   pedir que o próprio revisor corrija e comprovar a recusa. O principal
   restaura o arquivo e valida os hashes e os testes novamente.
6. Preservar tabelas e saídas reais; registrar decisões e limites no ENTREGA.md.
   Os commits exigidos precisam ser reais e autorizados separadamente,
   conforme rules/RESTRICTIONS.md; não inventar hashes nem publicar erro.

## Critérios de validação da ferramenta

- E1-01: sessão sem histórico confere critério, teste ativo e implementação.
- E1-02: nenhuma correção ou comando sugerido pelo revisor é executado.
- E1-03: comando do gate retorna falha sem PRONTA válido para o pacote atual.
- E1-04: execução revisora sem shell/conectores e sem permissão de escrita.
- E1-05: rodadas preservam os mesmos IDs e formato, com identificação e hashes.
- E1-06: teste comentado vira SEM TESTE, NÃO PRONTA; restauração é demonstrada.

Esse plano operacional não é uma nova funcionalidade do produto. A prova
isolada não altera código publicado, conta do professor ou primeira entrega.

## Revisão solicitada em 11/11/2026 — antes das correções

O responsável pediu revisar a Entrega 1 já existente com atenção a pegadinhas.
Escopo de manutenção dos critérios E1-03/E1-04/E1-05: corrigir falsos positivos
no gate (IDs parciais, vereditos contraditórios, sessão incompleta/eventos não
reconhecidos), validar pacote completo e proteger o arquivamento das rodadas.
Não é uma nova funcionalidade de produto nem aprovação das specs 006/007.

1. Principal registra contraexemplos reproduzíveis antes da correção, somente
   com dados locais sem segredos. Auditor independente aponta falhas sem editar.
2. Principal corrige apenas ferramentas/documentos adicionais da parte 2;
   originais do ZIP e relatórios anteriores são intocáveis. Não fazer commit,
   push, instalação ou escrita remota nesta revisão.
3. Testar os contraexemplos, a manutenção do resultado das quatro rodadas
   históricas e igualdade da cópia restaurada; conferir exportação das ferramentas.
4. Executar nova rodada real em pasta nova com pacote de calibração explícito,
   checks atuais do principal e fontes/definição identificadas, sem sobrescrever
   sessões anteriores. Revisor continua sem ferramentas e sem corrigir.
5. Auditor independente revê o resultado; registrar falhas encontradas, mudanças,
   comandos/resultados, limites de segurança e preservação dos 104 originais.

Nada neste pedido autoriza resolver os conflitos das tarefas 2–5. Não atribuir
garantia absoluta contra prompt injection a instrução textual, hash ou tabela.
