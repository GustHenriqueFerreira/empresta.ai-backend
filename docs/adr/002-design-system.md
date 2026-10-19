# ADR 002 — Design system

| Item | Escolha |
|---|---|
| Sistema de design | Nocturne (tema escuro, denso) com a marca EMPREST.AI no acento e na tipografia |
| Tokens de base | `--color-bg #161826` · `--color-surface #232532` · `--color-text #e9e9ed` · divider por `color-mix` |
| Acento | Teal `#2fb8ac`, rampa 100–900, usado como linha, brilho e contorno |
| Cores semânticas | 4 estados (disponível / emprestado / atraso / manutenção) com fg/bg/bd próprios |
| Texto secundário | Transparência sobre `--color-text` (45–72%), nunca um cinza novo |
| Tipografia | Raleway única (400/500/600/700), títulos em peso 600 |
| Espaçamento | Escala Nocturne `2.8 · 5.6 · 8.4 · 11.2 · 16.8 · 22.4px` |
| Raios | 4px (`sm`) · 8px (`md`) · 14px (`lg`) |
| Layout | Flex/grid com `gap` — nunca margens entre irmãos |
| Componentes | Classes do Nocturne: `.btn*`, `.tag`, `.card`, `.field/.input`, `.radio`, `.nav`, `.table`, `.dialog*` |
| Ícones | Phosphor Icons |
| Animações | Apenas `fadeUp` (cards .25s, modal .18s, toast .2s, saída do toast 2600ms) |
| Idioma e copy | Português do Brasil, datas `DD/MM/AAAA`, tom direto, sem exclamações e sem emoji |
| Especificação detalhada | `layout.md` (fonte de verdade de medidas, telas, navegação e interações) |

## Justificativas

- **Sistema Nocturne com marca EMPREST.AI:** base visual já desenhada, escura e densa, adequada a uma ferramenta operacional de uso interno (catálogo, tabela de empréstimos, KPIs); só o acento e a tipografia recebem a marca.
- **Tokens de base com três cores:** `bg`, `surface` e `text` cobrem toda a página, com bordas por `color-mix` sobre o texto; nenhuma superfície fora do sistema.
- **Acento como linha/brilho/contorno:** o teal `#2fb8ac` em rampa 100–900 dá contraste em cada uso — 500 para bordas/linhas/ícones, 300 para texto de parágrafo sobre fundo escuro, 900/700 para preenchimentos tintados — sem inundar áreas grandes com cor.
- **Cores semânticas por estado:** a situação do equipamento (disponível / emprestado / atraso / manutenção) é a informação crítica do app; cada estado tem texto, fundo e borda fixos, incluindo o banner de bloqueio por atraso.
- **Texto secundário por transparência:** hierarquia de 72% a 40% sobre `--color-text` impede a proliferação de cinzas fora do sistema.
- **Raleway única:** uma família só nos pesos 400/500/600/700 simplifica o carregamento e a escala tipográfica; kickers uppercase com `letter-spacing 0.08–0.09em`.
- **Escala de espaçamento e raios fixos:** densidade 0.70× do Nocturne e raios 4/8/14px mantêm o ritmo visual consistente entre as telas.
- **Layout por flex/grid com `gap`:** elimina o ajuste manual por margens, principal fonte de desalinhamento.
- **Classes do Nocturne:** reutilizar `.btn*`, `.card`, `.table`, `.dialog*` etc. evita construir componentes paralelos e mantém os estados de interação idênticos em todo o app — hover tintado do acento, pressed um passo além, foco `outline: 2px solid var(--color-accent); outline-offset: 2px`, desabilitado `opacity .45` + `cursor: not-allowed`.
- **Phosphor Icons:** pacote previsto pelo sistema, com traço compatível com o estilo de linha do acento.
- **Animação restrita a `fadeUp`:** interface quieta — nenhuma animação em números de KPI, tabela ou navegação.
- **Copy em PT-BR operacional:** público é o time de Operações; datas em `DD/MM/AAAA`, tom direto, sem exclamações e sem emoji.

## Alternativas descartadas

- **Tema claro:** descartado — a base visual é o Nocturne escuro e denso.
- **Preto e branco puros:** descartados — proibidos em qualquer uso; `#161826` e `#e9e9ed` no lugar.
- **Preenchimento sólido do acento em áreas grandes (botão primário cheio):** descartado — o botão primário é contorno de 1px sobre transparente; o acento é linha, brilho e contorno.
- **Cinzas novos para texto secundário:** descartados — texto secundário só por transparência sobre `--color-text`.
- **Margens entre elementos irmãos para espaçar:** descartadas — espaçamento só por `gap` em flex/grid.
- **Animações longas ou aplicadas a dados (KPI, tabela, navegação):** descartadas — só `fadeUp` em cards, modal e toast.
- **Outras famílias tipográficas ou fontes por tela:** descartadas — Raleway única nos pesos 400/500/600/700.

## Consequências

- **Fica mais fácil:** reproduzir qualquer tela nova com os mesmos tokens, classes e estados; manter contraste e hierarquia (regras de cor e transparências); crescer o app sem criar cores, fontes ou componentes fora do sistema.
- **Fica mais difícil:** introduzir cor, fonte, componente ou animação fora do Nocturne; usar o acento como preenchimento sólido; criar cinza próprio para texto secundário; espaçar irmãos por margem.
- **Não dá para fazer depois sem custo:** trocar o acento `#2fb8ac` (a rampa inteira deriva dele), a Raleway, o tema escuro como base ou as classes do Nocturne já aplicadas nas telas prontas (Login, Catálogo).

## O que este ADR NÃO decide

Este ADR registra a decisão de design system e **não substitui a especificação**: medidas por tela, larguras máximas de conteúdo, copy, dados de exemplo, navegação por papel e regras de interação continuam definidos em `layout.md` (fonte de verdade, seções 1–10), com os requisitos em `docs/PRD.md` e as specs por tarefa em `docs/specs/`. Organização fina de arquivos da folha de estilos dentro de `frontend/src/styles/` também não é decisão deste ADR.
