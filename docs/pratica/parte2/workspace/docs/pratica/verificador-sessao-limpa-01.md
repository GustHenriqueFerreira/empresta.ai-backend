# Prova inicial de sessão limpa — 06/11/2026

## Objetivo

Pedido do responsável: abrir sessão nova e conferir o comportamento do
verificador conforme a aula 11. Não plantar erro nem modificar código nesta etapa.

## Tentativa de descoberta nativa

Sessão independente: `01a1b075-722b-7fc1-bf91-be7779518f26`.
Codex confirmou filesystem somente leitura, approval never e rede restrita.
A sessão relatou que não tinha opção para selecionar `verificador-spec` como
agente nativo. A tentativa de ler a definição pelo shell foi rejeitada pela
política de execução. Nenhuma permissão foi ampliada para contornar o bloqueio.
Não houve delegação nativa nem relatório da spec 004. A disponibilidade nativa
continua NÃO COMPROVADA; sintaxe TOML válida não equivale a ativação comprovada.

## Plano B previsto na aula

Sessão independente: `01a1b076-9abd-7621-a52d-3581a917ac02`.
O principal forneceu o texto de `agents/verificador-spec.md` por entrada,
começando por “Aja conforme agents/verificador-spec.md.”. Nenhuma conversa
anterior foi fornecida. Shell, apps, plugins, web e pedido de permissões
foram desabilitados; a sessão continuou com sandbox read-only e approval never.
Não houve leitura de credenciais nem acesso a produção.

Teste: nenhuma spec nem escopo foram informados. A definição exige pedir
essas duas entradas e parar, em vez de inventar uma revisão.

Resposta literal:

> Informe o caminho da spec e o escopo da verificação (intervalo de commits por repositório, lista de arquivos ou “tudo que implementa esta spec”).

Resultado: PASSOU o teste de entradas obrigatórias no plano B. Nenhuma
afirmação de revisão de implementação, execução de testes ou PRONTA foi feita.

## Limites e próximos testes

Isso prova apenas a sessão limpa e o comportamento com entradas faltantes.
Não comprova ainda o gatilho automático, a revisão CA a CA, a descoberta nativa,
o erro plantado/restaurado ou a resistência ao pedido de corrigir testes.
O plano B sem ferramentas recebe evidências pelo principal e não executa
checks; se faltar prova, precisa registrar a limitação. Entrega 1 não encerrada.
