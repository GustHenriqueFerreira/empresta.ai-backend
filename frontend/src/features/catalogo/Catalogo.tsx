import { useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import Dialog from '../../components/Dialog'
import { EQUIPAMENTOS_INICIAIS, USUARIO_EXEMPLO } from '../../data/mock'
import type { Equipamento } from '../../data/mock'
import { prazoPadrao } from '../../utils/datas'
import './Catalogo.css'

type Filtro = 'todos' | 'disponiveis' | 'emprestados' | 'manutencao'

const FILTROS: Array<[Filtro, string]> = [
  ['todos', 'Todos'],
  ['disponiveis', 'Disponíveis'],
  ['emprestados', 'Emprestados'],
  ['manutencao', 'Em manutenção'],
]

/* Limite de 3 itens por pessoa ao mesmo tempo — layout.md §7.4. */
const LIMITE_ITENS = 3

interface CardProps {
  item: Equipamento
  /* Motivo do bloqueio do botão "Solicitar" (limite de 3 ou atraso); null = livre. */
  bloqueio: string | null
  onSolicitar: (item: Equipamento) => void
}

/* Card — layout.md §5.2: kicker · nome · patrimônio · pill à direita · detalhe (min-height 18px) · botão. */
function Card({ item, bloqueio, onSolicitar }: CardProps) {
  const detalhe: ReactNode =
    item.situacao === 'disponivel'
      ? 'Pronto para retirada no balcão'
      : item.situacao === 'emprestado'
        ? (
          <>
            {item.comigo ? 'Com você' : `Com ${item.dono}`} · devolver até{' '}
            <span className="due">{item.devolverAte}</span>
          </>
        )
        : item.observacao

  const botao: ReactNode =
    item.situacao === 'disponivel' ? (
      <button
        type="button"
        className={`btn ${bloqueio ? 'btn-secondary' : 'btn-primary'} btn-block`}
        disabled={bloqueio !== null}
        onClick={() => onSolicitar(item)}
      >
        {bloqueio ?? 'Solicitar'}
      </button>
    ) : item.situacao === 'emprestado' ? (
      <button type="button" className="btn btn-secondary btn-block" disabled>
        {item.comigo ? 'Está com você' : 'Emprestado'}
      </button>
    ) : (
      <button type="button" className="btn btn-secondary btn-block" disabled>
        Indisponível
      </button>
    )

  return (
    <article className="card">
      <div className="card-top">
        <span className="kicker">{item.categoria}</span>
        <span className={`pill pill-${item.situacao}`}>
          {item.situacao === 'disponivel'
            ? 'Disponível'
            : item.situacao === 'emprestado'
              ? 'Emprestado'
              : 'Em manutenção'}
        </span>
      </div>
      <h3 className="card-title">{item.nome}</h3>
      <span className="patrimonio">{item.patrimonio}</span>
      <div className="detail">{detalhe}</div>
      {botao}
    </article>
  )
}

/* Tela de Catálogo — layout.md §5.2; interações e regras em §7. */
export default function Catalogo({ onNotify }: { onNotify: (message: string) => void }) {
  const [itens, setItens] = useState<Equipamento[]>(EQUIPAMENTOS_INICIAIS)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [pendente, setPendente] = useState<Equipamento | null>(null)

  const meus = itens.filter((item) => item.comigo)
  const emAtraso = meus.some((item) => item.emAtraso)
  const disponiveis = itens.filter((item) => item.situacao === 'disponivel').length

  /* Bloqueios de §7.4 (limite 3) e §7.5 (atraso) aplicados no botão "Solicitar". */
  const bloqueio = emAtraso
    ? 'Bloqueado por atraso'
    : meus.length >= LIMITE_ITENS
      ? 'Limite de 3 itens'
      : null

  /* Busca por nome + patrimônio, case-insensitive, e filtro exclusivo — layout.md §7.8/§7.9. */
  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return itens.filter((item) => {
      if (filtro === 'disponiveis' && item.situacao !== 'disponivel') return false
      if (filtro === 'emprestados' && item.situacao !== 'emprestado') return false
      if (filtro === 'manutencao' && item.situacao !== 'manutencao') return false
      if (
        termo &&
        !item.nome.toLowerCase().includes(termo) &&
        !item.patrimonio.toLowerCase().includes(termo)
      ) {
        return false
      }
      return true
    })
  }, [itens, busca, filtro])

  function confirmarSolicitacao() {
    if (!pendente) return
    /* "Devolver até" = hoje + 14 dias — layout.md §7.1. */
    const devolverAte = prazoPadrao()
    setItens((atuais) =>
      atuais.map((item) =>
        item.id === pendente.id
          ? { ...item, situacao: 'emprestado', comigo: true, dono: USUARIO_EXEMPLO.nome, devolverAte }
          : item,
      ),
    )
    setPendente(null)
    onNotify(`Empréstimo registrado. Devolva até ${devolverAte}.`)
  }

  return (
    <>
      <main className="page">
        <div className="page-body">
          <div className="page-head">
            <div className="head-left">
              <h1>Catálogo</h1>
              <p className="lead">
                {disponiveis} de {itens.length} equipamentos disponíveis agora
              </p>
            </div>
            <div className="search">
              <input
                className="input"
                type="text"
                placeholder="Buscar por nome ou patrimônio"
                aria-label="Buscar equipamento"
                value={busca}
                onChange={(evento: ChangeEvent<HTMLInputElement>) => setBusca(evento.target.value)}
              />
            </div>
          </div>

          {/* Banner de bloqueio por atraso — layout.md §1/§7.5, dirigido por dados (§9 parte em dia). */}
          {emAtraso && (
            <div className="banner">
              <span>Você tem um item em atraso. Devolva-o para solicitar novos empréstimos.</span>
              <button
                type="button"
                className="btn-danger"
                onClick={() => onNotify('Tela ainda não incluída nesta versão.')}
              >
                Ver meus empréstimos
              </button>
            </div>
          )}

          <div className="chips">
            {FILTROS.map(([id, rotulo]) => (
              <button
                key={id}
                type="button"
                className={`chip${filtro === id ? ' active' : ''}`}
                onClick={() => setFiltro(id)}
              >
                {rotulo}
              </button>
            ))}
          </div>

          {visiveis.length ? (
            <section className="grid">
              {visiveis.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  bloqueio={item.situacao === 'disponivel' ? bloqueio : null}
                  onSolicitar={setPendente}
                />
              ))}
            </section>
          ) : (
            <div className="empty">Nenhum equipamento encontrado para a busca ou o filtro atual.</div>
          )}
        </div>
      </main>

      {/* Modal de solicitação — layout.md §5.6/§7.1. */}
      <Dialog
        aberto={pendente !== null}
        titulo="Solicitar empréstimo"
        corpo="O item fica registrado no seu nome e conta para o limite de 3 empréstimos simultâneos."
        resumo={
          pendente
            ? [
                { rotulo: 'Equipamento', valor: pendente.nome },
                { rotulo: 'Devolver até', valor: prazoPadrao() },
              ]
            : []
        }
        rotuloConfirmar="Solicitar"
        onConfirmar={confirmarSolicitacao}
        onFechar={() => setPendente(null)}
      />
    </>
  )
}
