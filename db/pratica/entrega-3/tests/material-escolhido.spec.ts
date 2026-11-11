import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { prepararMaterialEscolhido } from '../../../../../agents/preparar-material-escolhido-e3'

const area=path.resolve(__dirname,'../.cache')
const raiz=path.resolve(__dirname,'../../../../..')
const material=path.join(raiz,'backend/db/pratica/entrega-3/material')
const digest=(b:Buffer)=>crypto.createHash('sha256').update(b).digest('hex')
jest.setTimeout(180000)

it('DI-CA-02 DI-CA-06: caminho de escolhas empacota os 12 bytes reais offline sem fabricar aprovação visual',async()=>{
  fs.mkdirSync(area,{recursive:true})
  const fixture=fs.mkdtempSync(path.join(area,'escolha-'))
  const gravar=(nome:string,b:Buffer|string)=>{const alvo=path.join(fixture,nome);fs.mkdirSync(path.dirname(alvo),{recursive:true});fs.writeFileSync(alvo,b)}
  const manifesto=JSON.parse(fs.readFileSync(path.join(material,'manifesto.escolhido-com-ressalvas.json'),'utf8'))
  const plano=JSON.parse(fs.readFileSync(path.join(material,'plano.json'),'utf8'))
  gravar('backend/db/pratica/entrega-3/001-imagens.sql',fs.readFileSync(path.join(raiz,'backend/db/pratica/entrega-3/001-imagens.sql')))
  // Inventário sintético explicitamente separado do recibo real; nenhuma data do deploy é adulterada.
  gravar('docs/pratica/entrega-3-dados-prova/inventario-consulta-20261111-072047.json',JSON.stringify({projeto:'abcdefghijklmnopqrst',observadoEm:new Date().toISOString(),equipamentos:[]}))
  const lote='skills/imagens-equipamentos/.cache/lotes/provisorio-e3-20261111/'
  for(const r of manifesto.equipamentos){
    gravar(lote+'registros/'+r.patrimonio+'.json',JSON.stringify(r))
    gravar(lote+r.arquivo,fs.readFileSync(path.join(material,plano.equipamentos.find((p:any)=>p.patrimonio===r.patrimonio).imagem.caminho)))
  }
  const rede=jest.spyOn(global,'fetch').mockImplementation(()=>Promise.reject(Error('Rede não permitida neste teste')))
  try{
    const resultado=await prepararMaterialEscolhido(fixture)
    expect(resultado).toMatchObject({fotos:12,aplicado:false,aprovacaoVisualOriginal:false})
    const escolhas=JSON.parse(fs.readFileSync(path.join(resultado.pasta,'manifesto.escolhido-com-ressalvas.json'),'utf8'))
    expect(escolhas.aprovacaoVisualOriginal).toBe(false)
    expect(escolhas.ressalva).toContain('pessoas/marcas/textos')
    const gerado=JSON.parse(fs.readFileSync(path.join(resultado.pasta,'plano.json'),'utf8'))
    expect(gerado.equipamentos).toHaveLength(12)
    expect(new Set(gerado.equipamentos.map((e:any)=>e.imagem.sha256)).size).toBe(12)
    for(const e of gerado.equipamentos)expect(digest(fs.readFileSync(path.join(resultado.pasta,e.imagem.caminho)))).toBe(e.imagem.sha256)
    const meta=JSON.parse(fs.readFileSync(path.join(resultado.pasta,'MATERIAL-PARA-REVISAO.json'),'utf8'))
    expect(meta.aprovadoVisualmente).toBe(false)
    expect(digest(fs.readFileSync(path.join(resultado.pasta,'000-aplicar-pratica.sql')))).toBe(meta.aplicacaoSqlSha256)
    expect(rede).not.toHaveBeenCalled()
    const alterado=manifesto.equipamentos[0]
    gravar(lote+alterado.arquivo,Buffer.from('bytes diferentes'))
    await expect(prepararMaterialEscolhido(fixture)).rejects.toThrow()
    expect(fs.readdirSync(path.join(fixture,'backend/db/pratica/entrega-3/pacotes'))).toHaveLength(1)
  }finally{
    rede.mockRestore()
    if(!fixture.startsWith(area+path.sep))throw Error('Fixture fora da área isolada')
    fs.rmSync(fixture,{recursive:true})
  }
})

it('DI-CA-06: caminho de escolhas recusa credencial de produção antes de ler entradas',async()=>{
  const anterior=process.env.DATABASE_URL
  process.env.DATABASE_URL='fixture-nao-conectavel'
  try{await expect(prepararMaterialEscolhido(path.join(area,'nao-existe'))).rejects.toThrow('Execute o preparador sem credenciais de banco/produção no ambiente.')}
  finally{if(anterior===undefined)delete process.env.DATABASE_URL;else process.env.DATABASE_URL=anterior}
})

it('DI-CA-01 DI-CA-02 DI-CA-05 DI-CA-07: SQL exato versionado preserva DEMO e IDs em PostgreSQL 16 isolado',()=>{
  const resultado=JSON.parse(execFileSync(process.execPath,[path.join(raiz,'backend/testing/conferir-material.mjs'),'db/pratica/entrega-3/material'],{cwd:path.join(raiz,'backend'),encoding:'utf8',timeout:160000,stdio:['ignore','pipe','pipe']}))
  expect(resultado).toMatchObject({passou:true,producao:false,equipamentos:16,imagens:12,aprovacaoVisual:false})
})
