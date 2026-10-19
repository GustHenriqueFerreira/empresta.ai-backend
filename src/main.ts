import 'dotenv/config'
import 'reflect-metadata'
import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppController, HealthController } from './app.controller'
import { AppService } from './app.service'
import { AuthGuard } from './auth.guard'
import { DatabaseService } from './database.service'

@Module({ controllers: [HealthController, AppController], providers: [AppService, AuthGuard, DatabaseService] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn'] })
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] })
  app.enableShutdownHooks()
  await app.listen(Number(process.env.PORT || 3001), '127.0.0.1')
}

bootstrap().catch(() => { console.error('Não foi possível iniciar a API. Verifique a configuração e a porta.'); process.exitCode = 1 })
