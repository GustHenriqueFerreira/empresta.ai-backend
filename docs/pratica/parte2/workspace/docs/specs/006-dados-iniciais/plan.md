# Plano 006 — dados iniciais

Aprovação do modelo aditivo precedeu o código; correções posteriores do responsável autorizaram trabalho necessário no original, preservação de DEMO, fotos ilustrativas e execução pelo principal. Não apresentar esta atualização como aprovação retroativa inexistente.

1. Inventariar Supabase atual somente em leitura e guardar timestamp real, IDs e histórico.
2. Preparar tabela de imagem/RLS/índice parcial sem alterar SQL previamente aplicado ou introduzir migration framework.
3. Validar manifesto e bytes offline. Escolhas com ressalvas ficam em manifesto separado, sem flags de aprovação visual.
4. Testar conflito, repetição, preservação de estados/histórico e recusas de credenciais em Jest isolado.
5. Validar SQL exato em PostgreSQL 16 Docker próprio, sem volumes/credenciais de produção.
6. Sob autorização específica, principal aplica 000 uma vez e repete somente 002; consulta comprova 16 totais/12 imagens e mesmos IDs/DEMO.
7. Criar bucket aprovado e enviar exclusivamente 12 PNGs nos caminhos por hash. GET sem autenticação comprova tipo, 800×600 e integridade.
8. Revisar provas sanitizadas e fontes atuais em sessão limpa. Principal corrige achados e repete gate antes de PRONTA.

Conta do professor dispensada pelo responsável; não provisionar, testar ou alegar zero. Preservar quatro DEMO e qualquer empréstimo, inclusive ao repetir. Relatar ator e exceção metodológica. Não usar produção para testes destrutivos/concorrência.
