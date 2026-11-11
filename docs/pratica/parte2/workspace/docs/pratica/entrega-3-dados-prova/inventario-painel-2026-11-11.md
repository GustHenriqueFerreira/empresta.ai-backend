# Conferência do painel — 11/11/2026

Executor: principal, somente navegação e leitura pela UI do navegador integrado.
Projeto observado: germinare3mil, referência mvoswngmnsfxcecucrys, organização
mandante, branch main/PRODUCTION, status Healthy. Login do responsável concluído
por ele; não lemos senha, sessão, cookies ou chaves. Este acesso ao painel não
autoriza o agente a escrever dados/Auth/Storage.

## Sinais efetivamente observados

Table Editor, schema public: listadas emprestimos, equipamentos e profiles.
Não apareceu equipamentos_imagens. A conferência não substitui levantamento
completo de constraints, políticas, colunas ou outros schemas.

Tabela equipamentos: rodapé 4 records, uma página, quatro linhas visíveis:

- Webcam Logitech (demo), categoria Câmera.
- Cabo HDMI 2 metros (demo), categoria Cabo.
- Monitor LG 24 polegadas (demo), categoria Monitor.
- Notebook Dell Inspiron (demo), categoria Notebook.

Não é o conjunto dos 12 nomes exigidos pela spec. Patrimônios, situação, contagens
de empréstimos, duplicatas e adoção ainda não foram inventariados. Não remover
ou converter demonstrações por inferência. D-08 agora tem conflito real de dados
existentes; precisa decisão antes de aplicar material que exige catálogo exato.

Storage → Files/Buckets: tela vazia com "Create a file bucket" e "New bucket".
Nenhum bucket listado; equipamentos-pratica e os uploads não estão demonstrados.
Não foi criado bucket nem alterada política.

Authentication → Users: aplicada busca exata do e-mail profissional da spec via
campo Email address/Return. URL refletiu filtro keywords; resultado visível
"No users found There are currently no users based on the filters applied".
Não foi encontrada a conta solicitada do professor. Rodapé de contagem estimada
não foi usado como prova, pois não corresponde de forma clara ao filtro.
Nenhum usuário foi criado/alterado e nenhum empréstimo foi feito.

## Pendências atuais

1. Resolver D-08 preservando os quatro equipamentos/histórico: não aplicar seed
   que os apague nem inserir silenciosamente mais 12 e alegar catálogo de 12.
2. Completar inventário (patrimônios, situação, histórico, duplicatas e políticas).
3. Fotos finais que cumpram o contrato, revisão e manifesto; provisórias atuais
   não equivalem a aprovação. Preparar pacote real quando entradas existirem.
4. Aplicação humana de estrutura/dados, criação/verificação do bucket e uploads.
5. Criação humana da conta do professor e prova de perfil/login/zero empréstimos.
6. Repetição humana sem duplicar, provas sanitizadas e verificador/gate final.

Nenhuma alteração no Supabase ocorreu nesta leitura. CUA encerrado com
completion_summary após constatar os resultados; o handoff de login anterior
está concluído. Não declarar Entrega 3 pronta; evidência local de 14 testes
continua separada do estado remoto observado.
