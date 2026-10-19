# 01 — Tela de Login

Status: implementada (spec retroativa — tela construída antes da regra `AGENTS.md` §2.1; sujeita à sua revisão)

> Atualizada em 28/09/2026 pela spec `02-catalogo.md`: "Entrar" e
> "Entrar como Operações" passam a navegar para o app interno (não mostram
> mais os toasts de "telas internas ainda não incluídas nesta versão").

Tela inicial do app: entrada por e-mail/senha e entrada direta como Operações.
Esta spec registra o que foi construído em `frontend/src/features/login/` e fixa
as decisões que `layout.md` não definia (copy, validação, mensagens, toasts).

## Escopo

Entra:

- Tela de login completa em duas colunas, conforme `layout.md` §5.1.
- Validação client-side de e-mail/senha com mensagem de erro inline.
- Ações "Entrar" e "Entrar como Operações" navegam para o app interno com o papel definido (Colaborador → Catálogo; Operações → Catálogo com papel Operações, desvio temporário registrado em `02-catalogo.md`).
- Toast padrão do app (fixo no rodapé, saída em 2600ms) — `layout.md` §5.6/§8.
- Comportamento responsivo simples: colunas empilham abaixo de 960px.

Fica fora:

- Autenticação real (Supabase, sessão e RLS) — entra com a integração de sessão.
- Telas internas (Catálogo, Meus empréstimos, Operações, Equipamentos) — specs 02 e seguintes.
- Recuperação de senha, "lembrar de mim" e cadastro de usuário (não estão no PRD v1).

## Fontes aplicadas

- `layout.md` §1 (tokens e cores) · §2 (tipografia) · §3 (espaçamentos) · §4 (componentes) · §5.1 (login) · §5.6 (toast) · §8 (animações).
- `docs/PRD.md` item 1 (Login; cada pessoa vê os próprios empréstimos) — regra comunicada na nota da tela.
- `docs/adr/001-stack.md` — React + Vite + TypeScript.
- `rules/design-system.md` (valores fixados) · `rules/CHECKS.md` (CA-xx).

## Copy

Textos fixados nesta spec (o `layout.md` não os define):

| Onde | Texto |
|---|---|
| Título da aba | `EMPREST.AI — Entrar` |
| H1 da esquerda (44px, duas linhas) | `Empréstimos de TI` / `sem planilha` |
| Lead da esquerda (16px, 60%) | Catálogo com a situação de cada equipamento, solicitação de empréstimo e devolução no balcão, em um único lugar. |
| Estatística 1 | `3 itens` · por pessoa, ao mesmo tempo |
| Estatística 2 | `14 dias` · de prazo padrão de devolução |
| Estatística 3 | `0 linhas` · para preencher no dia a dia |
| Rodapé da esquerda (12px, 40%) | `Operações · TI interno` |
| H2 da direita (26px) | `Entrar` |
| Lead da direita (14px, 55%) | Use o e-mail do TI para entrar no catálogo e acompanhar os seus empréstimos. |
| Rótulos dos campos | `E-mail` · `Senha` |
| Placeholders | `nome@empresa.com` · `Sua senha` |
| Botão primário (40px, block) | `Entrar` |
| Botão ghost (40px, block) | `Entrar como Operações →` |
| Nota (12.5px, 45%) | Cada pessoa vê apenas os próprios empréstimos. |
| Erro 1 | `Informe e-mail e senha para entrar.` |
| Erro 2 | `Informe um e-mail válido.` |
| Destino de "Entrar" / "Entrar como Operações" | Catálogo, com o papel (Colaborador / Operações) definido pela ação — sem toast de confirmação. |

## Estados e interações

- Padrão: campos vazios, ambos os botões habilitados.
- "Entrar" com campos vazios: erro inline em `#e88b8b` (12.5px) e borda de erro `rgba(200,90,90,.40)` no campo vazio, via `aria-invalid`; mensagem "Informe e-mail e senha para entrar."
- "Entrar" com e-mail em formato inválido: mensagem "Informe um e-mail válido." (sem borda de erro, pois os campos estão preenchidos).
- O erro só sai no próximo envio válido ou ao clicar "Entrar como Operações"; não sai enquanto a pessoa digita.
- "Entrar" com dados válidos: abre o app interno com papel Colaborador. A autenticação real fica para a etapa de sessão.
- "Entrar como Operações": não valida campos; abre o app interno com papel Operações.
- Toast: fixo em `bottom: 28px`, fundo `--accent-900`, borda `--accent-700`, texto `--accent-200`, `toastIn .2s`, saída automática em 2600ms; novo toast substitui o anterior.
- Hover/pressed: primário tintado `rgba(47,184,172,.12)` / `.22`; ghost `.10` / `.22`; input com borda `rgba(233,233,237,.28)` no hover.
- Foco: `outline: 2px solid var(--color-accent); outline-offset: 2px`.
- Estrutura: grade `1.05fr 0.95fr`, `min-height: 820px`; padding `64px 56px` nas colunas; esquerda com `linear-gradient(160deg,#1b1f2e,#161826 60%)` e brilho radial `rgba(47,184,172,.16)` de 520px em `left:-160px; top:120px`; marca 26px no login (`.brand-lg`); estatísticas com `border-top` e `padding-top: 22.4px`; coluna do formulário com 340px.
- Abaixo de 960px: colunas empilham, padding `48px 32px` (decisão além do §5.1, para telas estreitas).

## Critérios de aceitação

- CA-01 (Login; cada pessoa vê os próprios empréstimos): **parcial** — a tela entrega a entrada visual e comunica a regra na nota; o critério só fecha com autenticação real (Supabase) e o escopo por pessoa nas telas de dados.
- CA-02 a CA-09: não tocados nesta tarefa.

## Verificação

```bash
cd frontend
npm run build      # tsc --noEmit && vite build
npm run dev        # http://localhost:5173
```

Pontos de inspeção:

- Grade, brilho radial e coluna de 340px conforme §5.1; botões de 40px.
- Raleway carregada; tokens do §1 aplicados (sem preto ou branco puros).
- Foco visível com outline no acento; hover/pressed dos botões.
- Erro de validação nos dois casos; navegação nos dois caminhos (destino Catálogo).
