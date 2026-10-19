import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Request } from 'express'
import type { Identidade } from './contracts'

export interface AuthRequest extends Request { usuario: Identidade }

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly auth: SupabaseClient
  constructor() {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) throw new Error('Configure SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY.')
    this.auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>()
    const match = req.headers.authorization?.match(/^Bearer ([^\s]+)$/i)
    if (!match) throw new UnauthorizedException('Sessão necessária. Entre novamente.')
    const { data, error } = await this.auth.auth.getUser(match[1])
    if (error && (!error.status || error.status >= 500)) throw new ServiceUnavailableException('Não foi possível verificar a sessão. Tente novamente.')
    if (error || !data.user) throw new UnauthorizedException('Sua sessão expirou. Entre novamente.')
    req.usuario = { id: data.user.id }
    return true
  }
}
