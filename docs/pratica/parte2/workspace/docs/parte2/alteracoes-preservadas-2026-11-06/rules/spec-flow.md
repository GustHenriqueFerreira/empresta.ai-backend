# Fluxo de especificação

> Leitor: agente e pessoa desenvolvedora.

## Objetivo

Manter rastreabilidade entre o pedido, as decisões já aprovadas, a implementação e a evidência de validação. Este fluxo não substitui o PRD, os ADRs, o layout nem o handoff.

## Ordem das fontes

1. Pedido atual do responsável pelo projeto.
2. `docs/PRD.md`, para escopo e regras de negócio.
3. `docs/adr/`, para decisões técnicas aprovadas.
4. `layout.md`, para comportamento visual e experiência.
5. `rules/`, para o modo de execução do trabalho.

Se duas fontes entrarem em conflito, não escolher silenciosamente. Registrar o conflito no handoff e pedir decisão antes de aplicar uma mudança irreversível ou de negócio.

## Fluxo obrigatório

### 1. Entender

- Registrar no handoff a pergunta original e o resultado esperado.
- Separar requisito explícito, hipótese e informação ausente.
- Confirmar o papel afetado: Colaborador, Operações ou ambos.

### 2. Delimitar

- Declarar o que entra e o que fica fora do escopo.
- Identificar impactos em dados, segurança, API, interface e operação.
- Não transformar dúvida em decisão de produto ou arquitetura.

### 3. Especificar

- Escrever critérios em termos observáveis: o que precisa ser verdade.
- Evitar usar nomes de bibliotecas, arquivos ou comandos como critério de aceitação.
- Cobrir caminho principal, estados vazios, erros e restrições relevantes.
- Manter cada critério rastreável a uma necessidade do pedido ou da documentação oficial do projeto.

### 4. Planejar

- Relacionar cada critério às áreas que precisam mudar.
- Identificar riscos, dependências e validações antes da implementação.
- Se surgir uma decisão permanente de arquitetura, interromper e solicitar autorização para criar ou alterar um ADR.

### 5. Implementar

- Alterar somente o necessário para satisfazer os critérios aprovados.
- Atualizar o handoff quando houver descoberta, hipótese nova, mudança de plano, risco ou bloqueio.
- Preservar alterações preexistentes e não relacionadas.

### 6. Validar

- Associar cada critério a uma evidência verificável.
- Executar build, testes e checagens proporcionais ao risco da mudança.
- Registrar comandos executados, resultados e limitações no handoff.

### 7. Encerrar

- Revisar `rules/CHECKS.md`.
- Marcar como concluído apenas o que foi implementado e validado.
- Registrar pendências e o próximo passo sem apresentá-los como entregues.

## Antes de declarar uma spec pronta

- Delegue ao subagente `verificador-spec` (`agents/verificador-spec.md`),
  passando o caminho da spec e o intervalo de commits de cada repositório
  envolvido. Para mudanças locais sem commits, informe a lista de arquivos ou
  "tudo que implementa esta spec", conforme a definição do verificador. Inicie com contexto limpo, sem herdar o histórico da conversa.
- A spec só é pronta com `Veredito: PRONTA`. Qualquer outro resultado
  volta para as tarefas — quem corrige é o agente principal, nunca o
  verificador. Após as correções, solicite nova verificação.
- Não há exceção para "só um teste quebrado": o principal diagnostica se a
  causa está no teste, no código ou no ambiente, sem enfraquecer o aceite.
- Identifique cada rodada, a spec, o escopo e a revisão dos dois pacotes.
  Preserve os relatórios separadamente. Resultado de uma revisão antiga não
  aprova mudanças novas. Confira a sincronização da definição nativa antes de usar.
- Confirme o ambiente restrito antes de delegar: a definição do agente não
  muda as permissões herdadas. Se faltarem isolamento ou uma evidência,
  registre a pendência; não declare a spec pronta. Ver procedimento em
  `docs/pratica/entrega-1-verificador.md`.
- Nesta instalação, use o plano B sem ferramentas por
  `node agents/rodar-verificador.mjs --pacote <pacote.json> --codex <codex.exe>`.
  O principal prepara fontes/hashes e checks atuais; o revisor recebe esses
  documentos numa sessão nova e não executa comandos. Não declarar uma spec
  pronta se o processo do gate retornar código diferente de zero, se faltar
  um CA ou se o pacote não corresponder ao estado que está sendo entregue.
  O gate não instala nada, não faz commit nem publica a aplicação.

## Spec, verificação e tarefa técnica

- **Spec:** descreve comportamento ou resultado esperado do produto.
- **Verificação de stack:** comprova que componentes técnicos funcionam juntos; não cria comportamento de produto.
- **Tarefa técnica:** descreve o trabalho necessário para alcançar um resultado aprovado.

Esses artefatos não devem ser misturados. Um critério declara o resultado; o plano técnico declara como alcançá-lo.

## Alterações governadas

- Mudança de requisito exige autorização para alterar o PRD.
- Mudança de decisão arquitetural exige autorização para criar ou alterar ADR.
- Mudança de layout deve permanecer coerente com `layout.md` ou ser confirmada antes da implementação.
