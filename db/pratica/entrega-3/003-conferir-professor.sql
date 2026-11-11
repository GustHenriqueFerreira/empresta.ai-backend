-- SOMENTE LEITURA, execução humana no projeto confirmado.
-- Trocar só PREENCHER_EMAIL_DA_SPEC pelo e-mail profissional da spec 006.
-- Não inserir senha, JWT, chave ou connection string. Não cria/altera conta.
begin transaction read only;
set local statement_timeout = '15s';
set local pratica.professor_email = 'PREENCHER_EMAIL_DA_SPEC';

with entrada as (
  select current_setting('pratica.professor_email', true) as email
), usuarios as (
  select u.id, u.email_confirmed_at
  from auth.users u, entrada e
  where lower(u.email) = lower(e.email)
), perfis as (
  select p.nome, p.papel from public.profiles p
  join usuarios u on u.id = p.id
), historico as (
  select e.id, e.devolvido_em from public.emprestimos e
  join usuarios u on u.id = e.usuario_id
)
select
  (select email <> 'PREENCHER_EMAIL_DA_SPEC' and position('@' in email) > 1 from entrada) as parametro_preenchido,
  (select count(*) from usuarios)::integer as contas_encontradas,
  (select count(*) from usuarios where email_confirmed_at is not null)::integer as contas_confirmadas,
  (select count(*) from perfis)::integer as perfis_encontrados,
  (select count(*) from perfis where nome = 'Marcelo Grilo' and papel = 'colaborador')::integer as perfis_esperados,
  (select count(*) from historico)::integer as emprestimos_totais,
  (select count(*) from historico where devolvido_em is null)::integer as emprestimos_abertos;
rollback;

-- Esperado: parametro_preenchido=true, todas as quatro contagens de conta/perfil=1,
-- emprestimos_totais=0 e emprestimos_abertos=0. Isso NÃO prova login/senha.
-- Divergência: parar; não resetar senha/papel nem apagar histórico para passar.
