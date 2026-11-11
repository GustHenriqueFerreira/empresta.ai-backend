# Contrato, fontes e garantias

Fontes do projeto: ADR 003, plano docs/pratica/planejamento/02-skill-imagens,
rules/skill.md, rules/SECRETS.md e fluxo da parte 2. Originais não são alterados.

Fornecedor decidido em D-15: Pixabay. Documentação consultada em 11/11/2026:
[API](https://pixabay.com/api/docs/) e [licença](https://pixabay.com/service/license-summary/).
API pede identificação da origem; não confundir isso com atribuição obrigatória
de autor na licença geral. O manifesto preserva autoria/licença. Texto de crédito
proposto para etapa da interface: Fotos: Pixabay, com link.

Cache de consulta por 24 horas. Não usar hotlink permanente; fotos aprovadas
serão publicadas pelo humano no Storage na tarefa 3. Não fazer varredura em massa,
contornar limite, trocar fonte ou registrar URL com chave. Pesquisa real precisa
de chave privada do responsável; a documentação pública não fornece essa chave.

## Quem garante o quê

| Critério do plano | Garantia |
|---|---|
| IM-01 | API fixa, tipo photo, hosts/HTTPS/redirects e campos de origem validados; busca real pendente até chave. |
| IM-02 | Pessoa revisa PNG final; scripts bloqueiam ausência/recusa ou hash de revisão divergente. Isso não detecta pessoas/logos automaticamente nem autentica a identidade declarada do revisor. |
| IM-03 | sharp transforma e metadata verifica 800×600 nos bytes finais. |
| IM-04 | Unicidade de ID, hash original/final e revisão visual de duplicatas/recortes. |
| IM-05 | Manifesto exige autor/ID/página/URL de obtenção/data/licença/dimensões/hash e nome canônico. Não é assinatura de autoria da API. |
| IM-06 | Nomes determinísticos, mesmo preparo preservado; conteúdo diferente gera conflito e não sobrescreve. |
| IM-07 | Preparador contém só GETs permitidos e I/O local; sem cliente/comando/credenciais Supabase, não oferece publicação. Não limita por si todas as ferramentas do principal. |
| IM-08 | Material local para humano; URL pública final só será demonstrada na 006, crédito na 007. |

Ao instalar dependências use o lockfile do pacote isolado. Código original dos
apps não muda. Testes reutilizam o Jest do backend; não instalar framework novo.
Documentação sharp: [instalação](https://sharp.pixelplumbing.com/install/) e
[resize](https://sharp.pixelplumbing.com/api-resize/).
