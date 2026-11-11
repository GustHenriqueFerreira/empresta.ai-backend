import fs from 'node:fs'
import path from 'node:path'
import { buscarFotos, baixarFoto, dentro, equipamento, equipamentos, impedirCredenciaisProducao, lerCache,
  manifestoAprovado, modeloRevisao, preparar, salvarCache, Revisao, ErroOperacional } from './pipeline'

async function main() {
  impedirCredenciaisProducao(process.env)
  const base = dentro(path.resolve(__dirname, '..'), '.cache')
  const args = process.argv.slice(2)
  let lote = 'principal'
  if (args[0] === '--lote') {
    args.shift()
    lote = args.shift() || ''
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(lote)) throw new ErroOperacional('Nome de lote inválido.')
  }
  const root = dentro(base, `lotes/${lote}`)
  const [command, patrimonio, selected, ...extra] = args
  if (extra.length || !['buscar', 'preparar', 'revisoes', 'empacotar'].includes(command)) throw new ErroOperacional('Use buscar TI-0001, preparar TI-0001 ID, revisoes ou empacotar. Não existe comando de upload.')
  if (command === 'buscar') {
    if (!patrimonio || selected) throw new ErroOperacional('Use buscar PATRIMONIO e entrada privada da chave.')
    equipamento(patrimonio)
    let fotos = lerCache(root, patrimonio)
    let key = ''
    try {
      // Consome stdin também no cache hit: o prompt humano pode reutilizar a
      // mesma entrada nos filhos sem quebrar o pipe ou disparar nova consulta.
      if (!process.stdin.isTTY) for await (const chunk of process.stdin) {
          key += chunk.toString()
          if (key.length > 1024) throw new ErroOperacional('Entrada privada acima do limite.')
      }
      if (!fotos) {
        if (process.stdin.isTTY) throw new ErroOperacional('Use scripts/buscar.ps1 para fornecer a chave privadamente.')
        fotos = await buscarFotos(patrimonio, key.trim())
        salvarCache(root, patrimonio, fotos)
      }
    } finally { key = '' }
    console.log(JSON.stringify(fotos.map(({ id, pageURL, user }) => ({ id, pagina: pageURL, autor: user })), null, 2))
  } else if (command === 'preparar') {
    if (!patrimonio || !/^\d+$/.test(selected || '')) throw new ErroOperacional('Use preparar PATRIMONIO ID da busca.')
    const fotos = lerCache(root, patrimonio)
    const foto = fotos?.find(f => f.id === Number(selected))
    if (!foto) throw new ErroOperacional('Foto não está em uma busca válida das últimas 24 horas.')
    console.log(JSON.stringify(await preparar(root, patrimonio, foto, await baixarFoto(foto)), null, 2))
  } else if (command === 'revisoes') {
    if (patrimonio || selected) throw new ErroOperacional('Use revisoes sem argumentos.')
    const records = equipamentos.map(e => JSON.parse(fs.readFileSync(dentro(root, `registros/${e.patrimonio}.json`), 'utf8')))
    const target = dentro(root, 'revisoes.json')
    fs.writeFileSync(target, JSON.stringify(modeloRevisao(records), null, 2) + '\n', { flag: 'wx' })
    console.log('Modelo de revisão criado com decisões nulas. Uma pessoa deve revisar cada PNG final e preencher o arquivo; não invente aprovações.')
  } else {
    if (patrimonio || selected) throw new ErroOperacional('Use empacotar sem argumentos.')
    const reviews: Revisao[] = JSON.parse(fs.readFileSync(dentro(root, 'revisoes.json'), 'utf8'))
    const manifest = await manifestoAprovado(root, reviews)
    const target = dentro(root, 'manifesto.aprovado.json')
    const bytes = JSON.stringify(manifest, null, 2) + '\n'
    if (fs.existsSync(target)) {
      if (fs.readFileSync(target, 'utf8') !== bytes) throw new ErroOperacional('Manifesto existente diferente. Não sobrescrever aprovações anteriores.')
    } else fs.writeFileSync(target, bytes, { flag: 'wx' })
    console.log('Manifesto validado localmente com 12 imagens. Nenhum upload foi realizado. Conferir novamente os hashes antes da operação humana na Entrega 3.')
  }
}
main().catch(error => {
  // Falhas de bibliotecas/JSON/FS não despejam conteúdo privado no terminal.
  const message = error instanceof ErroOperacional ? error.message : 'Operação local interrompida. Verifique arquivos, argumentos e pendências sem expor segredos.'
  console.error(message)
  process.exitCode = 1
})
