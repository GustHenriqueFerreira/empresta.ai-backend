import { AppService } from './app.service'
import { DatabaseService } from './database.service'

describe('Autorização e privacidade na API', () => {
  const pessoa = { id: '11111111-1111-4111-8111-111111111111' }
  const tx = { profile: { findUnique: jest.fn() }, equipamento: { create: jest.fn(), findMany: jest.fn() }, emprestimo: { findMany: jest.fn() } }
  const db = { comoUsuario: jest.fn((_p, fn) => fn(tx)) }
  const app = new AppService(db as unknown as DatabaseService)
  beforeEach(() => { jest.clearAllMocks(); tx.profile.findUnique.mockResolvedValue({ ...pessoa, nome: 'Pessoa', papel: 'colaborador' }) })

  it('nega cadastro e visão de Operações para colaborador', async () => {
    await expect(app.operacoes(pessoa)).rejects.toMatchObject({ status: 403 })
    await expect(app.cadastrar(pessoa, { nome: 'Cabo', categoria: 'Cabo', patrimonio: 'TI-—', situacao: 'disponivel' })).rejects.toMatchObject({ status: 403 })
    expect(tx.equipamento.create).not.toHaveBeenCalled()
    expect(tx.emprestimo.findMany).not.toHaveBeenCalled()
  })
  it('filtra empréstimos pelo usuário verificado e somente abertos', async () => {
    tx.emprestimo.findMany.mockResolvedValue([])
    await expect(app.meus(pessoa)).resolves.toEqual([])
    expect(tx.emprestimo.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { usuario_id: pessoa.id, devolvido_em: null } }))
  })
  it('catálogo não projeta nome ou prazo de terceiro', async () => {
    tx.equipamento.findMany.mockResolvedValue([{ id: 'item', situacao: 'emprestado', emprestimos: [] }])
    const [item] = await app.equipamentos(pessoa)
    expect(item).toMatchObject({ comigo: false, emAtraso: false })
    expect(item.devolverAte).toBeUndefined()
    expect(tx.equipamento.findMany).toHaveBeenCalledWith(expect.objectContaining({ include: { emprestimos: { where: { usuario_id: pessoa.id, devolvido_em: null } } } }))
  })
  it('perfil ausente exige ação do responsável em vez de usuário fictício', async () => {
    tx.profile.findUnique.mockResolvedValue(null)
    await expect(app.me(pessoa)).rejects.toMatchObject({ status: 404 })
  })
})
