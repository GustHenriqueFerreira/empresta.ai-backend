import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Papel } from '../../data/mock'
import './Login.css'

interface LoginProps {
  onEntrar: (papel: Papel) => void
}

const EMAIL_PATTERN = /\S+@\S+\.\S+/

/* Tela de login — layout.md §5.1 */
export default function Login({ onEntrar }: LoginProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !senha.trim()) {
      setErro('Informe e-mail e senha para entrar.')
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErro('Informe um e-mail válido.')
      return
    }
    setErro(null)
    onEntrar('colaborador')
  }

  function entrarComoOperacoes() {
    setErro(null)
    onEntrar('operacoes')
  }

  return (
    <main className="login">
      <aside className="login-aside">
        <div className="brand brand-lg">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">
            EMPREST<span className="ai">.AI</span>
          </span>
        </div>

        <div className="login-hero">
          <h1 className="login-title">
            Empréstimos de TI
            <br />
            sem planilha
          </h1>
          <p className="lead login-lead">
            Catálogo com a situação de cada equipamento, solicitação de empréstimo e
            devolução no balcão, em um único lugar.
          </p>
        </div>

        <div className="login-stats">
          <div className="stat">
            <div className="stat-value">3 itens</div>
            <div className="stat-label">por pessoa, ao mesmo tempo</div>
          </div>
          <div className="stat">
            <div className="stat-value">14 dias</div>
            <div className="stat-label">de prazo padrão de devolução</div>
          </div>
          <div className="stat">
            <div className="stat-value">0 linhas</div>
            <div className="stat-label">para preencher no dia a dia</div>
          </div>
        </div>

        <p className="login-foot">Operações · TI interno</p>
      </aside>

      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-head">
            <h2 className="login-heading">Entrar</h2>
            <p className="lead">
              Use o e-mail do TI para entrar no catálogo e acompanhar os seus empréstimos.
            </p>
          </div>

          <div className="field">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              className="input"
              type="email"
              autoComplete="email"
              placeholder="nome@empresa.com"
              value={email}
              aria-invalid={erro && !email.trim() ? true : undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={senha}
              aria-invalid={erro && !senha.trim() ? true : undefined}
              onChange={(event) => setSenha(event.target.value)}
            />
          </div>

          {erro && (
            <p className="login-error" role="alert">
              {erro}
            </p>
          )}

          <div className="login-actions">
            <button type="submit" className="btn btn-primary btn-block login-btn">
              Entrar
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-block login-btn"
              onClick={entrarComoOperacoes}
            >
              Entrar como Operações →
            </button>
          </div>

          <p className="login-note">Cada pessoa vê apenas os próprios empréstimos.</p>
        </form>
      </section>
    </main>
  )
}
