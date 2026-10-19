-- ============================================================================
-- EMPREST.AI — Schema inicial (Supabase / PostgreSQL)
-- backend/db/001-schema-inicial.sql
--
-- Fontes: docs/PRD.md (regras 1-4) · layout.md §5/§7/§9 · rules/business-rules.md
--         rules/stack.md (acesso por linha via RLS) · docs/adr/001-stack.md
--
-- - Nomes e valores de domínio em PT-BR, alinhados a frontend/src/data/mock.ts:
--   situacao em ('disponivel','emprestado','manutencao'); patrimônio vazio → 'TI-—'.
-- - Idempotente: pode ser reaplicado sem alterar o que já está correto.
-- - O script aplicar-schema.mjs envia o arquivo inteiro em uma única chamada,
--   que o PostgreSQL executa como uma transação única: se algo falha, nada fica
--   aplicado.
-- - A estratégia de migrations NÃO foi decidida (ADR 001). Quando houver ADR,
--   este arquivo deve ser consolidado como migration inicial sem mudar o schema.
-- - Papel de Operações é concedido manualmente após o primeiro cadastro de usuário:
--     update public.profiles set papel = 'operacoes' where id = '<uuid do usuário>';
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Tabelas
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id        uuid primary key references auth.users (id) on delete cascade,
  nome      text not null check (btrim(nome) <> ''),
  papel     text not null default 'colaborador' check (papel in ('colaborador', 'operacoes')),
  criado_em timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil do usuário do Supabase Auth. papel define a navegação e a visibilidade (business-rules.md §Visibilidade).';

create table if not exists public.equipamentos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null check (btrim(nome) <> ''),
  categoria   text not null check (categoria in ('Notebook', 'Monitor', 'Cabo', 'Câmera', 'Acessório')),
  patrimonio  text not null default 'TI-—' check (btrim(patrimonio) <> ''),
  situacao    text not null default 'disponivel' check (situacao in ('disponivel', 'emprestado', 'manutencao')),
  observacoes text,
  criado_em   timestamptz not null default now()
);

comment on table public.equipamentos is
  'Catálogo. criado_em ordena o topo do catálogo (cadastro entra primeiro). observacoes alimenta o detalhe do card em manutenção (layout §5.2).';

create index if not exists idx_equipamentos_criado_em
  on public.equipamentos (criado_em desc);

create table if not exists public.emprestimos (
  id             uuid primary key default gen_random_uuid(),
  equipamento_id uuid not null references public.equipamentos (id),
  usuario_id     uuid not null references public.profiles (id) on delete cascade,
  retirado_em    timestamptz not null default now(),
  devolver_ate   date not null,
  devolvido_em   timestamptz
);

comment on table public.emprestimos is
  'Empréstimo. devolvido_em nulo = em aberto; "Devolver até" = retirada + 14 dias (PRD, regra 2).';

-- Um equipamento tem no máximo um empréstimo em aberto.
create unique index if not exists uq_emprestimo_aberto_por_equipamento
  on public.emprestimos (equipamento_id) where devolvido_em is null;

-- Consultas por pessoa em aberto (Meus empréstimos, limite de 3, bloqueio por atraso).
create index if not exists idx_emprestimos_usuario_abertos
  on public.emprestimos (usuario_id) where devolvido_em is null;

-- ---------------------------------------------------------------------------
-- 2) RLS ativa em todas as tabelas; políticas na seção 4
-- ---------------------------------------------------------------------------

alter table public.profiles     enable row level security;
alter table public.equipamentos enable row level security;
alter table public.emprestimos  enable row level security;

-- ---------------------------------------------------------------------------
-- 3) Funções auxiliares
-- ---------------------------------------------------------------------------

-- Papel do usuário da sessão. SECURITY DEFINER: lê profiles sem depender de
-- RLS e evita recursão entre políticas.
create or replace function public.eh_operacoes()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.papel = 'operacoes'
  );
$$;

-- Cria o perfil no cadastro de usuário (Supabase Auth → hook padrão).
create or replace function public.criar_perfil_ao_cadastrar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'nome'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Coerência da situação: 'emprestado' existe apenas com empréstimo em aberto,
-- e item emprestado não muda de situação sem devolução registrada.
create or replace function public.validar_situacao_equipamento()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.situacao = 'emprestado' and not exists (
    select 1 from public.emprestimos e
    where e.equipamento_id = new.id and e.devolvido_em is null
  ) then
    raise exception 'Item só fica emprestado por uma solicitação de empréstimo.';
  end if;

  if old.situacao = 'emprestado' and new.situacao <> 'emprestado' and exists (
    select 1 from public.emprestimos e
    where e.equipamento_id = new.id and e.devolvido_em is null
  ) then
    raise exception 'Item está emprestado; registre a devolução antes de alterar a situação.';
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4) Políticas RLS
-- ---------------------------------------------------------------------------
-- profiles: cada pessoa lê o próprio perfil; Operações lê todos (nome de quem
-- está com o item na tabela de Operações). Sem INSERT/UPDATE/DELETE: perfil
-- nasce no trigger e o papel só muda por operação manual do administrador.

drop policy if exists "perfis: leitura do proprio perfil" on public.profiles;
create policy "perfis: leitura do proprio perfil"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "perfis: operacoes le todos os perfis" on public.profiles;
create policy "perfis: operacoes le todos os perfis"
  on public.profiles for select to authenticated
  using (public.eh_operacoes());

-- equipamentos: catálogo legível por qualquer autenticado; cadastro e edição
-- apenas por Operações. Sem DELETE (fora da v1).
drop policy if exists "equipamentos: leitura por autenticados" on public.equipamentos;
create policy "equipamentos: leitura por autenticados"
  on public.equipamentos for select to authenticated
  using (true);

drop policy if exists "equipamentos: cadastro apenas por operacoes" on public.equipamentos;
create policy "equipamentos: cadastro apenas por operacoes"
  on public.equipamentos for insert to authenticated
  with check (public.eh_operacoes());

drop policy if exists "equipamentos: edicao apenas por operacoes" on public.equipamentos;
create policy "equipamentos: edicao apenas por operacoes"
  on public.equipamentos for update to authenticated
  using (public.eh_operacoes())
  with check (public.eh_operacoes());

-- emprestimos: cada pessoa vê somente os próprios empréstimos; visão completa
-- apenas em Operações (PRD, item 5). Sem INSERT/UPDATE/DELETE diretos:
-- solicitação e devolução passam pelas funções da seção 6, que validam as
-- regras do PRD de forma atômica.
drop policy if exists "emprestimos: proprio ou operacoes" on public.emprestimos;
create policy "emprestimos: proprio ou operacoes"
  on public.emprestimos for select to authenticated
  using (usuario_id = auth.uid() or public.eh_operacoes());

-- ---------------------------------------------------------------------------
-- 5) Triggers
-- ---------------------------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.criar_perfil_ao_cadastrar();

drop trigger if exists trg_situacao_equipamento on public.equipamentos;
create trigger trg_situacao_equipamento
  before insert or update of situacao on public.equipamentos
  for each row execute function public.validar_situacao_equipamento();

-- ---------------------------------------------------------------------------
-- 6) Regras de negócio do PRD, aplicadas no banco
-- ---------------------------------------------------------------------------

-- Solicitar: aplica a regra 1 (máx. 3), a regra 2 (hoje + 14 dias) e a regra 3
-- (atraso bloqueia); recusa manutenção e item emprestado (CA-06 a CA-09).
-- Transação com trava "for update" no equipamento: solicitações concorrentes
-- do mesmo item não passam.
create or replace function public.solicitar_emprestimo(p_equipamento_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario       uuid := auth.uid();
  v_situacao      text;
  v_emprestimo_id uuid;
  v_hoje          date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if v_usuario is null then
    raise exception 'Sessão necessária para solicitar empréstimo.';
  end if;

  select situacao into v_situacao
    from public.equipamentos
    where id = p_equipamento_id
    for update;

  if not found then
    raise exception 'Equipamento não encontrado.';
  end if;

  if v_situacao = 'manutencao' then
    raise exception 'Equipamento em manutenção.';
  end if;

  if v_situacao = 'emprestado' then
    raise exception 'Equipamento indisponível.';
  end if;

  if exists (
    select 1 from public.emprestimos e
    where e.usuario_id = v_usuario
      and e.devolvido_em is null
      and e.devolver_ate < v_hoje
  ) then
    raise exception 'Você tem item em atraso. Devolva antes de pedir outro.';
  end if;

  if (
    select count(*) from public.emprestimos e
    where e.usuario_id = v_usuario and e.devolvido_em is null
  ) >= 3 then
    raise exception 'Você já está com 3 itens emprestados.';
  end if;

  insert into public.emprestimos (equipamento_id, usuario_id, retirado_em, devolver_ate)
  values (p_equipamento_id, v_usuario, now(), v_hoje + 14)
  returning id into v_emprestimo_id;

  update public.equipamentos
    set situacao = 'emprestado'
    where id = p_equipamento_id;

  return v_emprestimo_id;
end;
$$;

-- Devolver (pela própria pessoa ou pelo balcão em Operações): preenche
-- devolvido_em e devolve o item a 'disponivel', liberando um slot.
create or replace function public.devolver_emprestimo(p_emprestimo_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario     uuid := auth.uid();
  v_dono        uuid;
  v_equipamento uuid;
  v_devolvido   timestamptz;
begin
  if v_usuario is null then
    raise exception 'Sessão necessária para registrar devolução.';
  end if;

  select usuario_id, equipamento_id, devolvido_em
    into v_dono, v_equipamento, v_devolvido
    from public.emprestimos
    where id = p_emprestimo_id
    for update;

  if not found then
    raise exception 'Empréstimo não encontrado.';
  end if;

  if v_devolvido is not null then
    raise exception 'Empréstimo já devolvido.';
  end if;

  if v_dono <> v_usuario and not public.eh_operacoes() then
    raise exception 'Somente quem está com o item ou Operações pode registrar a devolução.';
  end if;

  update public.emprestimos
    set devolvido_em = now()
    where id = p_emprestimo_id;

  update public.equipamentos
    set situacao = 'disponivel'
    where id = v_equipamento;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7) Grants (RLS faz a filtragem; grants liberam o acesso de base)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

grant select on public.profiles to authenticated;
grant select, insert, update on public.equipamentos to authenticated;
grant select on public.emprestimos to authenticated;
grant all on public.profiles, public.equipamentos, public.emprestimos to service_role;

grant execute on function public.eh_operacoes() to authenticated;
grant execute on function public.solicitar_emprestimo(uuid) to authenticated;
grant execute on function public.devolver_emprestimo(uuid) to authenticated;


