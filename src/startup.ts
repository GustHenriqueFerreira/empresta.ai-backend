import { ConsoleLogger } from '@nestjs/common'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const variaveis = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'] as const
type Variavel = typeof variaveis[number]
type Falha = 'CONFIGURACAO_AUSENTE' | 'CONFIGURACAO_INVALIDA' | 'CERTIFICADO_AUSENTE'

export class StartupError extends Error {
  constructor(public readonly codigo: Falha, public readonly variavel?: Variavel) {
    super(codigo)
  }
}

export function validarAmbiente(env: NodeJS.ProcessEnv = process.env) {
  for (const nome of variaveis) {
    if (!env[nome]?.trim()) throw new StartupError('CONFIGURACAO_AUSENTE', nome)
  }
  for (const nome of ['DATABASE_URL', 'SUPABASE_URL'] as const) {
    try {
      const url = new URL(env[nome]!)
      if (nome === 'DATABASE_URL' ? !['postgres:', 'postgresql:'].includes(url.protocol) : !['https:', 'http:'].includes(url.protocol)) throw new Error()
    } catch { throw new StartupError('CONFIGURACAO_INVALIDA', nome) }
  }
}

export function lerCertificado(raiz = process.cwd()): string {
  try { return readFileSync(join(raiz, 'certs', 'supabase-ca.crt'), 'utf8') }
  catch { throw new StartupError('CERTIFICADO_AUSENTE') }
}

export function diagnosticoSeguro(erro: unknown): string {
  if (erro instanceof StartupError) {
    if (erro.codigo === 'CERTIFICADO_AUSENTE') return 'CERTIFICADO_AUSENTE: Certificado do banco não encontrado na distribuição'
    return `${erro.codigo}: Configuração ${erro.codigo === 'CONFIGURACAO_AUSENTE' ? 'ausente' : 'inválida'}: ${erro.variavel}`
  }
  const codigo = erro && typeof erro === 'object' && 'code' in erro ? erro.code : undefined
  const permitidos = ['EADDRINUSE', 'EACCES', 'ENOENT', 'ENOTFOUND', 'ETIMEDOUT']
  return `Não foi possível iniciar a API [${typeof codigo === 'string' && permitidos.includes(codigo) ? codigo : 'ERRO_INTERNO'}]`
}

// Nest pode receber mensagens de SDKs contendo URLs/segredos. Nunca imprimir
// mensagens brutas ou stack; o catch de bootstrap fornece o diagnóstico seguro.
export class SafeLogger extends ConsoleLogger {
  error(message: unknown, ..._optionalParams: unknown[]) {
    console.error(diagnosticoSeguro(message))
  }
}
