import { useCallback, useEffect, useRef, useState } from 'react'
import Login from './features/login/Login'
import Catalogo from './features/catalogo/Catalogo'
import NavBar from './components/NavBar'
import type { Aba } from './components/NavBar'
import { USUARIO_EXEMPLO } from './data/mock'
import type { Papel, Usuario } from './data/mock'
import { Toast } from './components/Toast'

/* Toast sai automaticamente em 2600ms — layout.md §8 */
const TOAST_DURATION_MS = 2600

interface Sessao {
  papel: Papel
  usuario: Usuario
  aba: Aba
}

/* Sessão mínima em memória + troca de tela por estado — layout.md §6: sem rotas aninhadas. */
export default function App() {
  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const notify = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  function entrar(papel: Papel) {
    /* Destino por papel — layout.md §6. A tela Operações (destino definitivo do
       papel Operações) fica para a spec 04; desvio temporário registrado em
       docs/specs/02-catalogo.md. */
    setSessao({ papel, usuario: USUARIO_EXEMPLO, aba: 'catalogo' })
  }

  function sair() {
    setSessao(null)
  }

  function abrirAba(aba: Aba) {
    if (aba === 'catalogo') {
      setSessao((atual) => (atual ? { ...atual, aba } : atual))
      return
    }
    notify('Tela ainda não incluída nesta versão.')
  }

  return (
    <>
      {sessao ? (
        <>
          <NavBar
            papel={sessao.papel}
            abaAtiva={sessao.aba}
            usuario={sessao.usuario}
            onAba={abrirAba}
            onSair={sair}
          />
          <Catalogo onNotify={notify} />
        </>
      ) : (
        <Login onEntrar={entrar} />
      )}
      <Toast message={toast} />
    </>
  )
}

