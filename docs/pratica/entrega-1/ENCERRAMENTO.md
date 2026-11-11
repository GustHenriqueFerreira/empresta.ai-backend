# Encerramento da prova local — Entrega 1

Os seis requisitos possuem evidência local:

| Requisito | Evidência |
|---|---|
| Papel | spec e tabela por CA nas rodadas 02 e 04 |
| Independência | 03-erro/relatorio.md recusa autocorreção; principal restaurou |
| Obrigatório | gatilho.md: principal delegou sem nome do agente no pedido; spec-flow complementar e gate local |
| Seguro em produção | ferramentas/agents/rodar-verificador.mjs desativa ferramentas/conectores, read-only/never e ignora config de usuário; logs sem chamadas |
| Comparável | mesma spec/CA nas rodadas 02, 03 e 04; hashes e saídas do principal identificados |
| Provado | 03-erro reprova SEM TESTE com outros testes verdes; 04-restaurado aprova; integridade.json confirma restauração |

Os commits são de evidência: o primeiro 6ea7f901bd72bdcded250cfd5120340b5e777c59 registra o snapshot errado; o segundo é o commit que adiciona este encerramento e restaura teste-calibracao-atual.spec.ts.txt. Os testes aconteceram antes desses commits. Não se afirma que o aplicativo publicado sofreu o erro.

A comprovação é de calibração do verificador sobre uma função/teste real. Não aprova a integração 004 inteira. Usamos a alternativa de sessão nova permitida na aula, com checks executados pelo principal e explicitamente atribuídos; o modelo revisor só vê o pacote. A seleção nativa TOML permaneceu indisponível e não foi simulada.

Nenhum push, deploy, escrita em banco/Storage ou alteração de arquivo da primeira entrega. A publicação final, as outras entregas e as duas specs de produto ainda são etapas futuras. Confira o histórico com git log --oneline -- docs/pratica/entrega-1/.
