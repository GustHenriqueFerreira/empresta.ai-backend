/* Dados de exemplo — layout.md §9. Em memória até a integração com o backend (Prisma). */

export type Papel = 'colaborador' | 'operacoes'

export type Situacao = 'disponivel' | 'emprestado' | 'manutencao'

export interface Usuario {
  nome: string
  iniciais: string
}

export interface Equipamento {
  id: number
  nome: string
  categoria: string
  patrimonio: string
  situacao: Situacao
  /* Detalhe do card em manutenção — observação do cadastro (layout.md §5.2). */
  observacao?: string
  /* Nome de quem está com o item (layout.md §7.7). */
  dono?: string
  /* Item está com o usuário da sessão (layout.md §7.7). */
  comigo?: boolean
  /* "Devolver até" do item emprestado, em DD/MM/AAAA (layout.md §9). */
  devolverAte?: string
  /**
   * Empréstimo do usuário em atraso (layout.md §7.5). Nos dados de exemplo é
   * fixo (§9: "2 de 3 slots da Ana ocupados e em dia"); com backend, deriva
   * de data < hoje.
   */
  emAtraso?: boolean
}

export const USUARIO_EXEMPLO: Usuario = { nome: 'Ana Ribeiro', iniciais: 'AR' }

/* Estado inicial do §9: 4 disponíveis, 2 em manutenção, 2 com a Ana (em dia). */
export const EQUIPAMENTOS_INICIAIS: Equipamento[] = [
  { id: 1, nome: 'Notebook Dell Latitude 5450', categoria: 'Notebook', patrimonio: 'TI-0142', situacao: 'disponivel' },
  { id: 2, nome: 'MacBook Pro 14 M3', categoria: 'Notebook', patrimonio: 'TI-0088', situacao: 'emprestado', dono: 'Marcos Lemos', devolverAte: '07/09/2026' },
  { id: 3, nome: 'Monitor LG 27" 4K', categoria: 'Monitor', patrimonio: 'TI-0231', situacao: 'disponivel' },
  { id: 4, nome: 'Monitor Dell 24" FHD', categoria: 'Monitor', patrimonio: 'TI-0233', situacao: 'manutencao', observacao: 'Painel com falha, retorna em 05/09' },
  { id: 5, nome: 'Câmera Sony ZV-1', categoria: 'Câmera', patrimonio: 'TI-0301', situacao: 'emprestado', dono: 'Ana Ribeiro', comigo: true, devolverAte: '12/09/2026' },
  { id: 6, nome: 'Cabo HDMI 2.1 3m', categoria: 'Cabo', patrimonio: 'TI-0455', situacao: 'disponivel' },
  { id: 7, nome: 'Dock Thunderbolt 4', categoria: 'Acessório', patrimonio: 'TI-0512', situacao: 'emprestado', dono: 'Ana Ribeiro', comigo: true, devolverAte: '05/09/2026' },
  { id: 8, nome: 'Tripé Manfrotto Befree', categoria: 'Acessório', patrimonio: 'TI-0318', situacao: 'manutencao', observacao: 'Trava do centro quebrada' },
  { id: 9, nome: 'Headset Jabra Evolve2', categoria: 'Acessório', patrimonio: 'TI-0402', situacao: 'disponivel' },
]
