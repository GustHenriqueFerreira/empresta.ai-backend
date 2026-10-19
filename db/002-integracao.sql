-- Complemento da spec 04; SQL versionado, sem adotar ferramenta de migrations.
-- Não remove dados. Executar na mesma transação que o baseline em banco novo.
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

  -- Serializa solicitações da mesma pessoa, inclusive em equipamentos distintos.
  perform 1 from public.profiles where id = v_usuario for update;

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
-- PUBLIC recebe EXECUTE por padrão; explicitar acesso apenas autenticado.
revoke all on function public.solicitar_emprestimo(uuid) from public, anon;
revoke all on function public.devolver_emprestimo(uuid) from public, anon;
grant execute on function public.solicitar_emprestimo(uuid) to authenticated;
grant execute on function public.devolver_emprestimo(uuid) to authenticated;

-- Perfis de contas já existentes, sem inventar usuários ou promover papéis.
insert into public.profiles (id, nome)
select id, coalesce(nullif(btrim(raw_user_meta_data ->> 'nome'), ''), nullif(split_part(email, '@', 1), ''), 'Usuário')
from auth.users
on conflict (id) do nothing;