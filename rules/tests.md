# Regras de testes

> Leitor: agente e pessoa desenvolvedora.

## Objetivo

Usar testes como evidência de que o comportamento esperado permanece válido, com atenção especial às jornadas de Colaborador e Operações e às regras registradas no PRD.

## Stack e estado atual

O ADR define Jest para testes. No estado atual do repositório, os pacotes ainda não possuem configuração, script ou suíte Jest. Não afirmar que os testes automatizados passaram enquanto essa configuração não existir e não tiver sido executada.

## Quando criar ou atualizar testes

- Ao implementar ou corrigir regra de negócio.
- Ao alterar contrato de API, persistência, autorização ou validação.
- Ao corrigir defeito que possa reaparecer.
- Ao mudar comportamento observável da interface.
- Ao alterar uma migration com impacto sobre dados usados pela aplicação.

Mudanças exclusivamente documentais podem ser validadas por revisão de conteúdo, links e coerência, sem exigir um teste automatizado artificial.

## Regras de escrita

- Testar comportamento e resultado, não detalhes internos sem relevância para o requisito.
- Dar ao teste um nome que expresse cenário, ação e resultado esperado.
- Manter cada teste independente, determinístico e repetível.
- Preparar apenas os dados necessários para o cenário.
- Cobrir caminho principal, restrições, erros e limites relevantes.
- Para correção de defeito, incluir um teste que falharia antes da correção sempre que isso for viável.
- Não enfraquecer uma asserção apenas para fazer a suíte passar.

## Escopo de validação

Escolher o menor nível que comprove o risco da mudança:

- **Unidade:** regras e transformações isoladas.
- **Integração:** colaboração entre aplicação, banco e serviços internos.
- **Contrato/API:** entrada, saída, status e autorização dos endpoints REST.
- **Jornada:** fluxo observável pelo Colaborador ou por Operações.

Uma mudança pode exigir mais de um nível. A quantidade de testes deve ser proporcional ao impacto, não ao tamanho do diff.

## Dados e ambientes

- Não executar testes contra produção.
- Não depender de ordem de execução ou de dados deixados por outro teste.
- Não usar credenciais reais, dados pessoais reais ou segredos em fixtures, snapshots ou logs.
- Isolar e limpar os dados criados pelo teste.
- Respeitar `rules/SECRETS.md` para qualquer configuração de ambiente.

## Validação antes de concluir

1. Executar os testes relevantes disponíveis.
2. Executar build e checagens de tipo das áreas alteradas quando aplicável.
3. Registrar no handoff os comandos, resultados e testes não executados.
4. Se a infraestrutura de teste estiver ausente ou quebrada, declarar a limitação; não substituir automaticamente a evidência por “funciona localmente”.
5. Revisar se cada critério de aceitação possui evidência suficiente.

## Não fazer

- Não excluir ou ignorar teste falhando sem explicar e corrigir a causa.
- Não conectar a suíte a serviços remotos reais sem necessidade, isolamento e autorização.
- Não usar snapshots amplos como única prova de regra de negócio.
- Não considerar build bem-sucedido equivalente a testes de comportamento.
- Não declarar cobertura que não foi medida.
