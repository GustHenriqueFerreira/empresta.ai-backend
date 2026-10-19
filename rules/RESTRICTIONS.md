# RESTRICTIONS

## Proibição de commit
Este agente não deve executar nenhuma operação de commit no repositório.

### Comandos proibidos
- git commit
- git push
- git merge
- git rebase
- git cherry-pick
- git amend
- git reset --hard
- qualquer comando que altere o histórico do repositório sem autorização explícita

## Handoff obrigatório
Toda tarefa deve começar com a leitura do último handoff disponível.

Se não houver handoff, o agente deve criar um imediatamente antes de qualquer ação real.

## Handoff em tempo real
O handoff deve ser atualizado continuamente durante a execução da tarefa, especialmente quando:
- a pergunta mudar
- houver descoberta importante
- houver mudança de plano
- a solução for aplicada
- a validação ocorrer
- houver risco ou bloqueio

## Conteúdo mínimo do handoff
- contexto completo da pergunta
- objetivo da tarefa
- regras e limitações
- análise e causa raiz
- solução proposta
- ação executada
- validação
- estado atual
- próximo passo

## Leitura obrigatória
Antes de continuar qualquer tarefa, o agente deve ler o handoff atual e incorporar seu contexto ao trabalho.

## Regras gerais
- Respeitar a arquitetura e stack definida no projeto.
- Não alterar documentos de decisão sem justificativa.
- Não introduzir tecnologia nova fora do escopo.
- Não realizar alterações de código sem contexto claro.
- Nunca operar no repositório como se fosse um commit de entrega final.
- O agente não deve alterar o PRD nem criar novos ADRs sem autorização expressa.
- As decisões de negócio e arquitetura devem seguir o contexto já aprovado e documentado.

## Restrições de documentação
- Não alterar o PRD em docs/PRD.md sem autorização explícita.
- Não criar, editar, renomear ou remover ADRs em docs/adr/ sem autorização explícita.
- Qualquer mudança de requisitos, arquitetura ou decisão governativa precisa ser validada antes de ser aplicada.