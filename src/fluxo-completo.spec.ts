import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
const nomes=[
 'EM-CA-05: servidor persiste prazo em fronteiras Brasília, ano, fevereiro bissexto e dias corridos',
 'EM-CA-07: POST manipulado atravessa guard, controller, serviço, Prisma e SQL sem emprestar manutenção ou item alheio',
 'EM-CA-09: rota real de próprios empréstimos ignora identidade adulterada e não expõe dados da outra sessão',
]
describe('Fluxo HTTP e persistência real isolada',()=>{
 let r:{casos:string[];passaram:number}
 beforeAll(()=>{r=JSON.parse(execFileSync(process.execPath,['--import','tsx',resolve(__dirname,'../testing/conferir-fluxo-completo.mjs')],{encoding:'utf8',timeout:180000,stdio:['ignore','pipe','pipe']}))},185000)
 it.each(nomes)('%s',nome=>{expect(r.casos).toContain(nome);expect(r.passaram).toBe(3)})
})
