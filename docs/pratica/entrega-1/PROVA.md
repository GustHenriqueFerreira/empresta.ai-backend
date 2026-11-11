# Prova local do verificador

Este diretório é adicional; não modifica arquivos do aplicativo nem o ZIP de comparação.

O teste real de hojeBrasilia foi copiado para um ambiente local sem credenciais. A sequência real de execuções em 06/11/2026 foi preservada nas pastas de rodada. O erro é o teste CA-07 comentado na cópia, não um defeito publicado.

O arquivo teste-calibracao-atual.spec.ts.txt registra o estado do ensaio: o primeiro commit preserva o erro; o segundo deve restaurar o teste e acrescentar o relatório de restauração. Os testes foram executados antes destes commits de evidência, não depois. Não foi fabricada cronologia de execução.

O código em src/ e as regras de negócio ficaram intactos. A calibração prova uma verificação de fronteiras de data, não aprovação da spec 004 inteira.
