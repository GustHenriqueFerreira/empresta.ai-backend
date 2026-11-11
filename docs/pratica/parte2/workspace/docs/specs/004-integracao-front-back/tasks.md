# Tarefas — Integração frontend/backend

Registro retrospectivo organizado em 05/11/2026. Estado da implementação e do aceite são separados.

- [x] Preservar contrato e separar spec, plano e tarefas.
- [x] Identificar testes existentes por CA e expor os nove cenários SQL individualmente.
- [x] Corrigir colisão de descoberta Jest com bundle .vercel.
- [x] Executar builds frontend/backend e 31 testes backend em ambiente isolado.
- [x] Verificar recusa HTTP de colaborador em Operações e cadastro com guard/controller/serviço reais.
- [x] Verificar GET público e recusa de rota privada sem sessão.
- [ ] Após reativação do Supabase, validar conexão e acesso autenticado por leitura.
- [ ] Automatizar login, restauração/expiração/logout, catálogo vazio/erro e atualização após recarga em ambiente isolado.
- [ ] Automatizar tela/indicadores e os subcritérios sem prova de interface.
- [ ] Demonstrar limite de três sob concorrência real entre conexões PostgreSQL isoladas.
- [ ] Identificar formalmente os subcritérios de copy, cadastro e integração Prisma e conferir conflitos.
- [ ] Receber Veredito: PRONTA do verificador.

Não usar produção para criar empréstimos de teste. Supabase foi confirmado como pausado pelo responsável em 05/11/2026; o health público não detecta isso.
