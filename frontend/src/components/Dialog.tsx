import type { MouseEvent } from 'react'

export interface ResumoLinha {
  rotulo: string
  valor: string
}

interface DialogProps {
  aberto: boolean
  titulo: string
  corpo?: string
  resumo?: ResumoLinha[]
  rotuloConfirmar: string
  onConfirmar: () => void
  onFechar: () => void
}

/* Modal do design system — layout.md §5.6: 420px, backdrop sem animação, resumo com
   valor em destaque no acento. Clique fora fecha; clique dentro não fecha
   (só fecha quando o alvo do clique é o próprio backdrop). */
export default function Dialog({
  aberto,
  titulo,
  corpo,
  resumo,
  rotuloConfirmar,
  onConfirmar,
  onFechar,
}: DialogProps) {
  if (!aberto) return null

  function aoClicarFora(evento: MouseEvent<HTMLDivElement>) {
    if (evento.target === evento.currentTarget) onFechar()
  }

  return (
    <div className="backdrop" onClick={aoClicarFora}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <h2 className="dialog-title" id="dialog-title">
          {titulo}
        </h2>
        {corpo && <p className="dialog-body">{corpo}</p>}
        {resumo && resumo.length > 0 && (
          <div className="summary">
            {resumo.map((linha) => (
              <div className="summary-row" key={linha.rotulo}>
                <span className="k">{linha.rotulo}</span>
                <span className="v">{linha.valor}</span>
              </div>
            ))}
          </div>
        )}
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onFechar}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirmar}>
            {rotuloConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
