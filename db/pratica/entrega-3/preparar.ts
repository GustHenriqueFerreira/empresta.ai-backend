// Offline: arquivos locais apenas. Não carrega .env, SDK Supabase ou cliente PG.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { z } from 'zod'
import { equipamentos, manifestoAprovado, dentro, impedirCredenciaisProducao,
  ErroOperacional, urlPermitida } from '../../../../skills/imagens-equipamentos/scripts/pipeline'

const falhar = (mensagem: string): never => { throw new ErroOperacional(mensagem) }
const hash = (bytes: Buffer) => crypto.createHash('sha256').update(bytes).digest('hex')
const texto = z.string().trim().min(1).max(256).refine(s => !/[\x00-\x1f]/.test(s))
const sha = z.string().regex(/^[a-f0-9]{64}$/)
const data = z.string().datetime({ offset: true })
const itemInventario = z.object({ id: z.string().uuid(), nome: texto, categoria: texto,
  patrimonio: texto, situacao: z.enum(['disponivel','emprestado','manutencao']),
  emprestimos_totais: z.number().int().nonnegative(), emprestimos_abertos: z.number().int().nonnegative(),
}).strict()
const inventarioSchema = z.object({ versao: z.literal(1), projeto: z.string().regex(/^[a-z]{20}$/),
  observadoEm: data, aprovadoPor: texto, destinoConfirmado: z.literal(true),
  catalogoExatoConfirmado: z.literal(true), adotarIds: z.array(z.string().uuid()).max(12),
  preservarHistorico: z.boolean().optional().default(false),
  equipamentos: z.array(itemInventario).max(10000),
}).strict()
const fotoSchema = z.object({ patrimonio: texto, nome: texto, fornecedor: z.literal('pixabay'),
  fotoId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER), pagina: z.string().max(2048),
  autor: texto, autorId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  licenca: z.literal('https://pixabay.com/service/license-summary/'), arquivo: texto,
  largura: z.literal(800), altura: z.literal(600), sha256: sha, originalSha256: sha,
  origemArquivo: z.string().max(2048), obtidaEm: data,
}).strict()
const manifestoSchema = z.object({ versao: z.literal(1), fornecedor: z.literal('pixabay'),
  credito: z.object({ texto: z.literal('Fotos: Pixabay'), url: z.literal('https://pixabay.com/') }).strict(),
  equipamentos: z.array(fotoSchema).length(12),
}).strict()
const revisoesSchema = z.array(z.object({ patrimonio: texto, sha256: sha, revisor: texto,
  revisadoEm: data, aprovada: z.literal(true), pessoa: z.literal(false),
  marcaOuLogo: z.literal(false), texto: z.literal(false), telaComConteudo: z.literal(false),
  motivo: z.string().trim().min(1).max(2000),
}).strict()).length(12)
export type Inventario = z.infer<typeof inventarioSchema>
export type Manifesto = z.infer<typeof manifestoSchema>
export const catalogo = equipamentos.map((e, i) => ({ patrimonio: e.patrimonio, nome: e.nome,
  categoria: i < 4 ? 'Notebook' : i < 7 ? 'Monitor' : i < 10 ? 'Cabo' : 'Câmera',
  situacao: [3, 6, 9].includes(i) ? 'manutencao' : 'disponivel' }))

export function validarInventario(raw: unknown, agora = Date.now()): Inventario {
  const parsed = inventarioSchema.safeParse(raw)
  if (!parsed.success) return falhar('Inventário fora do contrato ou sem confirmação humana.')
  const inv = parsed.data
  const idade = agora - Date.parse(inv.observadoEm)
  if (idade < 0 || idade > 86400000) return falhar('Inventário deve ser atual, não futuro, de até 24 horas.')
  if (new Set(inv.equipamentos.map(e => e.id)).size !== inv.equipamentos.length
      || new Set(inv.equipamentos.filter(e => !inv.preservarHistorico || catalogo.some(c => c.patrimonio === e.patrimonio)).map(e => e.patrimonio)).size !== inv.equipamentos.filter(e => !inv.preservarHistorico || catalogo.some(c => c.patrimonio === e.patrimonio)).length
      || new Set(inv.adotarIds).size !== inv.adotarIds.length) return falhar('Inventário contém IDs/patrimônios duplicados.')
  for (const e of inv.equipamentos) {
    if (!inv.preservarHistorico && !catalogo.some(c => c.patrimonio === e.patrimonio)) return falhar('Há equipamentos fora dos 12. Resolver D-08, sem excluir dados.')
    if (e.emprestimos_abertos > e.emprestimos_totais) return falhar('Contagens do inventário são inconsistentes.')
  }
  if (inv.adotarIds.some(id => !inv.equipamentos.some(e => e.id === id))) return falhar('Adoção exige ID observado no inventário.')
  for (const id of inv.adotarIds) {
    const e = inv.equipamentos.find(e => e.id === id)!
    const c = catalogo.find(c => c.patrimonio === e.patrimonio)
    if (!c || e.nome !== c.nome || e.categoria !== c.categoria || e.situacao !== c.situacao
        || e.emprestimos_totais !== 0) return falhar('Equipamento adotado diverge ou possui histórico; não será sobrescrito.')
  }
  return inv
}

export function validarManifesto(raw: unknown): Manifesto {
  const parsed = manifestoSchema.safeParse(raw)
  if (!parsed.success) return falhar('Manifesto fora do contrato aprovado.')
  const m = parsed.data
  for (const c of catalogo) {
    const matches = m.equipamentos.filter(p => p.patrimonio === c.patrimonio)
    if (matches.length !== 1 || matches[0].nome !== c.nome
        || matches[0].arquivo !== `fotos/${c.patrimonio}.png`) return falhar('Manifesto não corresponde aos 12 equipamentos canônicos.')
    urlPermitida(matches[0].pagina, 'pagina'); urlPermitida(matches[0].origemArquivo, 'download')
    if (Date.parse(matches[0].obtidaEm) > Date.now()) return falhar('Data da foto é futura.')
  }
  for (const key of ['fotoId','sha256','originalSha256'] as const) {
    if (new Set(m.equipamentos.map(p => p[key])).size !== 12) return falhar('Fotos repetidas no manifesto.')
  }
  return m
}

export function planejar(rawManifesto: unknown, rawInventario: unknown) {
  const inventario = validarInventario(rawInventario)
  const manifesto = validarManifesto(rawManifesto)
  return { versao: 1, projeto: inventario.projeto, inventariadoEm: inventario.observadoEm, adotarIds: inventario.adotarIds, preservarHistorico: inventario.preservarHistorico,
    // IDs inventariados prendem a adoção à identidade, não apenas ao patrimônio.
    observados: inventario.equipamentos.map(e => ({ id: e.id, patrimonio: e.patrimonio })),
    equipamentos: catalogo.map(c => {
      const f = manifesto.equipamentos.find(p => p.patrimonio === c.patrimonio)!
      return { ...c, imagem: { bucket: 'equipamentos-pratica',
        caminho: `pratica-2026/${c.patrimonio}/${f.sha256}.png`, largura: f.largura, altura: f.altura,
        sha256: f.sha256, fornecedor: f.fornecedor, foto_id: f.fotoId, pagina_origem: f.pagina,
        autor: f.autor, autor_id: f.autorId, licenca_url: f.licenca,
        origem_arquivo: f.origemArquivo, obtida_em: f.obtidaEm },
        urlPublica: `https://${inventario.projeto}.supabase.co/storage/v1/object/public/equipamentos-pratica/pratica-2026/${c.patrimonio}/${f.sha256}.png`,
        arquivoLocal: f.arquivo }
    }) }
}
export type Plano = ReturnType<typeof planejar>

export function gerarSql(plano: Plano): string {
  // Dados viram bytes hex de JSON: nenhum autor, nome ou URL é sintaxe SQL.
  const hex = Buffer.from(JSON.stringify(plano), 'utf8').toString('hex')
  return `-- REVISÃO E EXECUÇÃO HUMANAS APENAS. Projeto público: ${plano.projeto}
-- Antes: conta, uploads, URLs/bytes e inventário humano conferidos.
-- Esta transação bloqueia brevemente escritas nas tabelas; timeout aborta tudo.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';
lock table public.equipamentos in share row exclusive mode;
lock table public.emprestimos in share mode;
lock table public.equipamentos_imagens in share row exclusive mode;
do $pratica$
declare
  dados jsonb := convert_from(decode('${hex}', 'hex'), 'UTF8')::jsonb;
  item jsonb;
  eq public.equipamentos%rowtype;
  foto public.equipamentos_imagens%rowtype;
  esperado public.equipamentos_imagens%rowtype;
begin
  if (dados->>'inventariadoEm')::timestamptz > now()
     or now() - (dados->>'inventariadoEm')::timestamptz > interval '24 hours'
  then raise exception 'Inventario expirado ou futuro; refazer antes de aplicar.'; end if;
  if exists (select 1 from public.equipamentos e where not exists
    (select 1 from jsonb_array_elements(dados->'equipamentos') x where x->>'patrimonio'=e.patrimonio)
    and (not (dados->>'preservarHistorico')::boolean or not exists
      (select 1 from jsonb_array_elements(dados->'observados') o where o->>'id'=e.id::text and o->>'patrimonio'=e.patrimonio)))
  then raise exception 'Existem equipamentos fora do conjunto. Resolver D-08, sem excluir.'; end if;
  if exists (select 1 from public.equipamentos e where exists
    (select 1 from jsonb_array_elements(dados->'equipamentos') x where x->>'patrimonio'=e.patrimonio)
    group by patrimonio having count(*) > 1)
  then raise exception 'Patrimonio duplicado: interrompido sem alteracao.'; end if;
  for item in select value from jsonb_array_elements(dados->'equipamentos') loop
    select * into eq from public.equipamentos where patrimonio = item->>'patrimonio';
    if found then
      if exists (select 1 from jsonb_array_elements(dados->'observados') o
          where o->>'patrimonio'=eq.patrimonio and o->>'id'<>eq.id::text)
      then raise exception 'Identidade mudou desde inventario; interrompido.'; end if;
      if eq.nome <> item->>'nome' or eq.categoria <> item->>'categoria'
      then raise exception 'Nome ou categoria divergente; nao sobrescrever.'; end if;
      select * into foto from public.equipamentos_imagens where equipamento_id=eq.id;
      if not found then
        if not exists (select 1 from jsonb_array_elements_text(dados->'adotarIds') a where a.value=eq.id::text)
          or not exists (select 1 from jsonb_array_elements(dados->'observados') o
            where o->>'id'=eq.id::text and o->>'patrimonio'=eq.patrimonio)
          or eq.situacao <> item->>'situacao'
          or exists (select 1 from public.emprestimos where equipamento_id=eq.id)
        then raise exception 'Registro preexistente nao aprovado para adocao ou com historico.'; end if;
      end if;
    else
      if exists (select 1 from jsonb_array_elements(dados->'observados') o
          where o->>'patrimonio'=item->>'patrimonio')
      then raise exception 'Registro inventariado desapareceu; refazer inventario.'; end if;
      insert into public.equipamentos(nome,categoria,patrimonio,situacao)
      values (item->>'nome',item->>'categoria',item->>'patrimonio',item->>'situacao') returning * into eq;
    end if;
    esperado := jsonb_populate_record(null::public.equipamentos_imagens,
      (item->'imagem') || jsonb_build_object('equipamento_id',eq.id));
    select * into foto from public.equipamentos_imagens where equipamento_id=eq.id;
    if found then
      if foto is distinct from esperado
      then raise exception 'Imagem existente diverge; nao sobrescrever.'; end if;
    else
      insert into public.equipamentos_imagens select (esperado).*;
    end if;
  end loop;
  if (select count(*) from public.equipamentos e where exists
       (select 1 from jsonb_array_elements(dados->'equipamentos') x where x->>'patrimonio'=e.patrimonio)) <> 12
     or (select count(*) from public.equipamentos_imagens) <> 12
  then raise exception 'Conjunto incompleto; transacao cancelada.'; end if;
end;
$pratica$;
select count(*) as equipamentos, count(distinct patrimonio) as patrimonios from public.equipamentos;
select count(*) as imagens from public.equipamentos_imagens;
commit;
`
}

export async function empacotarLocal(areaSkill: string, lote: string, area: string) {
  impedirCredenciaisProducao(process.env)
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(lote)) return falhar('Lote inválido.')
  const source = path.join(areaSkill, '.cache/lotes', lote)
  // dentro também recusa links nos componentes abaixo da raiz da skill.
  dentro(areaSkill, `.cache/lotes/${lote}`)
  const readJson = (file: string) => {
    if (fs.statSync(file).size > 1024 * 1024) return falhar('Entrada local excede limite.')
    return JSON.parse(fs.readFileSync(file, 'utf8')) as unknown
  }
  const invPath = dentro(area, 'entrada/inventario.aprovado.json')
  if (fs.statSync(invPath).size > 1024 * 1024) return falhar('Inventário local excede limite.')
  const invBytes = fs.readFileSync(invPath)
  const inv = validarInventario(JSON.parse(invBytes.toString('utf8')))
  const parsedReviews = revisoesSchema.safeParse(readJson(dentro(source, 'revisoes.json')))
  if (!parsedReviews.success) return falhar('Revisões locais fora do contrato ou sem aprovação humana.')
  const reviews = parsedReviews.data
  const revisado = await manifestoAprovado(source, reviews)
  const publicado = validarManifesto(readJson(dentro(source, 'manifesto.aprovado.json')))
  if (JSON.stringify(validarManifesto(revisado)) !== JSON.stringify(publicado)) return falhar('Manifesto diverge dos registros/revisões atuais.')
  const plano = planejar(publicado, inv)
  const bytes = plano.equipamentos.map(e => {
    const b = fs.readFileSync(dentro(source, e.arquivoLocal))
    if (b.length > 5 * 1024 * 1024 || hash(b) !== e.imagem.sha256) return falhar('Foto mudou ou excede limite aprovado do bucket.')
    return b
  })
  // Sem rede, sem publicar. Pacote completo ganha marcador por último.
  const pasta = dentro(area, `pacotes/${Date.now()}-${crypto.randomUUID()}`)
  fs.mkdirSync(pasta, { recursive: true })
  const write = (name: string, value: string | Buffer) => fs.writeFileSync(dentro(pasta, name), value, { flag: 'wx' })
  const planoBytes = Buffer.from(JSON.stringify(plano, null, 2) + '\n')
  const estruturaBytes = fs.readFileSync(path.join(__dirname, '001-imagens.sql'))
  write('plano.json', planoBytes)
  const manifestBytes = Buffer.from(JSON.stringify(publicado, null, 2) + '\n')
  const reviewBytes = Buffer.from(JSON.stringify(reviews, null, 2) + '\n')
  write('manifesto.aprovado.json', manifestBytes)
  write('revisoes.json', reviewBytes)
  write('inventario.aprovado.json', invBytes)
  write('001-imagens.sql', estruturaBytes)
  write('002-dados.sql', gerarSql(plano))
  for (const [i, e] of plano.equipamentos.entries()) {
    fs.mkdirSync(dentro(pasta, `fotos/${e.patrimonio}`), { recursive: true })
    write(`fotos/${e.patrimonio}/${e.imagem.sha256}.png`, bytes[i])
  }
  write('PRONTO-PARA-REVISAO.json', JSON.stringify({ versao: 1, lote, projeto: plano.projeto,
    fotos: 12, publicacaoExecutada: false, aplicacaoExecutada: false,
    sqlSha256: hash(Buffer.from(gerarSql(plano))), inventarioSha256: hash(invBytes),
    estruturaSha256: hash(estruturaBytes), planoSha256: hash(planoBytes),
    manifestoSha256: hash(manifestBytes), revisoesSha256: hash(reviewBytes),
    aviso: 'Preparação local; não comprova upload, login, banco ou aprovação final.' }, null, 2) + '\n')
  return pasta
}

export async function prepararPacote(lote: string) {
  const raiz = path.resolve(__dirname, '../../../..')
  return empacotarLocal(path.join(raiz, 'skills/imagens-equipamentos'), lote, __dirname)
}

if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length !== 1) { console.error('Uso: tsx preparar.ts <lote>. Sem comandos de publicação.'); process.exitCode = 1 }
  else prepararPacote(args[0]).then(p => console.log('Pacote local para revisão humana: ' + path.basename(p))).catch(error => {
    console.error(error instanceof ErroOperacional ? error.message : 'Preparação interrompida. Confira entradas locais; nenhum serviço remoto foi chamado.')
    process.exitCode = 1
  })
}
