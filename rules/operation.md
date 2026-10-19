# Regras de operação

> Leitor: agente e pessoa desenvolvedora.

## Objetivo

Orientar ações que executam, validam ou alteram o estado técnico do EMPREST.AI, mantendo separados os limites do frontend, do backend e do banco.

## Decisões do projeto aplicáveis

- Frontend e backend são pacotes independentes; cada operação deve declarar qual deles afeta, conforme `AGENTS.md` (seção 6, estrutura do monorepo).
- Configurações do servidor pertencem a `backend/.env`; configurações expostas ao navegador pertencem a `frontend/.env`. Exemplos versionados ficam nos `.env.example` correspondentes, conforme `SECRETS.md`.
- Schema e migrations pertencem ao backend. Qualquer alteração deve seguir `migrations.md` e não decide a estratégia de promoção ou rollback que continua em aberto.
- Dados apresentados pela aplicação devem vir da fonte real configurada; uma operação não pode introduzir registros fictícios como fallback silencioso.
- Quando existir, `docs/andar-zero.md` define critérios de verificação da integração, não funcionalidades de produto nem prova automática de que o ambiente atual atende a todos eles.

## Antes de operar

1. Ler o handoff atual e identificar o resultado autorizado.
2. Confirmar o pacote, ambiente e dados afetados.
3. Verificar variáveis necessárias sem revelar seus valores.
4. Distinguir checagem somente leitura de ação que altera banco, arquivos ou serviço externo.
5. Interromper e pedir autorização quando houver risco de perda de dados, indisponibilidade ou impacto em ambiente remoto.

## Durante a operação

- Limitar a ação ao ambiente e ao pacote declarados.
- Não usar produção como ambiente de teste.
- Não contornar política de acesso usando credencial mais privilegiada.
- Não aplicar migration sem revisar impacto e SQL correspondente.
- Registrar no handoff descoberta, mudança de plano, falha e ação manual pendente.

## Evidência de conclusão

Uma operação só pode ser considerada concluída quando o resultado observado corresponde ao objetivo, as validações relevantes foram registradas e qualquer limitação foi declarada. Build, teste e resposta de serviço comprovam aspectos diferentes e não devem ser tratados como equivalentes.

## Relação com outras regras

- Fluxo de trabalho e conflitos entre fontes: `spec-flow.md`.
- Variáveis e credenciais: `SECRETS.md`.
- Banco e migrations: `migrations.md`.
- Estratégia e evidência de testes: `tests.md`.
- Checklist de encerramento: `CHECKS.md`.
