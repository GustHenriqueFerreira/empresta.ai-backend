-- SOMENTE LEITURA, execução pelo responsável no projeto confirmado.
-- Esta primeira consulta não pressupõe tabela de imagens nem lê auth.users.
begin transaction read only;
set local statement_timeout = '15s';
select current_database() as banco, current_user as papel_sql;
select table_schema, table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema in ('public', 'storage')
  and table_name in ('equipamentos', 'emprestimos', 'profiles',
                     'equipamentos_imagens', 'buckets', 'objects')
order by table_schema, table_name, ordinal_position;
select n.nspname as esquema, c.relname as tabela, c.relrowsecurity as rls
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in
('equipamentos', 'emprestimos', 'profiles', 'equipamentos_imagens');
select tablename, indexname, indexdef from pg_indexes
where schemaname = 'public' and tablename in ('equipamentos','equipamentos_imagens');
select schemaname, tablename, policyname, roles, cmd from pg_policies
where (schemaname = 'public' and tablename in
       ('equipamentos','emprestimos','profiles','equipamentos_imagens'))
   or (schemaname = 'storage' and tablename = 'objects');
rollback;

-- Executar esta segunda parte SOMENTE se a primeira confirmou as três tabelas
-- e colunas originais. Resultados não são consentimento para exclusão/adoção.
begin transaction read only;
set local statement_timeout = '15s';
select e.id, e.nome, e.categoria, e.patrimonio, e.situacao,
       count(p.id)::integer as emprestimos_totais,
       count(p.id) filter (where p.devolvido_em is null)::integer as emprestimos_abertos
from public.equipamentos e
left join public.emprestimos p on p.equipamento_id = e.id
group by e.id order by e.patrimonio, e.id;
select patrimonio, count(*) as quantidade
from public.equipamentos group by patrimonio having count(*) > 1;
select count(*) as emprestimos_totais,
       count(*) filter (where devolvido_em is null) as emprestimos_abertos
from public.emprestimos;
rollback;

-- Auth/professor, Storage e identidade do projeto: checklist no README.
-- Não exportar auth.users ou consultar encrypted_password, tokens e identities.
