import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../auth'

const SECURITY = [
  'Transport chiffré (TLS)',
  'Contrôle d\'accès basé sur les rôles (RBAC)',
  'MFA & SSO — Phase 2',
  'Journal d\'audit des consultations et recommandations',
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(false)
    const ok = await login(password, 'DIRECTION_GENERALE')
    setBusy(false)
    if (ok) navigate(from, { replace: true })
    else setError(true)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Volet marque */}
      <div
        className="relative hidden flex-col justify-between bg-navy-950 p-10 text-white lg:flex"
        style={{
          backgroundImage:
            'linear-gradient(rgba(8,22,41,0.92),rgba(8,22,41,0.92)), repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(31,122,77,0.18) 39px), repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(31,122,77,0.18) 39px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-leaf">
            <span className="font-serif text-lg font-bold text-navy-950">C</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">CMDT AI</p>
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">Intelligence Décisionnelle</p>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl leading-tight">Accès sécurisé à la plateforme de pilotage</h2>
          <ul className="mt-6 space-y-3">
            {SECURITY.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-sm text-white/70">
                <ShieldCheck size={16} className="text-leaf" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/40">Compagnie Malienne pour le Développement des Textiles (CMDT)</p>
      </div>

      {/* Volet formulaire */}
      <div className="flex items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-sm">
          <div className="card p-6">
            <div className="flex items-center gap-3 border-b border-line pb-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-navy-50 text-sm font-semibold text-navy-900">
                NC
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink">N. Coulibaly</p>
                <p className="text-xs text-ink-muted">Direction Générale · CMDT</p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="stat-label">Mot de passe</span>
                <div className="mt-1.5 flex items-center rounded-md border border-line bg-surface focus-within:border-leaf">
                  <Lock size={15} className="mx-3 text-ink-faint" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent py-2 text-sm outline-none"
                    placeholder="••••"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} className="px-3 text-ink-faint hover:text-ink">
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </label>

              {error && <p className="text-xs font-medium text-neg">Mot de passe incorrect.</p>}

              <button type="submit" className="btn-primary w-full justify-center" disabled={busy}>
                {busy ? 'Connexion…' : 'Se connecter'}
                {!busy && <ArrowRight size={15} />}
              </button>
            </form>

            <div className="mt-4 rounded-md bg-warnbg px-3 py-2.5 text-xs text-warn">
              Prototype — authentification simulée. Mot de passe : <strong>1234</strong>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-ink-faint">
            <Link to="/accueil" className="hover:text-ink">
              ← Retour à la présentation
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
