import { Injectable, OnModuleDestroy, ServiceUnavailableException, ConflictException, HttpException } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Identidade, errosNegocio } from './contracts'
import { lerCertificado } from './startup'

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly prisma: PrismaClient

  constructor() {
    if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL no backend/.env.')
    const ca = lerCertificado()
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true, ca }, connectionTimeoutMillis: 10000, max: 5 })
    this.prisma = new PrismaClient({ adapter, log: [] })
  }

  async comoUsuario<T>(usuario: Identidade, executar: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    try {
      return await this.prisma.$transaction(async tx => {
        // SET LOCAL evita vazar papel/claims entre requisições no pool.
        await tx.$executeRawUnsafe('SET LOCAL ROLE authenticated')
        await tx.$queryRaw`SELECT set_config('request.jwt.claims', ${JSON.stringify({ sub: usuario.id, role: 'authenticated' })}, true)`
        return executar(tx)
      }, { maxWait: 10000, timeout: 15000 })
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : ''
      const negocio = errosNegocio.find(texto => mensagem.includes(texto))
      if (negocio) throw new ConflictException(negocio)
      // Preserva exceções HTTP intencionais sem expor mensagens de SQL/driver.
      if (e instanceof HttpException) throw e
      throw new ServiceUnavailableException('Não foi possível acessar os dados. Tente novamente.')
    }
  }

  async onModuleDestroy() { await this.prisma.$disconnect() }
}
