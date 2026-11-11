import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
const raiz=path.resolve(import.meta.dirname,'..'),sha=b=>createHash('sha256').update(b).digest('hex')
let falhas=0
for(const repo of ['backend','frontend']){
 const cwd=path.join(raiz,repo),git=args=>execFileSync('git',args,{cwd,maxBuffer:16*1024*1024})
 const arquivos=git(['diff','--cached','--name-only','-z']).toString().split('\0').filter(Boolean)
 for(const p of arquivos){
  if(/(^|\/)(node_modules|dist|\.cache|\.vercel)\/|(^|\/)\.env($|\.)/.test(p)&&!p.endsWith('.env.example')){console.error(repo+': arquivo indevido '+p);falhas++;continue}
  if(/\.png$/.test(p))continue
  const t=git(['show',':'+p]).toString().replaceAll('postgresql://user:secret@example.invalid/postgres','FIXTURE')
  if(/sb_secret_[\w-]+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|postgres(?:ql)?:\/\/[^\s:/]+:[^\s@]+@/.test(t)){console.error(repo+': revisar possível segredo em '+p);falhas++}
 }
 const base='docs/pratica/parte2',m=JSON.parse(fs.readFileSync(path.join(cwd,base,'manifesto.json'),'utf8'))
 for(const f of m.arquivos){const p=base+'/workspace/'+f.caminho;if(sha(git(['show',':'+p]))!==f.sha256){console.error(repo+': hash do índice diverge '+p);falhas++}}
 const entrega=git(['show',':ENTREGA.md']).toString()
 for(const [,alvo]of entrega.matchAll(/\]\(([^)]+)\)/g)){if(/^(https?:|#)/.test(alvo))continue;if(!fs.existsSync(path.join(cwd,alvo))){console.error(repo+': link local ausente '+alvo);falhas++}}
 console.log(repo+': '+arquivos.length+' arquivos do índice; '+m.arquivos.length+' hashes do espelho; links locais conferidos.')
}
if(falhas)process.exitCode=1;else console.log('Publicação conferida: sem ambiente/cache/credencial privada detectado; hashes preservados no Git.')
