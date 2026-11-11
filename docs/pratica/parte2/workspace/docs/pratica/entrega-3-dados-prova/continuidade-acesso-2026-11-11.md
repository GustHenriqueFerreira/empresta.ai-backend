# Continuidade — testes públicos e espera de login

Pedido do responsável: pode deixar fotos aleatórias, testar Supabase e fazer o
restante da Entrega 3. Posteriormente perguntou sobre acesso e o que precisamos
saber. Não houve fornecimento/solicitação de senha ou chave administrativa.

## Leituras executadas pelo principal

- Supabase /auth/v1/health: HTTP 200 com publishable key já fornecida no projeto.
- Backend /api/health: HTTP 200; código retorna constante, sem consultar banco.
- Frontend: HTTP 200 HTML. Não prova login nem todos os recursos da página.
- REST equipamentos, sem login, select=id e limit=0: HTTP 200, lista vazia.
- REST equipamentos, sem login, select=id e limit=1: HTTP 200, zero IDs visíveis.
  A leitura anônima não expôs registros, mas não revela inventário autenticado.
- Backend /api/equipamentos sem token: HTTP 401, exige autenticação.

Primeira execução de rede restrita falhou DNS para todos os destinos; repetição
com autorização de rede fora do sandbox funcionou. Não confundir limitação local
com projeto pausado. Nenhuma escrita de banco/Auth/Storage/deploy foi executada.

## Painel

Chrome tinha janela do projeto aberta, mas Computer Use interrompeu a leitura:
não determinou URL com confiança para aplicar política. Não houve interação.
Tentativa encerrada com completion_summary. Não usar cookies/credenciais/depuração
de navegador para contornar o bloqueio.

Depois, aberto o painel esperado no navegador integrado, aba 2:
https://supabase.com/dashboard/project/mvoswngmnsfxcecucrys
O site redirecionou para /dashboard/sign-in?returnTo=%2Fproject%2Fmvoswngmnsfxcecucrys.
Aba marcada como handoff; responsável deve entrar por conta própria e avisar.
Sessão do Chrome não foi transferida e a autenticação não foi automatizada.
Handoff CUA ainda não encerrado: aguarda login e observação do resultado final.

Depois do login: apenas inventário/consultas de leitura. Publicação de dados e
Storage continua sendo ação humana exigida pela prática, não permissão implícita
concedida por um login do painel. Não mudar permissões de acesso ou usar professor
para solicitações.

## Candidatas provisórias

Novo lote local skills/imagens-equipamentos/.cache/lotes/provisorio-e3-20261111:
12 candidatas de buscas Pixabay ainda válidas, sem novas buscas/chave. Preparadas
com a skill/sharp em 800×600, com origem/autor/hashes e revisão começando nula.
Helper aditivo agents/preparar-candidatas-e3.ts; nenhuma dependência instalada.
Preview previa.png e PROVISORIO.json não constituem manifesto aprovado.

Prévia mostra incompatibilidades claras: TI-0001 mostra xícara, TI-0004 pessoas,
TI-0011 notebook em vez de webcam e TI-0012 pessoa com câmera. Há também textos/
marcas em outras fotos. Pedido de escolha aleatória não é revisão visual humana
específica nem permite afirmar que as restrições do enunciado foram atendidas.
Não publicar estas candidatas como se estivessem aprovadas; manter as evidências
anteriores de recusas. Aprovações humanas: zero. Manifesto aprovado real: ausente.

## Diagnóstico adicional do professor

Novo 003-conferir-professor.sql, somente leitura, para execução humana no destino
confirmado: consulta só contagens e conformidade do usuário escolhido; não lê
senhas/tokens nem exporta auth.users. Conta histórico total e aberto separadamente.
Não cria conta, promove papel, confirma e-mail, redefine senha ou apaga empréstimo.

Teste DI-CA-04/07 com fixture isolada verifica conta ausente, perfil correto,
papel divergente e histórico devolvido preservado. Ainda não prova login real.
Nova execução: 14/14 testes Jest, zero falhas/pendentes; tsc da pasta nova passou.
Relatório bruto: backend/db/pratica/entrega-3/.cache/jest-diagnostico-professor.json.
Typecheck isolado do helper de candidatas também passou. Checks/revisões das
rodadas anteriores são históricos; não atribuir a eles este arquivo posterior.

Próximo passo: responsável entrar no painel integrado e avisar. Nenhum dado real
de inventário, conta do professor, bucket ou empréstimos autenticados conhecido
nesta etapa. Entrega 3 continua NÃO concluída; não há aceite novo do gate.
