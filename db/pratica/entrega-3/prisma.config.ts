// Validação isolada: não importa dotenv, não carrega .env nem gera cliente.
import { defineConfig } from 'prisma/config'
export default defineConfig({ schema: './schema-proposto.prisma' })
