# AGENTS.md — Diretrizes para agentes de código (EMPREST.AI)

Instruções operacionais para qualquer agente de IA que trabalhar neste repositório.
Leia este arquivo inteiro antes de escrever código. Em caso de conflito entre este
arquivo e os documentos de referência, prevalece o documento de referência citado
na seção "Fontes da verdade"; entre duas regras operacionais, vale a mais
restritiva (resumo por tema em `rules/`, índice em `rules/README.md`).

> **Fluxo obrigatório (spec-first):** toda tarefa nova — tela, componente,
> endpoint, integração ou mudança relevante em algo que já existe — começa por
> uma spec em `docs/specs/`, revisada com o usuário **antes** de qualquer
> código. Nada entra em código sem spec; detalhe da regra na §2.1.

---

## 1. Visão geral

**EMPREST.AI** — aplicação de controle de empréstimo de equipamentos internos de TI
(notebooks, monitores, cabos, câmeras, acessórios), para substituir a planilha
compartilhada usada hoje pelo time de Operações.

- **Colaborador** vê o catálogo, pede um item emprestado e devolve.
- **Operações** cadastra equipamentos, vê quem está com o quê e registra devolução no balcão.

Escopo da v1: login, catálogo com situação, solicitar empréstimo, devolver,
tela de Operações com todos os empréstimos em aberto. Critério de sucesso do PRD:
Operações abandona a planilha após duas semanas de uso.

## 2. Fontes da verdade

Consulte o documento correspondente antes de implementar qualquer parte:

| Tema | Documento |
|---|---|
| Requisitos, regras de negócio e escopo da v1 | `docs/PRD.md` |
| Stack, ferramentas e decisões arquiteturais | `docs/adr/001-stack.md` |
| Decisão do design system (ADR) | `docs/adr/002-design-system.md` (detalhe normativo: `layout.md`) |
| Layout, design system, telas e interações | `layout.md` |
| Especificações de tarefa (escopo, copy, estados, critérios) | `docs/specs/` — índice e modelo em `docs/specs/README.md` |
| Variáveis de ambiente esperadas | `backend/.env.example`, `frontend/.env.example` |
| Regras operacionais por tema (índice completo) | `rules/` — índice em `rules/README.md` |

Nova decisão arquitetural ⇒ criar um novo ADR em `docs/adr/` antes de implementar
(seguindo o formato do `001-stack.md`), sempre com autorização explícita do usuário
(`rules/restrictions.md`). Não trocar ferramenta da stack sem ADR.

### 2.1 Spec antes de implementar (spec-first)

Toda tarefa nova — tela, componente, endpoint, integração ou mudança relevante em
algo que já existe — precisa de uma spec em `docs/specs/` revisada com o usuário
**antes** do código (uma spec por tarefa, no formato `NN-nome.md`). Algo construído
sem spec e que precise ser alterado recebe spec retroativa antes da alteração.

`layout.md`, `docs/PRD.md` e os ADRs continuam sendo as fontes de design, requisito
e stack; a spec da tarefa registra como a tarefa os aplica e fixa o que eles não
definem (copy, estados, mensagens, comportamento). Conteúdo mínimo: escopo (o que
entra / o que fica fora), copy em PT-BR, estados e interações, critérios mapeados
aos CA-xx de `rules/CHECKS.md` e verificação (comandos e pontos de inspeção).

A spec passa a ser fonte de verdade junto com os documentos acima: código em
desacordo com a spec está errado até que a spec seja atualizada primeiro.

## 3. Stack (ADR 001) — não substituir

- **Linguagem:** TypeScript no front e no back.
- **Frontend:** React com Vite.
- **Backend:** NestJS com API REST organizada em MVC.
- **ORM:** Prisma, com validação por Zod.
- **Banco:** PostgreSQL no Supabase.
- **Autenticação/Autorização:** Supabase, com RLS (Row Level Security) no banco.
- **Testes:** Jest.
- **Migrations:** **ainda não decidido** — não introduzir ferramenta de migration
  sem antes registrar a decisão em um ADR.

Proibido usar outra stack, outro banco, outro formato de API ou outra estrutura no
back sem novo ADR (ver "Consequências" do ADR 001).

## 4. Regras de negócio inegociáveis

Vieram do PRD e da seção 7 de `layout.md`. Todo endpoint, query, component e teste
deve respeitá-las:

1. Máximo de **3 itens** emprestados por pessoa ao mesmo tempo.
2. Prazo padrão de devolução: **14 dias** ("Devolver até = hoje + 14 dias").
3. Pessoa com item **em atraso** não pode pegar outro emprestado (banner de bloqueio).
4. Equipamento **em manutenção** nunca aparece como disponível.
5. Cada pessoa vê **somente os próprios empréstimos**; visão completa existe apenas
   em Operações.
6. Ações e efeitos esperados: solicitar → item vira `emprestado` com dono e prazo;
   devolver (pela própria pessoa ou pelo balcão em Operações) → item volta a
   `disponivel` e libera um slot; cadastro → item entra no topo do catálogo
   (nome obrigatório; patrimônio vazio cai para `TI-—`).

Fora do escopo da v1 — **não implementar nem sugerir**: reserva com data futura,
notificação por e-mail, importação da planilha atual.

## 5. Design system — regras críticas do `layout.md`

O front é escuro e denso (design system **Nocturne** com a marca EMPREST.AI).
Resumo das regras que mais vezes são violadas; para o detalhe completo,
**sempre abrir `layout.md`**:

- **Tokens de base:** `--color-bg #161826`, `--color-surface #232532`,
  `--color-text #e9e9ed`, divider por `color-mix`. Acento teal **`#2fb8ac`** com
  rampa 100–900 (uso: 500 para linhas/ícones, 300 para texto parágrafo, 900/700
  para preenchimentos tintados).
- **Cor:** nunca preto puro nem branco puro. O acento é usado como **linha, brilho e
  contorno** — botão primário é contorno de 1px, nunca preenchimento sólido em áreas
  grandes. Estados (disponível/a vencer/atraso/manutenção) têm fg/bg/bd definidos na
  tabela da seção 1 de `layout.md`. Texto secundário sempre por transparência sobre
  `--color-text` (45–72%), nunca um cinza novo.
- **Tipografia:** Raleway única (400/500/600/700), títulos peso 600; escala e
  tamanhos conforme tabela da seção 2. Kickers uppercase com `letter-spacing 0.08–0.09em`.
- **Espaçamento:** escala do Nocturne (`2.8 · 5.6 · 8.4 · 11.2 · 16.8 · 22.4px`);
  raios 4/8/14px; layout em flex/grid com `gap` — **nunca margens entre irmãos**.
- **Componentes:** usar as classes existentes do Nocturne (`.btn*`, `.tag`, `.card`,
  `.field/.input`, `.radio`, `.nav`, `.table`, `.dialog*`). Ícones: Phosphor Icons.
- **Estados de interação:** hover tintado do acento, pressed um passo além, foco
  `outline: 2px solid var(--color-accent); outline-offset: 2px`, desabilitado
  `opacity .45` + `cursor: not-allowed`.
- **Animações:** discretas e curtas; apenas `fadeUp` (cards .25s, modal .18s, toast .2s,
  saída do toast após 2600ms). Nenhuma animação em KPIs, tabela ou navegação.
- **Idioma e copy:** português do Brasil; datas em `DD/MM/AAAA`; tom direto e
  operacional — **sem exclamações e sem emoji**.
- **Telas (seção 5 de `layout.md`):** Login · Catálogo · Meus empréstimos ·
  Operações · Equipamentos (cadastro) · Modal e Toast. Medidas, larguras máximas e
  navegação por papel (Colaborador / Operações) estão especificadas — seguir fielmente.

## 6. Estrutura do monorepo

```
backend/     API NestJS (REST, MVC, Prisma + Zod, Jest)
frontend/    SPA React + Vite (TypeScript)
docs/        PRD e ADRs (docs/adr/)
layout.md    Especificação do design system e das telas
```

- Código de front nunca em `backend/` e vice-versa.
- Cada app (`backend/`, `frontend/`) tem seu próprio `package.json` e seu próprio
  `.env` — não compartilhar variáveis entre os dois.
- Documentação de produto/arquitetura vai em `docs/`; especificações visuais em
  `layout.md`.

## 7. Ambiente e segredos

- Para rodar qualquer app: copiar o `.env.example` local para `.env` e preencher.
- O `.env` real vive **apenas localmente** (criá-lo a partir do `.env.example` é o
  fluxo esperado); **nunca** commitar `.env` — o `.gitignore` já os ignora. Manter
  apenas os `.env.example` atualizados quando surgir variável nova.
- Chaves: `SUPABASE_SECRET_KEY` / `DIRECT_URL` ficam **somente** no backend; no
  frontend apenas a publishable key e as URLs (`VITE_*`).

## 8. Comandos (frontend validado; backend ainda sem scaffold)

Validar cada comando antes de confiar nele e atualizar esta seção conforme os
scripts reais surgirem nos `package.json`:

```bash
# Frontend (Vite + React) — dentro de frontend/  (validado)
npm install
npm run dev            # servidor de desenvolvimento em http://localhost:5173
npm run build          # tsc --noEmit && vite build
npm run preview        # serve o build de produção

# Backend (NestJS) — dentro de backend/  (provisório: app ainda não inicializado)
npm install
npm run start:dev      # servidor em desenvolvimento (respeita PORT do .env)
npm test               # Jest
```

Pendências de verificação: Jest ainda não configurado no `frontend/` (`npm test`
entra quando a configuração de testes for criada); o `npm test` do backend vale
após o scaffold do NestJS.


## 9. Fluxo de Git — REGRAS PARA O AGENTE

- O agente **NÃO executa** `git commit`, `git push`, `git merge` nem qualquer
  comando que altere o histórico ou o remoto.
- O usuário é responsável por **todos os commits e pushes**.
- O agente apenas cria/edita arquivos, deixa o working tree pronto para revisão e,
  quando fizer sentido, sugere a mensagem de commit em texto (sem executar).
- O agente **não** configura remotes nem credenciais de git.

## 10. Estado atual e pontos em aberto

- Repositório sem commits ainda, sem remote configurado. `frontend/` já
  inicializado (Vite + React + TS): tela de Login pronta conforme `layout.md`
  §5.1 e tela de Catálogo + navegação por papel prontas conforme `layout.md`
  §5.2/§6 e `docs/specs/02-catalogo.md` (dados de exemplo em memória, sem
  backend); design system em `frontend/src/styles/`, protótipo preservado em
  `frontend/prototype/`. `backend/` sem código (apenas `.env.example`; o `.env`
  local, quando existir, é criado a partir dele e ignorado pelo git).
  Testes (Jest) ainda não configurados no front.
- Em aberto na stack (decidir via ADR quando necessário): ferramenta de migrations;
  organização fina das pastas dentro de `backend/` e `frontend/`.
- Ao inicializar os apps (scaffold NestJS e Vite), registrar os comandos reais na
  seção 8 e manter este documento vivo.


