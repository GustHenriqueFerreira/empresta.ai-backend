---
description: Onde cada variável de ambiente vive e qual chave usar
globs: ["backend/.env*", "frontend/.env*", "backend/src/**/*.ts", "backend/prisma/schema.prisma", "frontend/src/**/*.{js,jsx,ts,tsx}", "frontend/vite.config.ts"]
alwaysApply: false
---

# Variáveis de ambiente e chaves
> leitor: agente

## Quando
Ao criar ou usar qualquer variável de ambiente, ao instanciar o client
do banco, ou ao escrever código que lê configuração.

## Procedimento
1. Chave pública (anon): só ela pode aparecer em código que roda no
   navegador. A proteção dela são as políticas de acesso do banco.
2. Chave de serviço: ignora todas as políticas. Só em código que roda
   no servidor, nunca em componente de cliente, nunca em variável com
   prefixo público.
3. Cada variável deve ficar no ambiente que a consome:
   - servidor: `backend/.env` e `backend/.env.example`;
   - navegador: `frontend/.env` e `frontend/.env.example`.
4. Variável nova existe em três lugares ou em nenhum: arquivo `.env`
   do ambiente correto, o `.env.example` correspondente (versionado e
   sem valor) e a configuração do ambiente de deploy.
5. Ao criar uma variável, diga na resposta em quais desses lugares ela
   já foi incluída e o que ainda precisa ser feito manualmente.

## Verificação
Uma busca por "service" em `frontend/src/` não retorna segredo nem
chave de serviço. `backend/.env.example` e `frontend/.env.example`
contêm todas as chaves usadas em cada ambiente, sem nenhum valor real.

## Não faça
- Não escreva valor de chave em resposta, commit, log ou comentário.
- Não crie variável somente em `backend/.env` ou `frontend/.env`. Sem o
  exemplo correspondente e a configuração de deploy, outros ambientes
  não saberão que ela é obrigatória.
- Não contorne uma política de acesso trocando de chave. Se a política
  atrapalha, a política está errada — pare e me avise.
