# Complemento de fluxo — parte 2

Somente adição: rules/spec-flow.md e AGENTS.md da primeira entrega ficam congelados. Este complemento rege o trabalho novo da prática. A fonte do revisor desta etapa é agents/verificador-spec-pratica.md; a versão antiga permanece intacta.

- Principal corrige; revisor somente verifica e relata, inclusive quando o único defeito parece ser um teste.
- Antes de declarar spec nova pronta, iniciar sessão limpa conforme a fonte nova e executar o gate agents/rodar-verificador.mjs com pacote de provas atual. Qualquer saída não zero mantém tarefas abertas.
- Regra original da prática: nenhum agente escreve no banco/Storage do deploy. Exceção explícita do responsável em 11/11/2026, após revisão do escopo/material: autorizou o principal aplicar SQL/dados/fotos no projeto atual e publicar os dois repositórios, preservando DEMO/histórico e limitando mudanças ao necessário. Registrar execução pelo agente sob autorização, sem apresentá-la como execução humana ou cumprimento integral do método original. A exceção não concede permissão para excluir/resetar dados, expor segredos ou mover tags existentes.
- Os relatórios são preservados por rodada; não sobrescrever reprovações nem inventar execução.
- Usar o caminho sem ferramentas já demonstrado. A presença de um TOML não comprova ativação nativa nem sandbox independente.
- O principal registra a continuidade em docs/parte2/HANDOFF.md; o handoff original não é editado.
- Preservar o ZIP da primeira entrega. Após a correção explícita do responsável em 11/11/2026, modificar no projeto original somente código/testes necessários às entregas, sem cópia separada. agents/conferir-mudancas-autorizadas.ps1 confere a lista exata de exceções e preservação dos demais arquivos; o checker antigo dos 104 é histórico e não deve ser apresentado como verde após essas mudanças autorizadas. AGENTS.md e rules originais sem necessidade de alteração permanecem intactos.
