import 'reflect-metadata'
import { INestApplication, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import request from 'supertest'
import { AppController, HealthController } from './app.controller'
import { AppService } from './app.service'
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
  it('health funciona sem sessão, demais endpoints exigem token', async () => {
    await request(app.getHttpServer()).get('/api/health').expect(200, { status: 'ok' })
    await request(app.getHttpServer()).get('/api/me').expect(401)
    expect(mockGetUser).not.toHaveBeenCalled()
    expect(servico.me).not.toHaveBeenCalled()
  })
  it('token inválido é recusado antes de consultar os dados', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { status: 401 } })
    await request(app.getHttpServer()).get('/api/me').set('Authorization', 'Bearer invalido').expect(401)
    expect(servico.me).not.toHaveBeenCalled()
  })
  it('identidade vem da verificação Supabase, sem confiar no cliente', async () => {
    servico.me.mockResolvedValue({ id: pessoa, nome: 'Pessoa', papel: 'colaborador' })
    await request(app.getHttpServer()).get('/api/me').set('Authorization', 'Bearer verificado').expect(200)
    expect(mockGetUser).toHaveBeenCalledWith('verificado')
    expect(servico.me).toHaveBeenCalledWith({ id: pessoa })
  })
  it('payload inválido ou identidade injetada não chega ao serviço', async () => {
    await request(app.getHttpServer()).post('/api/emprestimos').set('Authorization', 'Bearer verificado').send({ equipamentoId: pessoa, usuarioId: pessoa }).expect(400)
    await request(app.getHttpServer()).post('/api/emprestimos/qualquer/devolucao').set('Authorization', 'Bearer verificado').send({}).expect(400)
    expect(servico.solicitar).not.toHaveBeenCalled(); expect(servico.devolver).not.toHaveBeenCalled()
  })
  it('solicitação usa UUID validado e usuário verificado', async () => {
    servico.solicitar.mockResolvedValue({ id: 'emprestimo' })
    await request(app.getHttpServer()).post('/api/emprestimos').set('Authorization', 'Bearer verificado').send({ equipamentoId: pessoa }).expect(201)
    expect(servico.solicitar).toHaveBeenCalledWith({ id: pessoa }, pessoa)
  })
})
