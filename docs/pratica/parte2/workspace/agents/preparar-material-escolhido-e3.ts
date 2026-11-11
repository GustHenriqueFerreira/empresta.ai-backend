// Preparação offline das fotos que o responsável insistiu em manter.
// Não gera aprovação visual, não carrega .env, não escreve em Auth/Storage/banco.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from '../skills/imagens-equipamentos/node_modules/sharp'
import { dentro, impedirCredenciaisProducao } from '../skills/imagens-equipamentos/scripts/pipeline'
import { catalogo, planejar, gerarSql, validarManifesto } from '../backend/db/pratica/entrega-3/preparar'
const sha=(b:Buffer)=>crypto.createHash('sha256').update(b).digest('hex')
export async function prepararMaterialEscolhido(raiz=path.resolve(__dirname,'..')){
 impedirCredenciaisProducao(process.env)
 const lote=dentro(raiz,'skills/imagens-equipamentos/.cache/lotes/provisorio-e3-20261111')
 const fonte=dentro(raiz,'docs/pratica/entrega-3-dados-prova/inventario-consulta-20261111-072047.json')
 const observado=JSON.parse(fs.readFileSync(fonte,'utf8'))
 // Timestamp retornado por clock_timestamp() na própria consulta READ ONLY.
 const referencia=observado.observadoEm
 const inventario={versao:1,projeto:observado.projeto,observadoEm:referencia,
  aprovadoPor:'Responsável escolheu Supabase atual; inventário lido pelo principal',destinoConfirmado:true,
  catalogoExatoConfirmado:true,preservarHistorico:true,adotarIds:[],equipamentos:observado.equipamentos}
 const registros=catalogo.map(c=>JSON.parse(fs.readFileSync(dentro(lote,`registros/${c.patrimonio}.json`),'utf8')))
 const m=validarManifesto({versao:1,fornecedor:'pixabay',credito:{texto:'Fotos: Pixabay',url:'https://pixabay.com/'},equipamentos:registros})
 const imagens:Buffer[]=[]
 for(const r of m.equipamentos){
  const b=fs.readFileSync(dentro(lote,r.arquivo)),meta=await sharp(b).metadata()
  if(sha(b)!==r.sha256||meta.width!==800||meta.height!==600||meta.format!=='png'||b.length>5*1024*1024)throw new Error('Imagem local fora do contrato técnico')
  imagens.push(b)
 }
 const plano=planejar(m,inventario),base=dentro(raiz,'backend/db/pratica/entrega-3/pacotes')
 fs.mkdirSync(base,{recursive:true});const destino=dentro(base,`escolhido-${Date.now()}`);fs.mkdirSync(destino)
 const write=(nome:string,b:Buffer|string)=>fs.writeFileSync(dentro(destino,nome),b,{flag:'wx'})
 const estrutura=fs.readFileSync(dentro(raiz,'backend/db/pratica/entrega-3/001-imagens.sql'),'utf8'),dadosSql=gerarSql(plano)
 const corpoSql=(s:string)=>s.replace(/^begin;\r?$/gim,'').replace(/^commit;\r?$/gim,'')
 const combinado='-- APLICAÇÃO HUMANA: projeto mvoswngmnsfxcecucrys.\n-- Adiciona 12 itens/fotos e preserva DEMO/histórico; nenhuma conta criada.\nbegin;\n'+corpoSql(estrutura)+'\n'+corpoSql(dadosSql)+'\ncommit;\n'
 write('000-aplicar-pratica.sql',combinado)
 write('001-imagens.sql',estrutura)
 write('002-dados.sql',dadosSql)
 write('inventario.json',JSON.stringify(inventario,null,2)+'\n')
 write('plano.json',JSON.stringify(plano,null,2)+'\n')
 write('manifesto.escolhido-com-ressalvas.json',JSON.stringify({...m,
  escolhaUsuario:'por favor vai essa imagem mesmo',aprovacaoVisualOriginal:false,
  ressalva:'Algumas fotos contêm pessoas/marcas/textos ou outro tipo de item. Escolha mantida pelo responsável; não comprova conformidade visual ao enunciado.'},null,2)+'\n')
 for(const [i,e] of plano.equipamentos.entries()){
  const pasta=dentro(destino,path.dirname(e.imagem.caminho));fs.mkdirSync(pasta,{recursive:true});write(e.imagem.caminho,imagens[i])
 }
 write('LEIA-ANTES.md','# Aplicação humana, fotos escolhidas com ressalvas\n\nAs imagens foram mantidas pelo responsável apesar das divergências visuais. A conta do professor foi dispensada; não será criada.\n\n1. Conferir projeto/inventário.\n2. Revisar 000-aplicar-pratica.sql e executar pelo humano uma vez no SQL Editor; estrutura e dados ficam na mesma transação.\n3. Criar bucket equipamentos-pratica público sem escrita de clientes.\n4. Enviar a pasta pratica-2026 preservando seus subdiretórios.\n5. Conferir URLs/hashes e repetir somente 002-dados.sql para provar idempotência, sem refazer DDL.\n6. Conferir funcionamento em conta própria e guardar provas sem senha/token.\n\nNão apagar DEMO-* nem empréstimos. SQL falha inteiro em conflito. Não reexecutar DDL existente. Estado de banco/Storage/login não é comprovado por este pacote local.\n')
 write('MATERIAL-PARA-REVISAO.json',JSON.stringify({geradoEm:new Date().toISOString(),projeto:plano.projeto,fotos:12,
  inventarioFonteSha256:sha(fs.readFileSync(fonte)),sqlSha256:sha(Buffer.from(dadosSql)),aplicacaoSqlSha256:sha(Buffer.from(combinado)),
  aprovadoVisualmente:false,aplicado:false,publicado:false,contaProfessor:'dispensada pelo responsável'},null,2)+'\n')
 return {pasta:destino,fotos:12,aplicado:false,aprovacaoVisualOriginal:false}
}
if(require.main===module)prepararMaterialEscolhido().then(r=>console.log(JSON.stringify(r))).catch(()=>{console.error('Material interrompido. Conferir entradas; nenhum segredo/produção foi acessado.');process.exitCode=1})
