import type { EquipamentoImagem } from '@prisma/client'

// Projeta só metadados públicos, nunca BigInt bruto, revisão ou identidade de terceiros.
export function imagemPublica(imagem: EquipamentoImagem | null | undefined, supabaseUrl = process.env.SUPABASE_URL) {
  if (!imagem || !supabaseUrl) return null
  let origem: URL
  try { origem = new URL(supabaseUrl) } catch { return null }
  let pagina: URL
  try { pagina = new URL(imagem.pagina_origem) } catch { return null }
  if (origem.protocol !== 'https:' || origem.username || origem.password
    || !/^[a-z]{20}\.supabase\.co$/.test(origem.hostname)
    || origem.port || origem.search || origem.hash || imagem.bucket !== 'equipamentos-pratica'
    || pagina.protocol !== 'https:' || pagina.hostname !== 'pixabay.com' || pagina.username || pagina.password || pagina.port || pagina.search || pagina.hash
    || imagem.licenca_url !== 'https://pixabay.com/service/license-summary/'
    || !/^pratica-2026\/TI-00(0[1-9]|1[0-2])\/[a-f0-9]{64}\.png$/.test(imagem.caminho)) return null
  return { url: `${origem.origin}/storage/v1/object/public/${imagem.bucket}/${imagem.caminho}`,
    autor: imagem.autor, pagina: imagem.pagina_origem, fornecedor: 'pixabay' as const,
    licenca: imagem.licenca_url, largura: 800, altura: 600, ilustrativa: true }
}
