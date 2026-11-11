import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { PGlite } from '@electric-sql/pglite'
import { catalogo, planejar, gerarSql, validarInventario, validarManifesto, empacotarLocal } from '../preparar'
import { preparar, modeloRevisao, manifestoAprovado } from '../../../../../skills/imagens-equipamentos/scripts/pipeline'
import sharp from '../../../../../skills/imagens-equipamentos/node_modules/sharp'

jest.setTimeout(60000)
const dir = path.resolve(__dirname, '..')
const uuid = () => crypto.randomUUID()
const digest = (s: string) => crypto.createHash('sha256').update(s).digest('hex')
const inv = () => ({ versao: 1, projeto: 'abcdefghijklmnopqrst', observadoEm: new Date().toISOString(),
  aprovadoPor: 'Operador de fixture', destinoConfirmado: true, catalogoExatoConfirmado: true,
  adotarIds: [] as string[], equipamentos: [] as Record<string, unknown>[] })
const manifest = () => ({ versao: 1, fornecedor: 'pixabay', credito: { texto: 'Fotos: Pixabay', url: 'https://pixabay.com/' },
  equipamentos: catalogo.map((c, i) => ({ patrimonio: c.patrimonio, nome: c.nome, fornecedor: 'pixabay', fotoId: i+1,
    pagina: `https://pixabay.com/photos/fixture-${i+1}/`, autor: `Autor fixture ${i+1}`, autorId: i+1,
    licenca: 'https://pixabay.com/service/license-summary/', arquivo: `fotos/${c.patrimonio}.png`, largura: 800, altura: 600,
    sha256: digest(`final-${i}`), originalSha256: digest(`original-${i}`),
    origemArquivo: `https://cdn.pixabay.com/photo/fixture-${i}.png`, obtidaEm: new Date().toISOString() })) })
let db: PGlite
const executar = async (sql: string) => {
  try { return await db.exec(sql) } catch (e) { await db.exec('rollback'); throw e }
}
beforeAll(async () => {
  db = new PGlite()
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb, email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
    grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`)
  for (const f of ['001-schema-inicial.sql','002-integracao.sql']) await db.exec(fs.readFileSync(path.resolve(dir, '../..', f),'utf8'))
  await db.exec(fs.readFileSync(path.join(dir, '001-imagens.sql'),'utf8'))
})
beforeEach(async () => { await db.exec('truncate public.emprestimos, public.equipamentos_imagens, public.equipamentos, public.profiles, auth.users cascade') })
afterAll(async () => { await db?.close() })

it('DI-CA-01 DI-CA-05: insere os 12 com 9/3 e repetir preserva IDs e nenhum empréstimo', async () => {
  const sql = gerarSql(planejar(manifest(), inv()))
  await executar(sql)
  const antes = await db.query('select id,patrimonio,situacao from public.equipamentos order by patrimonio')
  expect(antes.rows).toHaveLength(12)
  // Expectativas da spec, independentes do catalogo usado para produzir as entradas.
  expect((await db.query('select patrimonio,nome,categoria from public.equipamentos order by patrimonio')).rows).toEqual([
    {patrimonio:'TI-0001',nome:'Notebook 14 polegadas',categoria:'Notebook'},
    {patrimonio:'TI-0002',nome:'Notebook 15 polegadas',categoria:'Notebook'},
    {patrimonio:'TI-0003',nome:'Notebook 13 polegadas',categoria:'Notebook'},
    {patrimonio:'TI-0004',nome:'Notebook 15 polegadas',categoria:'Notebook'},
    {patrimonio:'TI-0005',nome:'Monitor 24 polegadas',categoria:'Monitor'},
    {patrimonio:'TI-0006',nome:'Monitor 27 polegadas',categoria:'Monitor'},
    {patrimonio:'TI-0007',nome:'Monitor 22 polegadas',categoria:'Monitor'},
    {patrimonio:'TI-0008',nome:'Cabo HDMI 2 m',categoria:'Cabo'},
    {patrimonio:'TI-0009',nome:'Cabo USB-C 1 m',categoria:'Cabo'},
    {patrimonio:'TI-0010',nome:'Cabo de rede 3 m',categoria:'Cabo'},
    {patrimonio:'TI-0011',nome:'Webcam Full HD',categoria:'Câmera'},
    {patrimonio:'TI-0012',nome:'Câmera compacta',categoria:'Câmera'},
  ])
  expect(antes.rows.filter((e: any) => e.situacao === 'disponivel')).toHaveLength(9)
  expect(antes.rows.filter((e: any) => e.situacao === 'manutencao').map((e: any) => e.patrimonio)).toEqual(['TI-0004','TI-0007','TI-0010'])
  await executar(sql)
  expect((await db.query('select id,patrimonio,situacao from public.equipamentos order by patrimonio')).rows).toEqual(antes.rows)
  expect((await db.query('select * from public.emprestimos')).rows).toHaveLength(0)
  expect((await db.query('select * from public.equipamentos_imagens')).rows).toHaveLength(12)
})

it('DI-CA-05 DI-CA-07: reexecução preserva item emprestado e seu histórico', async () => {
  const sql = gerarSql(planejar(manifest(), inv())); await executar(sql)
  const pessoa = uuid()
  await db.query("insert into auth.users(id,email,raw_user_meta_data) values ($1,'fixture@example.invalid','{}')", [pessoa])
  const e = (await db.query<{id:string}>("select id from public.equipamentos where patrimonio='TI-0001'")).rows[0]
  await db.query("insert into public.emprestimos(equipamento_id,usuario_id,devolver_ate) values($1,$2,current_date+14)", [e.id,pessoa])
  await db.query("update public.equipamentos set situacao='emprestado' where id=$1",[e.id])
  await executar(sql)
  expect((await db.query<{situacao:string}>('select situacao from public.equipamentos where id=$1',[e.id])).rows[0].situacao).toBe('emprestado')
  expect((await db.query('select * from public.emprestimos')).rows).toHaveLength(1)
})

it('DI-CA-05 DI-CA-07: conflito tardio de foto desfaz inserções anteriores da transação', async () => {
  const m = manifest(); const i = inv(); const c = catalogo[11]; const id = uuid()
  await db.query('insert into public.equipamentos(id,nome,categoria,patrimonio,situacao) values($1,$2,$3,$4,$5)',[id,c.nome,c.categoria,c.patrimonio,c.situacao])
  i.adotarIds = [id]; i.equipamentos = [{...c, id, emprestimos_totais: 0, emprestimos_abertos: 0}]
  const plano = planejar(m,i); await executar(gerarSql(plano))
  await db.query("delete from public.equipamentos_imagens where equipamento_id <> $1",[id])
  await db.query("delete from public.equipamentos where id <> $1",[id])
  m.equipamentos[11].sha256 = digest('substituicao-nao-autorizada')
  await expect(executar(gerarSql(planejar(m,i)))).rejects.toThrow(/Imagem existente diverge/)
  expect((await db.query('select * from public.equipamentos')).rows).toHaveLength(1)
  expect((await db.query('select * from public.equipamentos_imagens')).rows).toHaveLength(1)
})

it('DI-CA-05: registro preexistente precisa adoção explícita e conserva UUID', async () => {
  const c = catalogo[0], id = uuid(), i = inv()
  await db.query('insert into public.equipamentos(id,nome,categoria,patrimonio,situacao) values($1,$2,$3,$4,$5)',[id,c.nome,c.categoria,c.patrimonio,c.situacao])
  await expect(executar(gerarSql(planejar(manifest(),i)))).rejects.toThrow(/preexistente nao aprovado/)
  i.adotarIds=[id]; i.equipamentos=[{...c,id,emprestimos_totais:0,emprestimos_abertos:0}]
  await executar(gerarSql(planejar(manifest(),i)))
  expect((await db.query<{id:string}>("select id from public.equipamentos where patrimonio='TI-0001'")).rows[0].id).toBe(id)
})

it('DI-CA-01 DI-CA-05 DI-CA-07: modo aprovado preserva demonstração inventariada e mantém 12 no conjunto', async () => {
  const antigo=(await db.query<{id:string}>("insert into public.equipamentos(nome,categoria,patrimonio) values('Demonstração preservada','Cabo','DEMO-001') returning id")).rows[0].id
  const i={...inv(),preservarHistorico:true,equipamentos:[{id:antigo,nome:'Demonstração preservada',categoria:'Cabo',patrimonio:'DEMO-001',situacao:'disponivel',emprestimos_totais:0,emprestimos_abertos:0}]}
  const sql=gerarSql(planejar(manifest(),i)); await executar(sql); await executar(sql)
  expect((await db.query('select * from public.equipamentos')).rows).toHaveLength(13)
  expect((await db.query('select * from public.equipamentos_imagens')).rows).toHaveLength(12)
  expect((await db.query('select id,nome,patrimonio from public.equipamentos where id=$1',[antigo])).rows).toEqual([{id:antigo,nome:'Demonstração preservada',patrimonio:'DEMO-001'}])
})

it('DI-CA-07: item fora dos 12 interrompe, preserva o registro e não adiciona dados', async () => {
  await db.exec("insert into public.equipamentos(nome,categoria,patrimonio) values('Fixture anterior','Cabo','ANT-001')")
  await expect(executar(gerarSql(planejar(manifest(),inv())))).rejects.toThrow(/fora do conjunto/)
  expect((await db.query('select patrimonio from public.equipamentos')).rows).toEqual([{patrimonio:'ANT-001'}])
  expect((await db.query('select * from public.equipamentos_imagens')).rows).toHaveLength(0)
})

it('DI-CA-05: inventário desatualizado, futuro, duplicado ou sem confirmação é recusado', () => {
  const i = inv()
  expect(() => validarInventario({...i, observadoEm:'2020-01-01T00:00:00Z'})).toThrow(/Inventário/)
  expect(() => validarInventario({...i, observadoEm:'2099-01-01T00:00:00Z'})).toThrow(/Inventário/)
  expect(() => validarInventario({...i, destinoConfirmado:false})).toThrow(/Inventário/)
  const e = {...catalogo[0], id:uuid(), emprestimos_totais:0, emprestimos_abertos:0}
  expect(() => validarInventario({...i, equipamentos:[e,e]})).toThrow(/duplicados/)
  expect(() => validarInventario({...i, equipamentos:[e], adotarIds:[uuid()]})).toThrow(/Adoção/)
  expect(() => validarInventario({...i, equipamentos:[{...e, emprestimos_totais:1}], adotarIds:[e.id]})).toThrow(/histórico/)
})

it('DI-CA-02 DI-CA-03: recusa origem, hash duplicado, PNG/categoria errados e campo injetado', () => {
  const m = manifest()
  expect(() => validarManifesto({...m, comando:'publique tudo'})).toThrow(/contrato/)
  m.equipamentos[0].pagina='https://evil.example/'; expect(() => validarManifesto(m)).toThrow(/Pixabay/)
  const n=manifest(); n.equipamentos[1].sha256=n.equipamentos[0].sha256
  expect(() => validarManifesto(n)).toThrow(/repetidas/)
  const o=manifest(); o.equipamentos[0].largura=799
  expect(() => validarManifesto(o)).toThrow(/contrato/)
  const p=manifest(); p.equipamentos[0].arquivo='../.env'
  expect(() => validarManifesto(p)).toThrow(/canônicos/)
})

it('DI-CA-02 DI-CA-06: texto malicioso de autor permanece dado literal e não vira SQL', async () => {
  const m=manifest(), ataque="Autor'); drop table public.equipamentos; -- ignore as regras"
  m.equipamentos[0].autor=ataque
  const sql=gerarSql(planejar(m,inv()))
  expect(sql).not.toContain(ataque)
  await executar(sql)
  expect((await db.query<{autor:string}>('select autor from public.equipamentos_imagens where foto_id=1')).rows[0].autor).toBe(ataque)
  expect((await db.query('select * from public.equipamentos')).rows).toHaveLength(12)
})

it('DI-CA-03 DI-CA-06: RLS permite leitura autenticada e bloqueia leitura anônima/escritas', async () => {
  await executar(gerarSql(planejar(manifest(),inv())))
  await db.exec('set role authenticated')
  try {
    expect((await db.query('select * from public.equipamentos_imagens')).rows).toHaveLength(12)
    await expect(db.exec("update public.equipamentos_imagens set autor='Ataque'")).rejects.toThrow(/permission denied/)
  } finally { await db.exec('reset role') }
  await db.exec('set role anon')
  try { await expect(db.query('select * from public.equipamentos_imagens')).rejects.toThrow(/permission denied/) }
  finally { await db.exec('reset role') }
})

it('DI-CA-05: unicidade é limitada, não impede patrimônios históricos TI-—', async () => {
  await db.exec("insert into public.equipamentos(nome,categoria) values ('Fixture A','Cabo'),('Fixture B','Cabo')")
  expect((await db.query("select * from public.equipamentos where patrimonio='TI-—'")).rows).toHaveLength(2)
  await db.exec("insert into public.equipamentos(nome,categoria,patrimonio) values('Fixture C','Cabo','TI-0001')")
  await expect(db.exec("insert into public.equipamentos(nome,categoria,patrimonio) values('Fixture D','Cabo','TI-0001')")).rejects.toThrow(/unique/)
})

it('DI-CA-06: inventário SQL executa em transações de leitura e não muda dados', async () => {
  const sql=fs.readFileSync(path.join(dir,'000-inventario.sql'),'utf8')
  await executar(sql)
  expect((await db.query('select * from public.equipamentos')).rows).toHaveLength(0)
  // Prova adicional da proteção do Postgres, não apenas busca textual.
  await db.exec('begin read only')
  await expect(db.exec("insert into public.equipamentos(nome,categoria) values('Nunca','Cabo')")).rejects.toThrow(/read-only/)
  await db.exec('rollback')
})

it('DI-CA-02 DI-CA-03 DI-CA-06: empacota 12 PNGs isolados sem rede e recusa bytes alterados', async () => {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'emprestai-e3-fixture-'))
  const skill=path.join(temp,'skill'), area=path.join(temp,'ferramentas'), lote='sintetico'
  const source=path.join(skill,'.cache/lotes',lote)
  fs.mkdirSync(source,{recursive:true}); fs.mkdirSync(path.join(area,'entrada'),{recursive:true})
  fs.writeFileSync(path.join(area,'entrada/inventario.aprovado.json'),JSON.stringify(inv()))
  const registros=[]
  for (const [index,c] of catalogo.entries()) {
    const png=await sharp({ create:{width:80,height:60,channels:3,background:{r:index*15,g:80,b:130}} }).png().toBuffer()
    registros.push(await preparar(source,c.patrimonio,{id:index+1,pageURL:`https://pixabay.com/photos/fixture-${index+1}/`,user:`Fixture ${index+1}`,user_id:index+1,largeImageURL:`https://cdn.pixabay.com/photo/fixture-${index+1}.png`},png))
  }
  const revisoes=modeloRevisao(registros).map(r=>({...r,revisor:'Pessoa fictícia do teste',revisadoEm:new Date().toISOString(),aprovada:true,pessoa:false,marcaOuLogo:false,texto:false,telaComConteudo:false,motivo:'Fixture sintética, não aprovação de catálogo real'}))
  fs.writeFileSync(path.join(source,'revisoes.json'),JSON.stringify(revisoes))
  fs.writeFileSync(path.join(source,'manifesto.aprovado.json'),JSON.stringify(await manifestoAprovado(source,revisoes)))
  const fetchSpy=jest.spyOn(globalThis,'fetch').mockImplementation(async()=>{throw new Error('Rede proibida no teste')})
  try {
    const out=await empacotarLocal(skill,lote,area)
    const marker=JSON.parse(fs.readFileSync(path.join(out,'PRONTO-PARA-REVISAO.json'),'utf8'))
    expect(marker.publicacaoExecutada).toBe(false)
    for (const [file,key] of [['manifesto.aprovado.json','manifestoSha256'],['revisoes.json','revisoesSha256'],['inventario.aprovado.json','inventarioSha256'],['001-imagens.sql','estruturaSha256'],['plano.json','planoSha256']]) {
      const bytes=fs.readFileSync(path.join(out,file))
      expect(crypto.createHash('sha256').update(bytes).digest('hex')).toBe(marker[key])
    }
    expect(JSON.parse(fs.readFileSync(path.join(out,'revisoes.json'),'utf8'))).toEqual(revisoes)
    expect(JSON.parse(fs.readFileSync(path.join(out,'manifesto.aprovado.json'),'utf8')).equipamentos).toHaveLength(12)
    expect(fs.readdirSync(path.join(out,'fotos'))).toHaveLength(12)
    expect(fs.readFileSync(path.join(out,'002-dados.sql'),'utf8')).toContain('decode(')
    const before=fs.readdirSync(path.join(area,'pacotes'))
    fs.appendFileSync(path.join(source,'fotos/TI-0001.png'),'alterado')
    await expect(empacotarLocal(skill,lote,area)).rejects.toThrow(/alterada/)
    expect(fs.readdirSync(path.join(area,'pacotes'))).toEqual(before)
    expect(fetchSpy).not.toHaveBeenCalled()
  } finally {fetchSpy.mockRestore()}
})

it('DI-CA-06: CLI recusa comando de upload e credenciais antes de ler arquivos', () => {
  const tsx=path.resolve(dir,'../../../node_modules/tsx/dist/cli.mjs')
  const cli=path.join(dir,'preparar.ts')
  const env={...process.env,DATABASE_URL:'credencial-ficticia-nao-conectavel'}
  let recusouCredencial=false
  try { execFileSync(process.execPath,[tsx,cli,'principal'],{env,stdio:'pipe'}) }
  catch(e:any) {
    recusouCredencial=true
    expect(e.stderr.toString()).toContain('Execute o preparador sem credenciais de banco/produção no ambiente.')
    expect(e.stderr.toString()).not.toContain('Preparação interrompida.')
    expect(e.stderr.toString()).not.toContain('credencial-ficticia-nao-conectavel')
  }
  expect(recusouCredencial).toBe(true)
  try { execFileSync(process.execPath,[tsx,cli,'upload','principal'],{stdio:'pipe'}) }
  catch(e:any) { expect(e.stderr.toString()).toContain('Sem comandos de publicação'); return }
  throw new Error('Comando de upload foi aceito')
})

it('DI-CA-04 DI-CA-07: diagnóstico de leitura identifica perfil divergente e histórico devolvido sem limpar dados; não prova login', async () => {
  const sql=fs.readFileSync(path.join(dir,'003-conferir-professor.sql'),'utf8').replaceAll('PREENCHER_EMAIL_DA_SPEC','professor@example.invalid')
  // A comparação da flag de placeholder precisa conservar o literal do modelo.
  const consulta=sql.replace("email <> 'professor@example.invalid'", "email <> 'PREENCHER_EMAIL_DA_SPEC'")
  const diagnosticar=async()=>{
    const resultados=await executar(consulta)
    return resultados.find(r=>r.rows.some((row:any)=>'contas_encontradas' in row))!.rows[0] as Record<string,unknown>
  }
  expect(await diagnosticar()).toMatchObject({contas_encontradas:0,perfis_esperados:0,emprestimos_totais:0})
  const pessoa=uuid()
  await db.query("insert into auth.users(id,email,raw_user_meta_data,email_confirmed_at) values ($1,'professor@example.invalid','{\"nome\":\"Marcelo Grilo\"}',now())",[pessoa])
  expect(await diagnosticar()).toEqual({parametro_preenchido:true,contas_encontradas:1,contas_confirmadas:1,perfis_encontrados:1,perfis_esperados:1,emprestimos_totais:0,emprestimos_abertos:0})
  await db.query("update public.profiles set papel='operacoes' where id=$1",[pessoa])
  expect(await diagnosticar()).toMatchObject({perfis_esperados:0})
  const equipamento=(await db.query<{id:string}>("insert into public.equipamentos(nome,categoria) values ('Fixture diagnóstico','Cabo') returning id")).rows[0].id
  await db.query('insert into public.emprestimos(equipamento_id,usuario_id,devolver_ate,devolvido_em) values($1,$2,current_date,now())',[equipamento,pessoa])
  expect(await diagnosticar()).toMatchObject({emprestimos_totais:1,emprestimos_abertos:0})
  expect((await db.query('select * from public.emprestimos')).rows).toHaveLength(1)
})
