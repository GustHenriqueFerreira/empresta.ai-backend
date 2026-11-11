-- MATERIAL PARA REVISÃO/APLICAÇÃO HUMANA. Não é migration automática.
-- Uma aplicação. Repetir apenas 002-dados.sql, não esta alteração estrutural.
-- Se tabela/índice já existem, parar e comparar, sem reaproveitar definição incerta.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

create unique index uq_pratica_patrimonio
on public.equipamentos(patrimonio)
where patrimonio in ('TI-0001','TI-0002','TI-0003','TI-0004','TI-0005','TI-0006',
                     'TI-0007','TI-0008','TI-0009','TI-0010','TI-0011','TI-0012');

create table public.equipamentos_imagens (
  equipamento_id uuid primary key references public.equipamentos(id),
  bucket text not null check (bucket = 'equipamentos-pratica'),
  caminho text not null unique,
  largura integer not null check (largura = 800),
  altura integer not null check (altura = 600),
  sha256 text not null unique check (sha256 ~ '^[a-f0-9]{64}$'),
  fornecedor text not null check (fornecedor = 'pixabay'),
  foto_id bigint not null unique check (foto_id > 0),
  pagina_origem text not null check (pagina_origem like 'https://pixabay.com/%'),
  autor text not null check (btrim(autor) <> '' and length(autor) <= 256),
  autor_id bigint not null check (autor_id > 0),
  licenca_url text not null check (licenca_url = 'https://pixabay.com/service/license-summary/'),
  origem_arquivo text not null,
  obtida_em timestamptz not null,
  check (caminho ~ '^pratica-2026/TI-00(0[1-9]|1[0-2])/[a-f0-9]{64}\.png$'),
  check (right(caminho, 68) = sha256 || '.png')
);

alter table public.equipamentos_imagens enable row level security;
revoke all on public.equipamentos_imagens from public, anon, authenticated;
grant select on public.equipamentos_imagens to authenticated;
create policy "imagens: leitura por autenticados"
on public.equipamentos_imagens for select to authenticated using (true);
-- Sem grants/policies de escrita para clientes; humano aplica como administrador.
commit;
