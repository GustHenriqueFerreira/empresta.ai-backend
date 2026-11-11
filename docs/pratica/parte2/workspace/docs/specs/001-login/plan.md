# Plano — 001-login

Registro retrospectivo organizado em 05/11/2026; não comprova aprovação prévia ao código.

## Arquivos e contratos

Áreas: frontend/src/features/login/, frontend/src/App.tsx.

Formulário e autenticação; contrato vigente em 004. Acesso por papel vem do servidor.

## Etapas de revisão

1. Conferir campos, erro inline, estado de envio e responsividade.
2. Usar Supabase Auth para credenciais e API /me para papel; o botão não promove o usuário.
3. Garantir que a spec histórica não substitua o contrato vigente da spec 004.

## Riscos e verificação

Não usar produção como banco de teste. Frontend e backend têm configurações próprias. Builds verificam compilação, não jornada completa. PGlite não comprova concorrência entre conexões. O relatório do verificador e docs/VALIDACAO.md registram evidências atuais.
