# Complemento de fluxo — parte 2

Somente adição: rules/spec-flow.md e AGENTS.md da primeira entrega ficam congelados. Este complemento rege o trabalho novo da prática. A fonte do revisor desta etapa é agents/verificador-spec-pratica.md; a versão antiga permanece intacta.

- Principal corrige; revisor somente verifica e relata, inclusive quando o único defeito parece ser um teste.
- Antes de declarar spec nova pronta, iniciar sessão limpa conforme a fonte nova e executar o gate agents/rodar-verificador.mjs com pacote de provas atual. Qualquer saída não zero mantém tarefas abertas.
- Nenhum agente escreve no banco ou Storage do deploy. O responsável humano executa material preparado e revisado.
- Os relatórios são preservados por rodada; não sobrescrever reprovações nem inventar execução.
- Usar o caminho sem ferramentas já demonstrado. A presença de um TOML não comprova ativação nativa nem sandbox independente.
- O principal registra a continuidade em docs/parte2/HANDOFF.md; o handoff original não é editado.
- Não alterar nenhum arquivo presente no ZIP da primeira entrega. A checagem agents/conferir-primeira-entrega.ps1 verifica identidade por SHA-256.
