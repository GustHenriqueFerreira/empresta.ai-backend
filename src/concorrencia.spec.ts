import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
const nomes=[
 'EM-CA-03 EM-CA-05: solicitação imediata persiste prazo e estado',
 'EM-CA-08: duas conexões disputam o mesmo item e só uma vence',
 'EM-CA-04: mesma pessoa concorre por dois itens na fronteira de três',
 'EM-CA-06 EM-CA-07: manutenção, indisponível e atraso são recusados sem novas linhas',
 'EM-CA-06: vencimento hoje não está atrasado',
 'EM-CA-09: RLS isola empréstimos e perfis em conexões autenticadas',
 'EM-CA-03: falha após inserir não deixa empréstimo parcial',
]
describe('PostgreSQL real isolado',()=>{
 let r:{casos:string[];passaram:number}
 beforeAll(()=>{r=JSON.parse(execFileSync(process.execPath,[resolve(__dirname,'../testing/conferir-regras.mjs')],{encoding:'utf8',timeout:180000,stdio:['ignore','pipe','pipe']}))},185000)
 it.each(nomes)('%s',nome=>{expect(r.casos).toContain(nome);expect(r.passaram).toBe(7)})
})
