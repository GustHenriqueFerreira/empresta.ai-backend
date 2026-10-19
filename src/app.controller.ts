import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard, AuthRequest } from './auth.guard'
import { equipamentoSchema, solicitacaoSchema, uuid, validar } from './contracts'

@Controller('api')
export class HealthController {
  @Get('health') health() { return { status: 'ok' } }
}

@Controller('api')
@UseGuards(AuthGuard)
export class AppController {
  constructor(@Inject(AppService) private readonly app: AppService) {}
  @Get('me') me(@Req() req: AuthRequest) { return this.app.me(req.usuario) }
  @Get('equipamentos') equipamentos(@Req() req: AuthRequest) { return this.app.equipamentos(req.usuario) }
  @Get('emprestimos/meus') meus(@Req() req: AuthRequest) { return this.app.meus(req.usuario) }
  @Post('emprestimos') solicitar(@Req() req: AuthRequest, @Body() body: unknown) {
    return this.app.solicitar(req.usuario, validar(solicitacaoSchema, body).equipamentoId)
  }
  @Post('emprestimos/:id/devolucao') devolver(@Req() req: AuthRequest, @Param('id') id: string) { return this.app.devolver(req.usuario, validar(uuid, id)) }
  @Get('operacoes') operacoes(@Req() req: AuthRequest) { return this.app.operacoes(req.usuario) }
  @Post('equipamentos') cadastrar(@Req() req: AuthRequest, @Body() body: unknown) { return this.app.cadastrar(req.usuario, validar(equipamentoSchema, body)) }
}
