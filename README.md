# EMPREST.AI — Backend

API REST NestJS em TypeScript, com Prisma, Zod, Supabase Auth e PostgreSQL/RLS.
Interface no [repositório frontend](https://github.com/GustHenriqueFerreira/empresta.ai-frontend).

## Executar

Requer Node.js 22.12 ou superior. Copie `.env.example` para `.env` e preencha
`DATABASE_URL`, `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`; configure também
`PORT=3001` e `CORS_ORIGIN=http://localhost:5173` para desenvolvimento local.
Codifique caracteres especiais da senha na URI PostgreSQL.

```bash
npm ci
npm run prisma:generate
npm run start:dev
```

API em http://localhost:3001/api. `GET /api/health` verifica o processo.
Demais endpoints exigem `Authorization: Bearer <access token do Supabase Auth>`.
A API verifica o usuário no Supabase; o acesso Prisma ocorre em transação com
papel SQL `authenticated` e claims de sessão, respeitando RLS.

## Build e testes

```bash
npm run prisma:generate
npm run build
npm test
npm start
```

Jest testa HTTP/autorização e regras/RLS em PostgreSQL WASM isolado, sem escrever
no banco remoto. Corridas entre múltiplas conexões exigem verificação adicional
em PostgreSQL isolado com múltiplas sessões.

```bash
node db/verificar-conexao.mjs
```

Esse diagnóstico exige build e faz somente leituras, sem exibir dados pessoais.

## Banco e primeiro acesso

Para banco **novo**, revise `db/001-schema-inicial.sql` e `db/002-integracao.sql`
antes de executar `npm run db:integracao`. Os dois arquivos são aplicados em
uma transação. O script não reaplica mudanças automaticamente em schema já
existente; não use `prisma db push` ou `migrate reset` no banco remoto.
A estratégia oficial de migrations ainda não foi decidida.

O projeto configurado na integração já recebeu as tabelas. Crie a primeira
conta real pelo painel Supabase, em Authentication → Users → Add user. O perfil
nasce como colaborador. Para conceder Operações a uma conta escolhida, o
responsável pelo banco executa manualmente:

```sql
update public.profiles set papel = 'operacoes' where id = '<UUID da conta escolhida>';
```

Nenhum usuário/equipamento fictício é criado no remoto. A senha da conta Auth
é diferente da senha PostgreSQL. `.env` fica apenas local ou no host do backend.

TLS valida CA e hostname usando o certificado público `certs/supabase-ca.crt`;
inclua `certs/` ao distribuir a API. O servidor usa a porta `PORT` e o lifecycle
convencional NestJS; configure a origem CORS conforme o frontend antes do deploy.

## Vercel

- Importar este repositório na branch `master`, diretório raiz `./`, framework
  NestJS e Node.js 22.x. `vercel.json` define o build e a inclusão da CA pública.
- Build Command: `npm run build`. O script gera Prisma Client antes de compilar,
  sem migration ou escrita no banco. Um override anterior que também gera Prisma
  é redundante, mas pode ser substituído por esse comando.
- Configurar `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e
  `CORS_ORIGIN` (origem HTTPS do frontend, sem barra final) no ambiente Vercel.
- O bootstrap segue o lifecycle NestJS da Vercel. A CA é lida a partir da raiz
  de execução, sem depender do caminho do arquivo compilado.
- Logs de falha indicam configuração ausente/inválida ou certificado ausente,
  sem expor valores de ambiente, tokens ou mensagens brutas de drivers.
- Após deploy, verificar `/api/health`. `Ready` no build não comprova inicialização
  nem uma jornada de login. Supabase/RLS continuam necessários em runtime.
