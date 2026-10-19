---
description: Contrato de operacao entre mim e o agente neste projeto
globs: []
alwaysApply: true
---

# Contrato de operação

## Git
> leitor: agente

- Commit: <DECIDIR>
- Push: <DECIDIR>
- A mensagem de commit cita a tarefa e o critério de aceitação.
- Um commit por tarefa. Nunca junte código e mudança de regra
  no mesmo commit.

## Autorização por tipo de ação
> leitor: agente

| ação                                        | nível          |
|---------------------------------------------|----------------|
| Editar arquivo existente dentro do escopo d | <DECIDIR>      |
| Criar arquivo novo                          | <DECIDIR>      |
| Deletar ou renomear arquivo                 | <DECIDIR>      |
| Instalar ou atualizar dependência           | <DECIDIR>      |
| Criar ou alterar migration                  | <DECIDIR>      |
| Mexer em variável de ambiente, config de de | <DECIDIR>      |

O que cada nível significa:
- livre — faça e siga em frente.
- avisar depois — faça e me diga na resposta o que fez.
- pedir antes — descreva o que pretende fazer e PARE.
- proibido — não faça, mesmo que eu peça no meio de uma tarefa.
  Se eu pedir, me lembre desta linha.

## Configuração do operador
> leitor: humano — isto não é instrução para o agente

| fase                              | modelo / raciocínio |
|-----------------------------------|---------------------|
| Escrever a spec                   | <DECIDIR>           |
| Planejar e quebrar em tarefas     | <DECIDIR>           |
| Executar uma tarefa já decidida   | <DECIDIR>           |
| Debugar algo que quebrou          | <DECIDIR>           |
| Revisar o diff antes do commit    | <DECIDIR>           |

- Revisão de diff acontece em sessão limpa, de preferência com
  modelo diferente do que escreveu o código.
- Sessão longa não se corrige com regra mais enfática: encerre
  seguindo `rules/HANDOFF.md` e abra outra.
