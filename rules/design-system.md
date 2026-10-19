# rules/design-system.md — Nocturne + EMPREST.AI

Fonte completa: `layout.md`. Este arquivo fixa os valores; dúvida de medida ⇒
abrir o `layout.md` na seção citada.

## Cores

- Base: `--color-bg #161826` · `--color-surface #232532` · `--color-text
  #e9e9ed` · divider `color-mix(in srgb, #e9e9ed 16%, transparent)` ·
  `--color-neutral-900 #292b31` (avatares neutros).
- Acento teal **`#2fb8ac`**, rampa 100→900: `#e6faf7 · #c2f1eb · #93e3da ·
  #5fcfc4 · #2fb8ac · #26978e · #1d746d · #15534e · #0f3733`. Uso: 500 para
  linhas/ícones/números de destaque; 300 para texto sobre escuro; 900 como
  preenchimento tintado com borda 700.
- Tints do acento: `rgba(47,184,172,0.10)` chip de filtro ativo · `0.12` hover
  do primário e pill "Disponível" · `0.22` pressed.
- Estados (fg / bg / bd): Disponível/Em dia `#5fcfc4` / `rgba(47,184,172,.12)` /
  `rgba(47,184,172,.40)` · Emprestado/a vencer `#c9a25f` / `rgba(201,162,95,.12)`
  / `rgba(201,162,95,.38)` · Atraso/erro `#e88b8b` / `rgba(200,90,90,.14)` /
  `rgba(200,90,90,.40)` · Manutenção/inativo `#9aa0ad` / `rgba(154,160,173,.10)`
  / `rgba(154,160,173,.30)`. Banner de bloqueio: bd `#7a3b3b`, bg
  `rgba(122,59,59,.14)`, texto `#e88b8b`.
- Texto secundário só por transparência sobre `--color-text`: 72% apoio · 70%
  labels de form · 62% diálogo · 55% subtítulos/metadata · 45% kickers/dicas ·
  40% rodapés.

## Tipografia

Raleway (Google Fonts) 400/500/600/700; títulos peso 600, `line-height` ≈ 1.12,
`letter-spacing: -0.015em`; corpo 400, 1.55; `text-wrap: pretty` em títulos
longos. Escala (ver `layout.md` §2): H1 login 44px · H1 interno 30px · KPI 30px ·
H2 26px · modal 20px · painel 17px · card 16.5px · item de lista 16px · corpo
13.5–14px · nota/chip 12–13px · kicker 11–11.5px uppercase com
`letter-spacing: 0.08–0.09em`. Marca: `EMPREST` 700 + `.AI` no acento.

## Espaço, raio e elevação

Escala do Nocturne: `2.8 · 5.6 · 8.4 · 11.2 · 16.8 · 22.4px`; raios 4/8/14px;
sombras apenas `--shadow-sm/md/lg`. Layout flex/grid com `gap` (nunca margens
entre irmãos). Controles: input/select/botão 36px · botão do login 40px ·
avatar 28px · pill `border-radius: 999px` · modal 420px (padding 26px) · nav
60px sticky com abas de altura total (aba ativa: borda inferior 2px no acento).

## Componentes e estados

Classes do Nocturne: `.btn` (+ `.btn-primary/.btn-secondary/.btn-ghost/
.btn-block`) · `.tag`+`.tag-outline` · `.card` (+ `.card-kicker/.card-title`) ·
`.field`+`label`+`.input` · `.radio`+`.dot` · `.nav`+`.nav-brand` · `.table` ·
`.dialog-backdrop`+`.dialog`. Hover tintado do acento; pressed um passo além;
foco `outline: 2px solid var(--color-accent); outline-offset: 2px`;
desabilitado `opacity .45` + `cursor: not-allowed`. Ícones: Phosphor Icons.
Réguas de seção com gradiente que desaparece nas pontas (ver `layout.md` §4).

## Animações e copy

Apenas `fadeUp`: cards .25s · modal .18s · toast .2s com saída após 2600ms ·
backdrop sem animação. Nada de animação em KPIs, tabela ou navegação. Copy em
PT-BR, direta e operacional, sem exclamações e sem emoji; datas `DD/MM/AAAA`.
