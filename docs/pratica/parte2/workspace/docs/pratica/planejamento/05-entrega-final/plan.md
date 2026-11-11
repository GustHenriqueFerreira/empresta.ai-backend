# Tarefa 5 — plano de documentação e fechamento

Status: execução autorizada pelo responsável em 11/11/2026, incluindo publicação dos dois repositórios. Gates 006/007 aprovados; documentação/arquivos revisados, publicação e tag são a etapa final deste roteiro.

## Resultado

Entregar dois repositórios acessíveis com mesma tag entrega-pratica, ENTREGA.md na raiz visível, provas/decisões das duas specs e links da Vercel coerentes com a versão entregue. Enquanto isso não for observado, relatar separadamente o estado local, GitHub e produção. Não usar estes verbos no passado antes de executar e conferir a ação.

## Etapas propostas

1. Durante cada tarefa, atualizar o ENTREGA.md novo com decisão humana, alternativas, motivo e fonte/CA correspondente. Ao fechar, auditar se cada decisão também está na spec/plano pertinente; decisão só no relatório não satisfaz o enunciado.
2. Completar seções 1 e 1b com todos os conflitos/lacunas resolvidos ou pendentes, sem inventar aprovação ou motivos históricos. Preservar o caso real do handoff ausente e da correção pelo principal, além do erro plantado e restaurado com seus commits reais.
3. Registrar uma decisão com alternativa defensável e justificar se merece ADR; se merecer, pedir autorização antes de criar/alterar o documento. Não reescrever ADR congelado para satisfazer o relatório.
4. Completar a divisão SKILL.md/references/scripts e garantias de código versus revisão humana; quantidade real de fotos recusadas e motivos; impedimento técnico de escrita do agente no deploy.
5. Guardar histórico real das rodadas de ambas as specs, tabelas finais, correções pelo principal, hashes e arquivo:linha. A calibração da tarefa 1 não substitui as tabelas das specs 006/007. Não esconder reprovações ou chamar pendência de sucesso.
6. Resolver a distribuição entre repos: root do workspace não é um repositório Git. Preparar adições documentais aprovadas na raiz de cada repo com links/revisões dos dois, sem depender de arquivos ausentes no GitHub e sem copiar .env. Conferir caminhos/links na versão que será marcada.
7. Rever arquivos e histórico a publicar para segredos, artefatos gerados e dados indevidos; não copiar o HTML inteiro com sua senha de exemplo para o Git. Se encontrar segredo anterior, interromper publicação e registrar tratamento/rotação humano, sem reescrever histórico por conta própria.
8. Exceção específica autorizada: principal executou a jornada remota somente na conta separada de teste e guardou prova sem segredo. Professor dispensado pelo responsável, sem alegar criação/login/zero. Concorrência e casos destrutivos somente no PostgreSQL isolado.
9. Conferir 96 originais iguais e oito mudanças necessárias autorizadas segundo D-01, mantendo o ZIP intacto; registrar baseline e revisões de front/back. Versões publicadas devem corresponder às decisões/tabelas, não apenas à versão local.
10. Preparar revisão final concreta: arquivos, commits e destinos. Só após autorização aplicável executar ou orientar commit/tag/push/deploy. Mesma tag entrega-pratica nos dois repos; não mover tag existente automaticamente. Conferir no remoto que cada tag aponta para o commit final correto e contém documentação.
11. Devolver links de cada repo/tag e site/API verificáveis, com limitações e itens não concluídos na seção 8. Nenhum ZIP novo ou alteração no ZIP da primeira entrega é parte desta tarefa sem pedido.

## Verificação e encerramento

Revisão de conteúdo/links, rastreabilidade e evidências basta para documentos, conforme rules/tests.md; não criar teste que apenas espelha o texto. Specs de produto continuam exigindo revisão do subagente e testes reais por CA. Checklist final cobre os itens do enunciado #entrega/#conferir e os estados reais do remoto. Não concluir a prática inteira com planos, commits locais ou link de deploy antigo.
