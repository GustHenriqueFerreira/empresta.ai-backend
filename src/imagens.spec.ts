import { imagemPublica } from './imagens'
const foto = { equipamento_id:'11111111-1111-4111-8111-111111111111',bucket:'equipamentos-pratica',
  caminho:`pratica-2026/TI-0001/${'a'.repeat(64)}.png`,largura:800,altura:600,sha256:'a'.repeat(64),
  fornecedor:'pixabay',foto_id:1n,pagina_origem:'https://pixabay.com/photos/fixture-1/',autor:'Autor fixture',
  autor_id:1n,licenca_url:'https://pixabay.com/service/license-summary/',origem_arquivo:'https://cdn.pixabay.com/photo/fixture.png',obtida_em:new Date() }
it('EM-CA-01 EM-CA-02: projeta URL pública, origem e autor sem BigInt ou informação privada',()=>{
  const resultado=imagemPublica(foto,'https://abcdefghijklmnopqrst.supabase.co')
  expect(resultado).toEqual({url:`https://abcdefghijklmnopqrst.supabase.co/storage/v1/object/public/equipamentos-pratica/${foto.caminho}`,
    autor:'Autor fixture',pagina:foto.pagina_origem,fornecedor:'pixabay',licenca:foto.licenca_url,largura:800,altura:600,ilustrativa:true})
  expect(()=>JSON.stringify(resultado)).not.toThrow()
  expect(resultado).not.toHaveProperty('equipamento_id')
  expect(resultado).not.toHaveProperty('origem_arquivo')
})
it('EM-CA-02 EM-CA-10: metadado inválido não vira URL externa ou javascript no catálogo',()=>{
  for(const origem of ['http://abcdefghijklmnopqrst.supabase.co','https://evil.example','https://a:b@abcdefghijklmnopqrst.supabase.co']) expect(imagemPublica(foto,origem)).toBeNull()
  expect(imagemPublica({...foto,pagina_origem:'javascript:alert(1)'},'https://abcdefghijklmnopqrst.supabase.co')).toBeNull()
  expect(imagemPublica({...foto,caminho:'../segredo'},'https://abcdefghijklmnopqrst.supabase.co')).toBeNull()
  expect(imagemPublica(null,'https://abcdefghijklmnopqrst.supabase.co')).toBeNull()
})
