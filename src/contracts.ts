import { BadRequestException } from '@nestjs/common'
import { z } from 'zod'

export const uuid = z.uuid()
export const solicitacaoSchema = z.object({ equipamentoId: uuid }).strict()
export const equipamentoSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do equipamento').max(200),
  categoria: z.enum(['Notebook', 'Monitor', 'Cabo', 'Câmera', 'Acessório']),
  patrimonio: z.string().trim().max(100).optional().transform(v => v || 'TI-—'),
  observacoes: z.string().trim().max(2000).optional(),
  situacao: z.enum(['disponivel', 'manutencao']),
}).strict()

export function validar<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success) throw new BadRequestException('Dados inválidos. Verifique os campos informados.')
  return result.data
}

export interface Identidade { id: string }
export interface Perfil { id: string; nome: string; papel: string }

export function hojeBrasilia(agora = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora)
}

// Apenas mensagens operacionais conhecidas podem sair do banco para o cliente.
export const errosNegocio = [
  'Equipamento não encontrado.', 'Equipamento em manutenção.', 'Equipamento indisponível.',
  'Você tem item em atraso. Devolva antes de pedir outro.', 'Você já está com 3 itens emprestados.',
  'Empréstimo não encontrado.', 'Empréstimo já devolvido.',
  'Somente quem está com o item ou Operações pode registrar a devolução.',
]
