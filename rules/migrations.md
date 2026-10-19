# Regras de migrations

> Leitor: agente e pessoa desenvolvedora.

## Quando aplicar

Estas regras se aplicam a qualquer mudança que altere estrutura, restrições, índices ou dados necessários ao funcionamento do banco PostgreSQL do projeto.

## Fontes de verdade

- `docs/adr/001-stack.md` define PostgreSQL no Supabase e Prisma como parte da stack.
- `backend/prisma/schema.prisma` representará o modelo esperado pela aplicação (localização prevista; o backend ainda não foi scaffoldado).
- `backend/prisma/migrations/` registrará as alterações versionadas do banco (localização prevista).
- `docs/PRD.md` é a fonte das regras de negócio; uma migration não pode criar regra nova por conta própria.

## Procedimento obrigatório

1. Ler o handoff atual e identificar o requisito que exige a mudança.
2. Comparar o estado atual do schema com o estado desejado.
3. Classificar a mudança como aditiva, compatível ou destrutiva.
4. Verificar impacto sobre dados existentes, chaves, relacionamentos, índices e políticas de acesso.
5. Criar uma nova migration versionada. Não reescrever uma migration que já possa ter sido aplicada em outro ambiente.
6. Revisar o SQL gerado antes de qualquer aplicação.
7. Manter schema e histórico de migrations coerentes entre si.
8. Registrar no handoff a mudança, os riscos, a forma de validação e qualquer ação manual pendente.

## Mudanças destrutivas

São destrutivas, entre outras, as mudanças que removem ou renomeiam tabelas, colunas, constraints ou valores; tornam um campo mais restritivo; ou transformam dados existentes.

Antes de executar uma mudança destrutiva:

- comprovar que ela é necessária para um requisito aprovado;
- inspecionar os dados que podem ser afetados;
- definir como preservar, converter ou recuperar esses dados;
- obter autorização explícita quando houver risco de perda ou indisponibilidade;
- evitar execução direta em ambiente remoto sem revisão.

## Validação mínima

- O banco pode ser criado do zero usando apenas o histórico versionado.
- Um banco no estado anterior pode avançar sem divergência de schema.
- O schema final corresponde ao que a aplicação espera.
- A geração do cliente, o build e os testes relevantes continuam válidos.
- Nenhum segredo ou valor real de ambiente foi registrado na migration, em logs ou na documentação.

## Não fazer

- Não alterar o banco manualmente e deixar o schema ou o histórico para trás.
- Não apagar dados para fazer uma migration passar sem autorização explícita.
- Não usar o banco de produção como ambiente de teste.
- Não incluir credenciais, URLs privadas ou dados pessoais em migrations.
- Não declarar sucesso sem registrar a evidência de aplicação ou validação.

## Não decidido ainda

O ADR não decidiu a estratégia de migration. Permanecem em aberto o comando oficial, a promoção entre ambientes, o mecanismo de rollback e a responsabilidade pela execução em produção. Este documento estabelece guardrails, mas não decide esses pontos.
