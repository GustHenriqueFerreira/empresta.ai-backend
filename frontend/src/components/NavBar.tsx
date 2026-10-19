import type { Papel, Usuario } from '../data/mock'

export type Aba = 'catalogo' | 'meus' | 'operacoes' | 'equipamentos'

/* Abas por papel — layout.md §6 / rules/business-rules.md 6. */
const ABAS: Record<Papel, Array<[Aba, string]>> = {
  colaborador: [
    ['catalogo', 'Catálogo'],
    ['meus', 'Meus empréstimos'],
  ],
  operacoes: [
    ['catalogo', 'Catálogo'],
    ['operacoes', 'Operações'],
    ['equipamentos', 'Equipamentos'],
    ['meus', 'Meus empréstimos'],
  ],
}

interface NavBarProps {
  papel: Papel
  abaAtiva: Aba
  usuario: Usuario
  onAba: (aba: Aba) => void
  onSair: () => void
}

/* Barra de navegação — layout.md §6: sticky 60px, abas por papel, papel + avatar + nome + "Sair". */
export default function NavBar({ papel, abaAtiva, usuario, onAba, onSair }: NavBarProps) {
  return (
    <nav className="nav">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">
          EMPREST<span className="ai">.AI</span>
        </span>
      </div>
      <div className="nav-tabs">
        {ABAS[papel].map(([id, rotulo]) => (
          <button
            key={id}
            type="button"
            className={`tab${id === abaAtiva ? ' active' : ''}`}
            onClick={() => onAba(id)}
          >
            {rotulo}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <span className="tag-outline">{papel === 'operacoes' ? 'Operações' : 'Colaborador'}</span>
        <span className="avatar" aria-hidden="true">
          {usuario.iniciais}
        </span>
        <span className="nav-user">{usuario.nome}</span>
        <button type="button" className="nav-exit" onClick={onSair}>
          Sair
        </button>
      </div>
    </nav>
  )
}
