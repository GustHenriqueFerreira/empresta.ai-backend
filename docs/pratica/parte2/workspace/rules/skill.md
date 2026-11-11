# Regras para skills

> Leitor: agente e pessoa desenvolvedora.

## Objetivo

Orientar a criação e o uso de instruções reutilizáveis para atividades recorrentes do EMPREST.AI. Este arquivo é uma regra de governança em `rules/`; ele não cria, por si só, uma Agent Skill executável.

## Decisões do projeto aplicáveis

- Uma skill automatiza um modo de trabalho repetível; não se torna fonte de requisito, regra de negócio ou decisão arquitetural.
- O escopo da skill deve respeitar os limites de frontend, backend, persistência e documentação registrados em `AGENTS.md` (seção 6, estrutura do monorepo).
- A stack e as responsabilidades técnicas continuam definidas em `docs/adr/001-stack.md`.
- Toda execução deve começar pelo handoff atual e preservar a rastreabilidade definida em `rules/spec-flow.md`.
- Uma skill que lide com configuração, migrations ou testes deve seguir, respectivamente, `SECRETS.md`, `migrations.md` e `tests.md`.

## Conteúdo mínimo

Uma skill deve declarar:

- quando deve ser usada;
- qual resultado produz;
- quais fontes do projeto precisa consultar;
- quais alterações pode realizar;
- quais ações exigem autorização;
- como o resultado será validado;
- quais condições impedem sua conclusão.

## Limites

- Não incorporar regra de negócio ausente no PRD.
- Não consolidar hipótese como decisão; decisões permanentes pertencem aos ADRs.
- Não assumir que um critério de `docs/andar-zero.md` (quando o arquivo existir) já está implementado sem evidência no repositório.
- Não ampliar o escopo autorizado pelo pedido atual.
- Não ocultar falha, limitação ou etapa manual necessária.

## Validação

Antes de adotar ou alterar uma skill, verificar se suas instruções apontam para caminhos existentes, não contradizem as fontes de verdade e produzem evidências compatíveis com `CHECKS.md`.
