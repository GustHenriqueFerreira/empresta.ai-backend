# Roteiro de aplicação e recibos

Atualização: principal executou este material sob autorização específica em 11/11/2026, como exceção ao método humano original. SQL/002 repetidos com IDs/DEMO preservados; bucket criado e 12 fotos públicas 800×600/hash validadas. Recibos em entrega-3-dados-prova/aplicacao-producao-20261111.json e imagens-publicas-20261111.json. Não reaplicar DDL existente. As instruções seguintes são roteiro histórico de preparo, não recibo de execução humana.

# Aplicação no Supabase atual

Projeto: germinare3mil / mvoswngmnsfxcecucrys. Operações abaixo executadas pelo
responsável humano, conforme a regra da prática. Nenhuma conta do professor será
criada, por decisão dele. Não enviar senha, chave ou connection string no chat.

O SQL exato foi testado em PostgreSQL 16 descartável: 16 equipamentos totais,
12 associações/fotos, os 4 DEMO preservados, nenhum empréstimo criado e repetição
do SQL de dados com os mesmos IDs. Isso não comprova aplicação em produção.

## Banco — uma aplicação

1. Abra [000-aplicar-pratica.sql](../../backend/db/pratica/entrega-3/material/000-aplicar-pratica.sql), copie todo o conteúdo e cole numa consulta nova no SQL Editor do projeto acima.
2. Confira o destino e clique você em Run. A transação cria a tabela/índice de imagens e insere os 12 itens, preservando os quatro DEMO e históricos. Não há DELETE/reset nem criação de usuário.
3. Se aparecer erro, pare e informe só o erro sem credenciais; não remova proteções para passar. Não repita a estrutura já existente.
4. Para provar repetição sem duplicação, execute depois somente [002-dados.sql](../../backend/db/pratica/entrega-3/material/002-dados.sql). Deve permanecer 16 no total e 12 na prática, com IDs iguais.

O inventário tem timestamp fornecido pelo banco e validade de 24h; material antigo
precisa de nova conferência. Não alterar o timestamp localmente para ultrapassar.

## Fotos — bucket dedicado

1. Storage → New bucket: nome exato equipamentos-pratica, público. Somente PNGs, até 5 MiB por arquivo. Não criar políticas de escrita para usuários/clientes.
2. Envie a pasta [pratica-2026](../../backend/db/pratica/entrega-3/material/pratica-2026) preservando os subdiretórios TI-0001 a TI-0012 e o nome SHA256.png de cada foto. Se a interface pedir primeiro criar pasta, crie pratica-2026 e cada TI-xxxx antes de enviar a foto correspondente. Não enviar planos, inventário ou documentos de revisão ao bucket público.
3. Arquivo existente com bytes diferentes: parar, sem sobrescrever. Os URLs esperados estão em [plano.json](../../backend/db/pratica/entrega-3/material/plano.json).

Depois da aplicação, avisar para conferir URLs, hashes/dimensões e estado do banco.
Não basta uma mensagem "sucesso" do upload ou HTTP 200 de uma página HTML.

## Ressalvas escolhidas pelo responsável

As fotos atuais foram mantidas apesar de pessoas/marcas/textos ou categoria
incompatível em algumas. O manifesto registra escolha com ressalvas, sem fingir
aprovação no contrato visual original. A conta do professor foi retirada do
escopo pelo responsável. Isso deve constar na entrega, sem alegar cumprimento
desses requisitos do enunciado original.
