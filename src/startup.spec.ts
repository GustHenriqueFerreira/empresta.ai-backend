import { mkdtempSync, rmdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { diagnosticoSeguro, lerCertificado, SafeLogger, validarAmbiente } from './startup'

const ambiente = { DATABASE_URL: 'postgresql://user:secret@example.invalid/postgres', SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'public-test-key' }

describe('Inicialização em hospedagem', () => {
  it('aponta só o nome da configuração ausente, sem imprimir valores', () => {
    try { validarAmbiente({ ...ambiente, DATABASE_URL: '' }); throw new Error('esperava falha') }
    catch (e) { expect(diagnosticoSeguro(e)).toBe('CONFIGURACAO_AUSENTE: Configuração ausente: DATABASE_URL') }
  })
  it('não vaza URL inválida recebida na configuração', () => {
    try { validarAmbiente({ ...ambiente, SUPABASE_URL: 'senha-secreta' }); throw new Error('esperava falha') }
    catch (e) { const texto = diagnosticoSeguro(e); expect(texto).toContain('SUPABASE_URL'); expect(texto).not.toContain('senha-secreta') }
  })
  it('encontra a CA na raiz do pacote, independente do diretório do código', () => {
    expect(lerCertificado()).toContain('BEGIN CERTIFICATE')
  })
  it('explica certificado ausente em fixture isolada', () => {
    const pasta = mkdtempSync(join(tmpdir(), 'emprestai-ca-'))
    const cwd = jest.spyOn(process, 'cwd').mockReturnValue(pasta)
    try {
      expect(() => lerCertificado()).toThrow()
      try { lerCertificado() } catch (e) { expect(diagnosticoSeguro(e)).toContain('CERTIFICADO_AUSENTE') }
    } finally { cwd.mockRestore(); rmdirSync(pasta) }
  })
  it('não imprime erro bruto de biblioteca ou stack pelo logger', () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {})
    try {
      new SafeLogger().error(new Error(ambiente.DATABASE_URL), 'Bearer senha-secreta')
      expect(log).toHaveBeenCalledWith('Não foi possível iniciar a API [ERRO_INTERNO]')
    } finally { log.mockRestore() }
  })
  it('processo compilado encerra com diagnóstico seguro se falta DATABASE_URL', () => {
    const r = spawnSync(process.execPath, ['dist/main.js'], { env: { ...process.env, DATABASE_URL: '', SUPABASE_URL: ambiente.SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY: ambiente.SUPABASE_PUBLISHABLE_KEY }, encoding: 'utf8', timeout: 10000 })
    expect(r.status).toBe(1)
    expect(r.stderr).toContain('CONFIGURACAO_AUSENTE')
    expect(r.stderr).not.toContain(ambiente.SUPABASE_PUBLISHABLE_KEY)
  })
  it('processo compilado informa CA ausente quando executado sem o arquivo distribuído', () => {
    const pasta = mkdtempSync(join(tmpdir(), 'emprestai-dist-'))
    try {
      const r = spawnSync(process.execPath, [resolve('dist/main.js')], { cwd: pasta, env: { ...process.env, ...ambiente }, encoding: 'utf8', timeout: 10000 })
      expect(r.status).toBe(1)
      expect(r.stderr).toContain('CERTIFICADO_AUSENTE')
      expect(r.stderr).not.toContain(ambiente.DATABASE_URL)
    } finally { rmdirSync(pasta) }
  })
})
