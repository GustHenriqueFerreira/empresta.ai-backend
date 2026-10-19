import 'dotenv/config'
import 'reflect-metadata'
import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppController, HealthController } from './app.controller'
import { AppService } from './app.service'
import { AuthGuard } from './auth.guard'
import { DatabaseService } from './database.service'
import { diagnosticoSeguro, lerCertificado, SafeLogger, validarAmbiente } from './startup'

@Module({ controllers: [HealthController, AppController], providers: [AppService, AuthGuard, DatabaseService] })
class AppModule {}

async function bootstrap() {
  validarAmbiente()
  lerCertificado()
  const app = await NestFactory.create(AppModule, { logger: new SafeLogger(), abortOnError: false })
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] })
  if (!process.env.VERCEL) app.enableShutdownHooks()
  await app.listen(Number(process.env.PORT || 3001))
}

bootstrap().catch(erro => { console.error(diagnosticoSeguro(erro)); process.exitCode = 1 })
