# rules/business-rules.md — Regras de negócio (v1)

Fontes: `docs/PRD.md` ("Regras que Operações já decidiu") e `layout.md` §7.
Qualquer endpoint, query, componente ou teste deve respeitá-las.

## Limites e prazos

1. Máximo de **3 itens** por pessoa ao mesmo tempo (barra de 3 traços em "Meus
   empréstimos" mostra os slots ocupados).
2. Prazo padrão: **14 dias** — "Devolver até" = retirada + 14 dias, proposto no
   modal de solicitação.
3. Item **em atraso** na posse da pessoa ⇒ bloqueia novos empréstimos (banner
   de bloqueio).
4. Equipamento **em manutenção** nunca entra como disponível; a observação da
   manutenção aparece no detalhe do item.

## Visibilidade e papéis

5. Colaborador vê somente os próprios empréstimos; a visão completa (todos os
   empréstimos em aberto) existe apenas em Operações.
6. Papéis e abas: **Colaborador** (Catálogo, Meus empréstimos) · **Operações**
   (Catálogo, Operações, Equipamentos, Meus empréstimos).

## Fluxos e efeitos de dados

7. **Solicitar** (item disponível): modal com prazo; confirmar ⇒ item vira
   `emprestado` com o nome da pessoa e prazo; entra em "Meus empréstimos" e na
   tabela de Operações; toast de confirmação.
8. **Devolver** (Meus empréstimos) e **Registrar devolução** (Operações):
   confirmar ⇒ item volta a `disponivel`, libera um slot e sai da tabela de
   Operações; toast.
9. **Cadastrar equipamento** (Operações): nome obrigatório (sem nome ⇒ toast
   "Informe o nome do equipamento"); patrimônio vazio ⇒ `TI-—`; item entra no
   topo do catálogo; após cadastrar ⇒ volta a Operações + toast.
10. Buscas: catálogo filtra por nome + patrimônio; Operações por pessoa + item;
    case-insensitive, filtragem imediata, com estado vazio próprio.
11. Filtros de situação exclusivos: Todos / Disponíveis / Emprestados / Em
    manutenção.

## Fora da v1 (não implementar)

Reserva com data futura · notificação por e-mail · importação da planilha.
