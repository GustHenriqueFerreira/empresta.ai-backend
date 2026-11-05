import 'reflect-metadata'
import { INestApplication, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import request from 'supertest'
import { AppController, HealthController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseService } from './database.service'
import { AuthGuard } from './auth.guard'

const mockGetUser = jest.fn()
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({ auth: { getUser: (...args: unknown[]) => mockGetUser(...args) } }) }))
const pessoa = '11111111-1111-4111-8111-111111111111'
const servico = { me: jest.fn(), solicitar: jest.fn(), cadastrar: jest.fn(), devolver: jest.fn() }
@Module({ controllers: [HealthController, AppController], providers: [AuthGuard, { provide: AppService, useValue: servico }] })
class TestModule {}

describe('Contratos HTTP e identidade', () => {
  let app: INestApplication
  beforeAll(async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_PUBLISHABLE_KEY = 'public-test-key'
    app = await NestFactory.create(TestModule, { logger: false })
    await app.init()
  })
  afterAll(async () => { await app.close() })
  beforeEach(() => { jest.clearAllMocks(); mockGetUser.mockResolvedValue({ data: { user: { id: pessoa } }, error: null }) })
  it('CA-01: health funciona sem sessão, demais endpoints exigem token', async () => {
    await request(app.getHttpServer()).get('/api/health').expect(200, { status: 'ok' })
    await request(app.getHttpServer()).get('/api/me').expect(401)
    expect(mockGetUser).not.toHaveBeenCalled()
    expect(servico.me).not.toHaveBeenCalled()
  })
  it('CA-01: token inválido é recusado antes de consultar os dados', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { status: 401 } })
    await request(app.getHttpServer()).get('/api/me').set('Authorization', 'Bearer invalido').expect(401)
    expect(servico.me).not.toHaveBeenCalled()
  })
  it('CA-01: identidade vem da verificação Supabase, sem confiar no cliente', async () => {
    servico.me.mockResolvedValue({ id: pessoa, nome: 'Pessoa', papel: 'colaborador' })
    await request(app.getHttpServer()).get('/api/me').set('Authorization', 'Bearer verificado').expect(200)
    expect(mockGetUser).toHaveBeenCalledWith('verificado')
    expect(servico.me).toHaveBeenCalledWith({ id: pessoa })
  })
  it('CA-03 CA-04: payload inválido ou identidade injetada não chega ao serviço', async () => {
    await request(app.getHttpServer()).post('/api/emprestimos').set('Authorization', 'Bearer verificado').send({ equipamentoId: pessoa, usuarioId: pessoa }).expect(400)
    await request(app.getHttpServer()).post('/api/emprestimos/qualquer/devolucao').set('Authorization', 'Bearer verificado').send({}).expect(400)
    expect(servico.solicitar).not.toHaveBeenCalled(); expect(servico.devolver).not.toHaveBeenCalled()
  })
  it('CA-03: solicitação usa UUID validado e usuário verificado', async () => {
    servico.solicitar.mockResolvedValue({ id: 'emprestimo' })
    await request(app.getHttpServer()).post('/api/emprestimos').set('Authorization', 'Bearer verificado').send({ equipamentoId: pessoa }).expect(201)
    expect(servico.solicitar).toHaveBeenCalledWith({ id: pessoa }, pessoa)
  })
})

// Exercita guard, controller e serviço reais; só a persistência é isolada.
const txColaborador = { profile: { findUnique: jest.fn() }, equipamento: { create: jest.fn() }, emprestimo: { findMany: jest.fn() } }
const dbColaborador = { comoUsuario: jest.fn((_usuario, executar) => executar(txColaborador)) }
@Module({ controllers: [AppController], providers: [AuthGuard, AppService, { provide: DatabaseService, useValue: dbColaborador }] })
class AutorizacaoModule {}

describe('CA-05: autorização pelas rotas reais', () => {
  let app: INestApplication
  beforeAll(async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_PUBLISHABLE_KEY = 'public-test-key'
    app = await NestFactory.create(AutorizacaoModule, { logger: false })
    await app.init()
  })
  afterAll(async () => { await app.close() })
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: pessoa } }, error: null })
    txColaborador.profile.findUnique.mockResolvedValue({ id: pessoa, nome: 'Pessoa', papel: 'colaborador' })
  })
  it('CA-05: colaborador recebe 403 ao chamar Operações diretamente', async () => {
    await request(app.getHttpServer()).get('/api/operacoes').set('Authorization', 'Bearer verificado').expect(403).expect(({ body }) => {
      expect(body.message).toBe('Acesso permitido somente a Operações.')
    })
    expect(txColaborador.emprestimo.findMany).not.toHaveBeenCalled()
  })
  it('CA-05: colaborador recebe 403 ao cadastrar equipamento diretamente', async () => {
    await request(app.getHttpServer()).post('/api/equipamentos').set('Authorization', 'Bearer verificado')
      .send({ nome: 'Cabo de teste', categoria: 'Cabo', situacao: 'disponivel' }).expect(403).expect(({ body }) => {
        expect(body.message).toBe('Acesso permitido somente a Operações.')
      })
    expect(txColaborador.equipamento.create).not.toHaveBeenCalled()
  })
})
