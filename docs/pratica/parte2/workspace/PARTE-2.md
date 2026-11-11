# Entrada da parte 2 — trabalho aditivo

Atualização de 11/11/2026 que prevalece sobre o congelamento absoluto abaixo:
responsável autorizou mudanças necessárias às entregas no projeto original e
rejeitou uma cópia separada. Não fazer refactors ou mudanças alheias à tarefa.
ZIP anterior continua intocado. Código/testes alterados têm escopo explícito e
diferenças verificáveis; arquivos de governança originais não precisam mudar.
O script antigo de identidade dos 104 permanece como referência histórica, não
deve ser apresentado como verde após alterações funcionais autorizadas.

Pedido do responsável em 06/11/2026: preservar todos os arquivos da primeira entrega e apenas adicionar o necessário.

A referência congelada é emprestai-entrega-professor-2026-11-05.zip, no Desktop. AGENTS.md, rules e agente originais permanecem byte a byte iguais ao ZIP. Não usar atualização de documentação como justificativa para modificá-los.

## Arquivos novos da prática

- agents/verificador-spec-pratica.md: complemento do verificador, separado da versão original.
- rules/spec-flow-pratica.md: fluxo da prática, sem reescrever o anterior.
- .codex/agents/verificador-spec-pratica.toml: definição derivada nova.
- agents/rodar-verificador.mjs: gate local da prática.
- docs/parte2/HANDOFF.md: continuidade da parte 2.
- ENTREGA.md e docs/pratica/: decisões e provas novas.

As rodadas já realizadas ficam como registro real, com os nomes usados no momento da execução; não renomear ou reescrever relatórios antigos para simular outra cronologia. Alterações desta etapa que tinham atingido cinco arquivos originais foram preservadas em docs/parte2/alteracoes-preservadas-2026-11-06/ antes da restauração.

Para checar a preservação: powershell -File agents/conferir-primeira-entrega.ps1. Nenhum histórico Git, ZIP antigo ou .env é alterado por essa checagem.
