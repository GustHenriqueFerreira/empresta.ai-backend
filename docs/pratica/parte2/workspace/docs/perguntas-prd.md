# Perguntas que o PRD não responde

Registro retrospectivo para a atividade da aula 7, em 05/11/2026. Não implica que as respostas foram discutidas antes do código.

1. Quem pode conceder o papel de Operações?
   - Tipo: negócio.
   - Por que importa: impede promoção por clique. A implementação usa atribuição manual pelo responsável no banco; o time deve confirmar quem exerce esse papel.
2. É permitido exibir nome e prazo do empréstimo de outra pessoa no catálogo?
   - Tipo: negócio.
   - Por que importa: afeta privacidade. A integração vigente prioriza isolamento e omite detalhes de terceiros.
3. Onde mora a sessão e como a API confirma a identidade?
   - Tipo: técnica.
   - Por que importa: define autenticação entre front e back. O SDK Supabase gerencia a sessão; a API verifica token com getUser.
4. Como o schema evolui e como reverter uma alteração?
   - Tipo: técnica, pendente.
   - Por que importa: os scripts numerados atuais não substituem uma estratégia formal de migrations e rollback.
5. Haverá reserva com data futura, recuperação de senha ou notificações de empréstimo?
   - Tipo: fora de escopo da entrega atual.
   - Por que importa: impede ampliação silenciosa do escopo; PRD e specs delimitam o que existe.

## Primeira funcionalidade

Login foi a primeira interface construída: a identidade permite isolar os empréstimos. A spec 001 foi retroativa, portanto não comprova a ordem proposta pela aula 8. O andar zero ainda não pode ser assumido integralmente pelas specs; consulte docs/andar-zero.md antes de reutilizar garantias AZ.
