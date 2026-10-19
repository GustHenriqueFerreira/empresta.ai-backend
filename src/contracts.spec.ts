import { equipamentoSchema, solicitacaoSchema, hojeBrasilia, validar } from './contracts'

describe('Contratos e datas de negócio', () => {
  it('recusa patrimônio excessivo, categoria desconhecida e situação emprestado no cadastro', () => {
    const base = { nome: 'Monitor', categoria: 'Monitor', situacao: 'disponivel' }
    expect(equipamentoSchema.safeParse({ ...base, patrimonio: 'a'.repeat(101) }).success).toBe(false)
    expect(equipamentoSchema.safeParse({ ...base, categoria: 'Outro' }).success).toBe(false)
    expect(equipamentoSchema.safeParse({ ...base, situacao: 'emprestado' }).success).toBe(false)
  })
  it('normaliza nome e aplica patrimônio padrão', () => {
    expect(equipamentoSchema.parse({ nome: ' Monitor ', categoria: 'Monitor', situacao: 'manutencao', patrimonio: ' ' })).toMatchObject({ nome: 'Monitor', patrimonio: 'TI-—' })
  })
  it('recusa nome vazio e tentativa de escolher usuário da solicitação', () => {
    expect(() => validar(equipamentoSchema, { nome: ' ', categoria: 'Cabo', situacao: 'disponivel' })).toThrow()
    expect(solicitacaoSchema.safeParse({ equipamentoId: '11111111-1111-4111-8111-111111111111', usuarioId: 'terceiro' }).success).toBe(false)
    expect(solicitacaoSchema.safeParse({ equipamentoId: 'id-invalido' }).success).toBe(false)
  })
  it('usa o dia de Brasília na virada UTC', () => {
    expect(hojeBrasilia(new Date('2026-10-20T01:00:00Z'))).toBe('2026-10-19')
    expect(hojeBrasilia(new Date('2026-10-20T03:00:00Z'))).toBe('2026-10-20')
  })
})
