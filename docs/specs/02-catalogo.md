# 02 — Catálogo (primeira tela após o login)

Status: implementada

Shell interno do app + tela de Catálogo do `layout.md` §5.2: barra de navegação
por papel, grade de cards com a situação de cada equipamento, busca, filtros e
o fluxo de solicitação de empréstimo em modal — com dados de exemplo do §9
(sem backend; integração real fica para depois, sem trocar de stack).

## Escopo

Entra:

- Sessão mínima em memória no front: papel (`colaborador` / `operacoes`) e
  usuário de exemplo "Ana Ribeiro (AR)" do §9. O botão usado no login define o
  papel. "Sair" volta ao Login e limpa a sessão.
- Troca de tela por estado (sem router): `Catálogo` é a tela inicial dos dois
  papéis; abas ainda sem tela (`Meus empréstimos`, `Operações`,
  `Equipamentos`) mostram toast "Tela ainda não incluída nesta versão." e
  permanecem no Catálogo. Sem dependência nova (§6: "não há rotas aninhadas").
- Barra de navegação (§6): sticky 60px, marca 15px, abas por papel
  (Colaborador: Catálogo, Meus empréstimos · Operações: Catálogo, Operações,
  Equipamentos, Meus empréstimos), etiqueta de papel, avatar AR, nome, "Sair".
- Catálogo (§5.2): H1 "Catálogo" + contagem "X de Y equipamentos disponíveis
  agora"; busca de 260px (nome + patrimônio, case-insensitive, imediata);
  chips exclusivos Todos/Disponíveis/Emprestados/Em manutenção; grade
  `minmax(292px, 1fr)` com cards (kicker, nome 16.5px, patrimônio, pill de
  situação, detalhe, botão de largura total) com `fadeUp .25s`.
- Modal "Solicitar empréstimo" (§5.6/§7.1): 420px, resumo com Equipamento e
  "Devolver até = hoje + 14 dias" (calculado no momento da abertura, em
  DD/MM/AAAA); confirmar ⇒ item vira `emprestado` no seu nome + toast.
- Banner de bloqueio por atraso (§1/§7.5): implementado e dirigido por dados
  (aparece quando existe empréstimo do usuário em atraso); com os dados padrão
  do §9 a Ana está em dia, então não aparece por padrão.
- Limite de 3 itens e bloqueio por atraso aplicados nos botões do catálogo
  (§7.4/§7.5): "Limite de 3 itens" / "Bloqueado por atraso" desabilitados em
  `btn-secondary`.
- Dados mockados em `src/data/` conforme §9 (9 equipamentos, empréstimos em
  aberto), tipados; trocar por API/Prisma depois não muda a tela.

Fica fora:

- Telas Meus empréstimos (spec 03), Operações (spec 04) e Equipamentos
  (spec 05) — hoje só via toast de "ainda não incluída".
- Backend, autenticação Supabase, persistência e RLS — os dados vivem em
  memória e voltam ao estado do §9 ao recarregar.
- Ícones Phosphor (a tela não usa), animações além das definidas.

Desvio temporário de §6 a registrar: após "Entrar como Operações", a
destinação é o **Catálogo** com papel Operações (e não a tela Operações),
até que a spec 04 exista. Registrado aqui para não virar surpresa.

## Fontes aplicadas

- `layout.md` §1 (cores/pills/estados) · §2 (tipografia) · §3 (medidas de
  página, grade e card) · §4 (classes) · §5.2 (Catálogo) · §5.6 (modal/toast) ·
  §6 (navegação) · §7.1/4/5/8/9 (solicitar, limite, atraso, busca, filtros) ·
  §8 (fadeUp) · §9 (dados de exemplo).
- `rules/business-rules.md` 1–2 (limite 3, prazo 14), 4 (manutenção), 6–11.
- `rules/CHECKS.md` — CA-02, CA-03, CA-06, CA-08, CA-09.
- `docs/adr/001-stack.md` — sem dependência nova; mock em TypeScript.

## Copy

| Onde | Texto |
|---|---|
| Contagem do cabeçalho | `{X} de {Y} equipamentos disponíveis agora` |
| Busca (placeholder, 260px) | `Buscar por nome ou patrimônio` |
| Chips de filtro | `Todos` · `Disponíveis` · `Emprestados` · `Em manutenção` |
| Pills de situação | `Disponível` · `Emprestado` · `Em manutenção` |
| Detalhe do card (disponível) | `Pronto para retirada no balcão` |
| Detalhe do card (emprestado, com você) | `Com você · devolver até {data}` |
| Detalhe do card (emprestado, com outra pessoa) | `Com {pessoa} · devolver até {data}` |
| Detalhe do card (manutenção) | observação do cadastro (ex.: `Painel com falha, retorna em 05/09`) |
| Botões do card | `Solicitar` · `Está com você` · `Emprestado` · `Indisponível` · `Limite de 3 itens` · `Bloqueado por atraso` |
| Banner de bloqueio | `Você tem um item em atraso. Devolva-o para solicitar novos empréstimos.` + botão `Ver meus empréstimos` |
| Estado vazio de busca/filtro | `Nenhum equipamento encontrado para a busca ou o filtro atual.` |
| Modal — título | `Solicitar empréstimo` |
| Modal — corpo | `O item fica registrado no seu nome e conta para o limite de 3 empréstimos simultâneos.` |
| Modal — resumo | `Equipamento` → nome · `Devolver até` → `{hoje + 14 dias}` (destaque no acento) |
| Modal — ações | `Cancelar` (secundário) · `Solicitar` (primário) |
| Toast após confirmar | `Empréstimo registrado. Devolva até {data}.` |
| Aba ainda sem tela / "Ver meus empréstimos" | `Tela ainda não incluída nesta versão.` |
| Navegação | abas conforme papel · etiqueta `Colaborador` / `Operações` · nome `Ana Ribeiro` · `Sair` |

## Estados e interações

- Card por situação (cores da tabela §1): `Disponível` (pill teal, botão
  primário "Solicitar") · `Emprestado` (pill amarela, botão "Está com você" se
  `mine`, senão "Emprestado"; ambos desabilitados) · `Em manutenção` (pill
  cinza, botão "Indisponível" desabilitado) — manutenção nunca disponível.
- Com 3 empréstimos do usuário ativos: botões "Solicitar" viram
  `btn-secondary` "Limite de 3 itens", desabilitados (§7.4).
- Com empréstimo do usuário em atraso: mesmo tratamento com o rótulo
  "Bloqueado por atraso" + banner no topo (§7.5).
- Busca: filtra por nome e patrimônio, case-insensitive, a cada tecla;
  estado vazio próprio quando nada casa com busca ou filtro.
- Chips: exclusivos; ativo com borda e texto no acento e fundo
  `rgba(47,184,172,0.10)`.
- Modal: backdrop `rgba(10,11,18,0.68)`; clique fora fecha, clique dentro não
  fecha; `fadeUp .18s`; "Devolver até" calculado na abertura
  (hoje + 14 dias, DD/MM/AAAA).
- Toast: 2600ms, substitui o anterior (já existe no App).
- Solicitação confirmada: item sai de disponível, conta no limite, e o botão
  dele vira "Está com você"; contagem do cabeçalho reage.
- "Sair": volta ao Login com o formulário limpo (remonta a tela).
- Dados em memória: recarregar a página restaura o estado do §9.

## Critérios de aceitação

- **CA-02** (Catálogo com a situação de cada um): atendido nesta tarefa (UI).
- **CA-03** (Solicitar empréstimo): parcial — fluxo completo na UI com estado
  em memória; fecha com backend/sessão real.
- **CA-06** (Máximo de 3 itens): parcial — bloqueio aplicado no catálogo;
  fechamento completo junto com Meus empréstimos + backend.
- **CA-08** (Atraso bloqueia): parcial — banner + bloqueio de botões
  implementados e dirigidos por dados; cenário completo com backend.
- **CA-09** (Manutenção nunca disponível): atendido nesta tarefa (UI).

## Verificação

```bash
cd frontend
npm run build      # tsc --noEmit && vite build
npm run dev        # http://localhost:5173
```

- Inspecionar: navegação por papel (dois caminhos de login), abas/etiqueta/
  avatar/Sair; contagem, busca, chips; cards com as três pills; limites e
  bloqueios nos botões; modal com prazo calculado; toasts (2600ms);
  "Sair" devolve ao Login.
- Banner: com os dados do §9 não aparece; para verificar, acrescentar
  temporariamente um empréstimo em atraso da Ana em `src/data/`.
- `git status --short` só com arquivos do escopo. `npm test` do front entra
  quando Jest for configurado (pendência já registrada no AGENTS.md §8).
