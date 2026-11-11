// Lote provisório pedido pelo responsável. Não aprova imagens nem publica.
// Escolha finita de 12 candidatas de consultas existentes, sem novas buscas/API key.
import fs from 'node:fs'
import path from 'node:path'
import sharp from '../skills/imagens-equipamentos/node_modules/sharp'
import { baixarFoto, dentro, equipamentos, impedirCredenciaisProducao, lerCache,
  modeloRevisao, preparar, ErroOperacional } from '../skills/imagens-equipamentos/scripts/pipeline'

const selecionadas: Record<string, number> = {
  'TI-0001':7188564, 'TI-0002':791032, 'TI-0003':886462, 'TI-0004':594090,
  'TI-0005':4532323, 'TI-0006':1868496, 'TI-0007':1867762, 'TI-0008':643728,
  'TI-0009':7066127, 'TI-0010':494649, 'TI-0011':1155173, 'TI-0012':2364849,
}
async function main() {
  impedirCredenciaisProducao(process.env)
  const skill=path.resolve(__dirname,'../skills/imagens-equipamentos')
  const original=dentro(skill,'.cache/lotes/principal')
  const destino=dentro(skill,'.cache/lotes/provisorio-e3-20261111')
  const fotos=equipamentos.map(item=>{
    const foto=lerCache(original,item.patrimonio)?.find(f=>f.id===selecionadas[item.patrimonio])
    if(!foto) throw new ErroOperacional('Candidata ausente ou cache expirado. Não criar aprovação ou nova busca automaticamente.')
    return foto
  })
  if(new Set(fotos.map(f=>f.id)).size!==12) throw new ErroOperacional('Seleção duplicada.')
  const registros=[]
  for(const [i,item] of equipamentos.entries()) {
    registros.push(await preparar(destino,item.patrimonio,fotos[i],await baixarFoto(fotos[i])))
    console.log(item.patrimonio+': candidata provisória preparada; sem aprovação.')
  }
  const write=(name:string,value:string|Buffer)=>{
    const file=dentro(destino,name)
    if(fs.existsSync(file)) return // Preservar qualquer prova/revisão já existente.
    fs.writeFileSync(file,value,{flag:'wx'})
  }
  write('revisoes.json',JSON.stringify(modeloRevisao(registros),null,2)+'\n')
  write('PROVISORIO.json',JSON.stringify({versao:1,finalidade:'Prévia pedida pelo responsável; não é manifesto aprovado',
    fotos:12,aprovacoesHumanas:0,publicado:false,manifestoEmitido:false,
    aviso:'Equipamento/conteúdo podem não satisfazer o contrato. Revisão específica continua necessária.',
    escolhas:registros.map(r=>({patrimonio:r.patrimonio,fotoId:r.fotoId,arquivo:r.arquivo,sha256:r.sha256}))},null,2)+'\n')
  const tiles: {input:Buffer,left:number,top:number}[]=[]
  for(const [i,r] of registros.entries()) {
    const image=await sharp(fs.readFileSync(dentro(destino,r.arquivo))).resize(240,180).png().toBuffer()
    const label=Buffer.from(`<svg width="240" height="40"><rect width="240" height="40" fill="#232532"/><text x="8" y="16" font-family="Arial" font-size="13" fill="#e9e9ed">${r.patrimonio} · foto ${r.fotoId}</text><text x="8" y="33" font-family="Arial" font-size="11" fill="#e9e9ed">PROVISÓRIA · NÃO APROVADA</text></svg>`)
    const left=(i%4)*240,top=Math.floor(i/4)*220
    tiles.push({input:image,left,top},{input:label,left,top:top+180})
  }
  write('previa.png',await sharp({create:{width:960,height:660,channels:3,background:'#161826'}}).composite(tiles).png().toBuffer())
  console.log('12 candidatas locais, revisão nula, sem manifesto aprovado e sem publicação.')
}
main().catch(e=>{
  console.error(e instanceof ErroOperacional ? e.message : 'Preparo provisório interrompido. Evidências parciais preservadas; nenhum segredo ou publicação.')
  process.exitCode=1
})
