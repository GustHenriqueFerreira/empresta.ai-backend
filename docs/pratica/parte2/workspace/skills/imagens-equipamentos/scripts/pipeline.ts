import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

export const equipamentos = [
  ['TI-0001', 'Notebook 14 polegadas', 'laptop on white desk'],
  ['TI-0002', 'Notebook 15 polegadas', 'open laptop minimal desk'],
  ['TI-0003', 'Notebook 13 polegadas', 'laptop closeup keyboard'],
  ['TI-0004', 'Notebook 15 polegadas', 'closed laptop on table'],
  ['TI-0005', 'Monitor 24 polegadas', 'computer monitor on desk'],
  ['TI-0006', 'Monitor 27 polegadas', 'monitor screen office desk'],
  ['TI-0007', 'Monitor 22 polegadas', 'black computer screen'],
  ['TI-0008', 'Cabo HDMI 2 m', 'hdmi cable'],
  ['TI-0009', 'Cabo USB-C 1 m', 'usb cable white background'],
  ['TI-0010', 'Cabo de rede 3 m', 'ethernet cable'],
  ['TI-0011', 'Webcam Full HD', 'webcam'],
  ['TI-0012', 'Câmera compacta', 'compact camera on table'],
].map(([patrimonio, nome, busca]) => ({ patrimonio, nome, busca }))

export const LICENCA = 'https://pixabay.com/service/license-summary/'
const MAX_BYTES = 15 * 1024 * 1024
const DAY = 24 * 60 * 60 * 1000
export const sha256 = (bytes: crypto.BinaryLike) => crypto.createHash('sha256').update(bytes).digest('hex')
export class ErroOperacional extends Error {}
const fail = (message: string): never => { throw new ErroOperacional(message) }
const string = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= 500 && !/[\x00-\x1f\x7f]/.test(value)
export function equipamento(patrimonio: string) {
  return equipamentos.find(e => e.patrimonio === patrimonio) || fail('Patrimônio fora da lista da prática.')
}
export interface Foto { id: number; pageURL: string; user: string; user_id: number; largeImageURL: string }
export interface Preparada {
  patrimonio: string; nome: string; fornecedor: 'pixabay'; fotoId: number; pagina: string; autor: string; autorId: number;
  licenca: string; arquivo: string; largura: number; altura: number; sha256: string; originalSha256: string;
  origemArquivo: string; obtidaEm: string;
}
export interface Revisao {
  patrimonio: string; sha256: string; revisor: string; revisadoEm: string; aprovada: boolean | null;
  pessoa: boolean | null; marcaOuLogo: boolean | null; texto: boolean | null; telaComConteudo: boolean | null; motivo: string;
}

export function urlPermitida(value: unknown, mode: 'pagina' | 'download'): string {
  if (!string(value)) return fail('URL de origem inválida.')
  let url: URL
  try { url = new URL(value) } catch { return fail('URL de origem inválida.') }
  if (url.protocol !== 'https:' || url.port || url.username || url.password || url.search || url.hash) return fail('URL de origem não permitida.')
  const allowed = mode === 'pagina' ? url.hostname === 'pixabay.com'
    : (url.hostname === 'pixabay.com' && url.pathname.startsWith('/get/')) || (url.hostname === 'cdn.pixabay.com' && url.pathname.startsWith('/photo/'))
  if (!allowed || url.pathname === '/' || url.pathname.includes('..')) return fail('Destino fora do Pixabay permitido.')
  return url.href
}

export function fotoValida(value: unknown): Foto {
  if (!value || typeof value !== 'object') return fail('Foto inválida na resposta.')
  const v = value as Record<string, unknown>
  if (!Number.isSafeInteger(v.id) || Number(v.id) <= 0 || v.type !== 'photo' || !string(v.user)
    || !Number.isSafeInteger(v.user_id) || Number(v.user_id) <= 0) return fail('Resposta não identifica foto/autor válidos.')
  return { id: Number(v.id), pageURL: urlPermitida(v.pageURL, 'pagina'), user: v.user.trim(), user_id: Number(v.user_id), largeImageURL: urlPermitida(v.largeImageURL, 'download') }
}

export type Transport = (url: string, init: RequestInit) => Promise<Response>
async function bytesResposta(response: Response, maximum: number): Promise<Buffer> {
  if (!response.ok || response.redirected || !response.body) return fail('Resposta remota recusada; nenhum conteúdo foi aplicado.')
  const declared = Number(response.headers.get('content-length'))
  if (declared > maximum) return fail('Arquivo remoto excede o limite.')
  const chunks: Uint8Array[] = []
  let size = 0
  const reader = response.body.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.length
      if (size > maximum) { await reader.cancel(); return fail('Arquivo remoto excede o limite.') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks)
}

export async function buscarFotos(patrimonio: string, key: string, transport: Transport = fetch): Promise<Foto[]> {
  const item = equipamento(patrimonio)
  if (!key.trim() || key.length > 512 || /\s/.test(key)) return fail('Chave ausente ou inválida. Use a entrada privada.')
  const url = new URL('https://pixabay.com/api/')
  url.search = new URLSearchParams({ key, q: item.busca, image_type: 'photo', orientation: 'horizontal', safesearch: 'true', per_page: '20' }).toString()
  try {
    const response = await transport(url.href, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(15000) })
    const parsed: unknown = JSON.parse((await bytesResposta(response, 1024 * 1024)).toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as { hits?: unknown }).hits)) return fail('Resposta Pixabay fora do contrato.')
    const hits = (parsed as { hits: unknown[] }).hits
    if (hits.length > 20) return fail('Resposta Pixabay acima do limite desta busca.')
    // Retém somente campos conhecidos: tags, legendas ou instruções são descartadas.
    const candidates = hits.map(fotoValida)
    if (JSON.stringify(candidates).includes(key)) return fail('Resposta contém dado privado inesperado.')
    return candidates
  } catch { return fail('Não foi possível consultar o Pixabay. Confira a chave ou tente após o limite. Detalhes privados omitidos.') }
}

export async function baixarFoto(foto: Foto, transport: Transport = fetch): Promise<Buffer> {
  const url = urlPermitida(foto.largeImageURL, 'download')
  try { return await bytesResposta(await transport(url, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(20000) }), MAX_BYTES) }
  catch { return fail('Não foi possível baixar a foto aprovada para preparo.') }
}

export async function padronizar(input: Buffer): Promise<Buffer> {
  if (!input.length || input.length > MAX_BYTES) return fail('Imagem vazia ou acima do limite.')
  const png = input.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const jpeg = input[0] === 255 && input[1] === 216 && input[2] === 255
  if (!png && !jpeg) return fail('Somente bytes de PNG/JPEG são permitidos.')
  try {
    const meta = await sharp(input, { limitInputPixels: 40_000_000, animated: false }).metadata()
    if (!['jpeg', 'png'].includes(meta.format || '') || (meta.pages || 1) !== 1) return fail('Formato não permitido.')
    const result = await sharp(input, { limitInputPixels: 40_000_000 }).rotate().flatten({ background: '#232532' })
      .resize(800, 600, { fit: 'contain', background: '#232532' }).png().toBuffer()
    const final = await sharp(result).metadata()
    if (final.width !== 800 || final.height !== 600 || final.exif) return fail('Saída não corresponde ao contrato.')
    return result
  } catch { return fail('Imagem inválida ou fora do contrato de processamento.') }
}

// O CLI fixa a raiz em .cache da skill; nomes externos nunca viram caminhos.
export function dentro(root: string, relative: string): string {
  const resolved = path.resolve(root, relative)
  const difference = path.relative(path.resolve(root), resolved)
  if (!difference || difference.startsWith('..') || path.isAbsolute(difference)) return fail('Caminho fora da área de trabalho.')
  let current = path.resolve(root)
  for (const part of [null, ...difference.split(path.sep)]) {
    if (part !== null) current = path.join(current, part)
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) return fail('Links não são permitidos na área de saída.')
  }
  return resolved
}
function salvarNovo(root: string, relative: string, bytes: string | Buffer) {
  const target = dentro(root, relative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, bytes, { flag: 'wx' })
}

export function lerCache(root: string, patrimonio: string, now = Date.now()): Foto[] | null {
  equipamento(patrimonio)
  const directory = dentro(root, 'buscas')
  if (!fs.existsSync(directory)) return null
  const names = fs.readdirSync(directory).filter(name => new RegExp(`^${patrimonio}-[0-9]+\\.json$`).test(name))
    .sort((a, b) => Number(b.slice(patrimonio.length + 1, -5)) - Number(a.slice(patrimonio.length + 1, -5)))
  if (!names.length) return null
  const file = dentro(root, `buscas/${names[0]}`)
  const cache = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (cache.patrimonio !== patrimonio || !Number.isFinite(cache.obtidoEm) || !Array.isArray(cache.fotos)) return fail('Cache inválido.')
  if (now < cache.obtidoEm || now - cache.obtidoEm >= DAY) return null
  return cache.fotos.map((f: Foto) => fotoValida({ ...f, type: 'photo' }))
}
export function salvarCache(root: string, patrimonio: string, fotos: Foto[], now = Date.now()) {
  equipamento(patrimonio)
  if (!Number.isSafeInteger(now) || now < 0) return fail('Data de cache inválida.')
  const target = dentro(root, `buscas/${patrimonio}-${now}.json`)
  const sanitized = fotos.map(f => fotoValida({ ...f, type: 'photo' }))
  const value = JSON.stringify({ patrimonio, obtidoEm: now, fotos: sanitized }, null, 2)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (fs.existsSync(target)) {
    if (fs.readFileSync(target, 'utf8') !== value) return fail('Conflito de versão no cache.')
  } else fs.writeFileSync(target, value, { flag: 'wx' })
}

export async function preparar(root: string, patrimonio: string, candidate: Foto, input: Buffer): Promise<Preparada> {
  const item = equipamento(patrimonio)
  const foto = fotoValida({ ...candidate, type: 'photo' })
  const output = await padronizar(input)
  const prepared: Preparada = { patrimonio, nome: item.nome, fornecedor: 'pixabay', fotoId: foto.id, pagina: foto.pageURL,
    autor: foto.user, autorId: foto.user_id, licenca: LICENCA, arquivo: `fotos/${patrimonio}.png`, largura: 800, altura: 600,
    sha256: sha256(output), originalSha256: sha256(input), origemArquivo: foto.largeImageURL, obtidaEm: new Date().toISOString() }
  fs.mkdirSync(root, { recursive: true })
  const lock = dentro(root, 'preparo.lock')
  const fd = fs.openSync(lock, 'wx')
  try {
    for (const other of equipamentos) {
      const existing = dentro(root, `registros/${other.patrimonio}.json`)
      if (!fs.existsSync(existing)) continue
      const previous: Preparada = JSON.parse(fs.readFileSync(existing, 'utf8'))
      if (other.patrimonio === patrimonio) {
        urlPermitida(previous.origemArquivo, 'download')
        if (!Number.isFinite(Date.parse(previous.obtidaEm)) || Date.parse(previous.obtidaEm) > Date.now()) return fail('Data de origem inválida.')
        const sameContent = { ...prepared, origemArquivo: previous.origemArquivo, obtidaEm: previous.obtidaEm }
        if (Object.keys(previous).length !== Object.keys(sameContent).length
          || (Object.keys(sameContent) as (keyof Preparada)[]).some(key => previous[key] !== sameContent[key])
          || sha256(fs.readFileSync(dentro(root, prepared.arquivo))) !== prepared.sha256) return fail('Conflito: equipamento já tem preparo diferente.')
        return previous
      }
      if (previous.fotoId === prepared.fotoId || previous.originalSha256 === prepared.originalSha256 || previous.sha256 === prepared.sha256) return fail('Foto repetida em outro equipamento.')
    }
    const imagePath = dentro(root, prepared.arquivo)
    if (fs.existsSync(imagePath)) {
      if (sha256(fs.readFileSync(imagePath)) !== prepared.sha256) return fail('Conflito: arquivo parcial diferente.')
    } else salvarNovo(root, prepared.arquivo, output)
    salvarNovo(root, `registros/${patrimonio}.json`, JSON.stringify(prepared, null, 2) + '\n')
    return prepared
  } finally { fs.closeSync(fd); fs.unlinkSync(lock) }
}

export function modeloRevisao(registros: Preparada[]): Revisao[] {
  return registros.map(p => ({ patrimonio: p.patrimonio, sha256: p.sha256, revisor: '', revisadoEm: '', aprovada: null,
    pessoa: null, marcaOuLogo: null, texto: null, telaComConteudo: null, motivo: '' }))
}

export async function manifestoAprovado(root: string, revisoes: Revisao[]) {
  if (!Array.isArray(revisoes) || revisoes.length !== equipamentos.length || new Set(revisoes.map(r => r.patrimonio)).size !== equipamentos.length) return fail('Revisão deve cobrir os 12 equipamentos sem repetição.')
  const records: Preparada[] = []
  for (const item of equipamentos) {
    const p: Preparada = JSON.parse(fs.readFileSync(dentro(root, `registros/${item.patrimonio}.json`), 'utf8'))
    const r = revisoes.find(review => review.patrimonio === item.patrimonio)
    if (p.patrimonio !== item.patrimonio || p.nome !== item.nome || p.fornecedor !== 'pixabay' || p.licenca !== LICENCA
      || !Number.isSafeInteger(p.fotoId) || p.fotoId <= 0 || !Number.isSafeInteger(p.autorId) || p.autorId <= 0 || !string(p.autor)
      || p.arquivo !== `fotos/${item.patrimonio}.png` || !/^[a-f0-9]{64}$/.test(p.originalSha256)) return fail('Registro de origem inválido.')
    urlPermitida(p.pagina, 'pagina')
    urlPermitida(p.origemArquivo, 'download')
    if (!Number.isFinite(Date.parse(p.obtidaEm)) || Date.parse(p.obtidaEm) > Date.now()) return fail('Data de origem inválida.')
    const file = dentro(root, p.arquivo)
    if (fs.statSync(file).size > MAX_BYTES) return fail('Imagem final acima do limite.')
    const image = fs.readFileSync(file)
    if (sha256(image) !== p.sha256) return fail('Imagem final alterada.')
    const actual = await sharp(image, { limitInputPixels: 40_000_000 }).metadata()
    if (p.largura !== 800 || p.altura !== 600 || actual.width !== 800 || actual.height !== 600
      || actual.format !== 'png' || actual.exif) return fail('Imagem final alterada ou fora de 800×600.')
    if (!r || r.sha256 !== p.sha256 || r.aprovada !== true || !string(r.revisor) || !string(r.motivo)
      || !Number.isFinite(Date.parse(r.revisadoEm)) || Date.parse(r.revisadoEm) > Date.now()
      || [r.pessoa, r.marcaOuLogo, r.texto, r.telaComConteudo].some(value => value !== false)) return fail('Revisão humana ausente, desatualizada ou com conteúdo proibido.')
    records.push(p)
  }
  for (const key of ['fotoId', 'originalSha256', 'sha256'] as const) if (new Set(records.map(p => p[key])).size !== records.length) return fail('Imagens repetidas no manifesto.')
  return { versao: 1, fornecedor: 'pixabay', credito: { texto: 'Fotos: Pixabay', url: 'https://pixabay.com/' }, equipamentos: records }
}

export function impedirCredenciaisProducao(environment: NodeJS.ProcessEnv) {
  if (Object.keys(environment).some(key => /^(DATABASE_URL|DIRECT_URL|PGPASSWORD|SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY)$/i.test(key) && environment[key])) {
    return fail('Execute o preparador sem credenciais de banco/produção no ambiente.')
  }
}
