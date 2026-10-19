import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DatabaseService } from './database.service'
import { equipamentoSchema, hojeBrasilia, Identidade, Perfil } from './contracts'
import { z } from 'zod'

@Injectable()
export class AppService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  private async perfil(tx: Prisma.TransactionClient, usuario: Identidade): Promise<Perfil> {
    const perfil = await tx.profile.findUnique({ where: { id: usuario.id } })
    if (!perfil) throw new NotFoundException('Perfil não encontrado. Procure o responsável pelo sistema.')
    return perfil
  }

  private async exigirOperacoes(tx: Prisma.TransactionClient, usuario: Identidade) {
    if ((await this.perfil(tx, usuario)).papel !== 'operacoes') throw new ForbiddenException('Acesso permitido somente a Operações.')
  }

  me(usuario: Identidade) {
    return this.db.comoUsuario(usuario, async tx => {
      const perfil = await this.perfil(tx, usuario)
      return { ...perfil, iniciais: perfil.nome.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase() }
    })
  }

  equipamentos(usuario: Identidade) {
    return this.db.comoUsuario(usuario, async tx => {
      await this.perfil(tx, usuario)
      // Relação emprestimos é filtrada por RLS; terceiros não são projetados no catálogo.
      const equipamentos = await tx.equipamento.findMany({ orderBy: { criado_em: 'desc' }, include: { emprestimos: { where: { usuario_id: usuario.id, devolvido_em: null } } } })
      return equipamentos.map(({ emprestimos, ...item }) => ({ ...item, comigo: emprestimos.length > 0, devolverAte: emprestimos[0]?.devolver_ate.toISOString().slice(0, 10), emAtraso: !!emprestimos[0] && emprestimos[0].devolver_ate.toISOString().slice(0, 10) < hojeBrasilia() }))
    })
  }

  meus(usuario: Identidade) {
    return this.db.comoUsuario(usuario, async tx => {
      await this.perfil(tx, usuario)
      const emprestimos = await tx.emprestimo.findMany({ where: { usuario_id: usuario.id, devolvido_em: null }, include: { equipamento: true }, orderBy: { devolver_ate: 'asc' } })
      return emprestimos.map(e => ({ ...e, emAtraso: e.devolver_ate.toISOString().slice(0, 10) < hojeBrasilia() }))
    })
  }

  solicitar(usuario: Identidade, equipamentoId: string) {
    return this.db.comoUsuario(usuario, async tx => {
      await this.perfil(tx, usuario)
      const [resultado] = await tx.$queryRaw<{ id: string }[]>`SELECT public.solicitar_emprestimo(${equipamentoId}::uuid) AS id`
      return tx.emprestimo.findUniqueOrThrow({ where: { id: resultado.id } })
    })
  }

  devolver(usuario: Identidade, id: string) {
    return this.db.comoUsuario(usuario, async tx => {
      await this.perfil(tx, usuario)
      await tx.$queryRaw`SELECT public.devolver_emprestimo(${id}::uuid)::text AS resultado`
      return { mensagem: 'Devolução registrada.' }
    })
  }

  operacoes(usuario: Identidade) {
    return this.db.comoUsuario(usuario, async tx => {
      await this.exigirOperacoes(tx, usuario)
      const emprestimos = await tx.emprestimo.findMany({ where: { devolvido_em: null }, include: { equipamento: true, usuario: { select: { nome: true } } }, orderBy: { devolver_ate: 'asc' } })
      const linhas = emprestimos.map(e => ({ ...e, emAtraso: e.devolver_ate.toISOString().slice(0, 10) < hojeBrasilia() }))
      return { emprestimos: linhas, indicadores: { abertos: linhas.length, atrasados: linhas.filter(e => e.emAtraso).length, disponiveis: await tx.equipamento.count({ where: { situacao: 'disponivel' } }), manutencao: await tx.equipamento.count({ where: { situacao: 'manutencao' } }) } }
    })
  }

  cadastrar(usuario: Identidade, dados: z.output<typeof equipamentoSchema>) {
    return this.db.comoUsuario(usuario, async tx => {
      await this.exigirOperacoes(tx, usuario)
      return tx.equipamento.create({ data: dados })
    })
  }
}
