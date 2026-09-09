/*
 * Authentification SIMULÉE — prototype uniquement.
 * Phase 2 : annuaire d'entreprise / SSO, MFA, RBAC côté serveur, journal d'audit,
 * expiration de session et rotation de jetons. Aucun secret ne doit vivre côté client.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from './types'

export const DEMO_PASSWORD = '1234'
const SESSION_KEY = 'cmdtai.session'

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrateur',
  DIRECTION_GENERALE: 'Direction Générale',
  DIRECTION_PRODUCTION_AGRICOLE: 'Direction de la Production Agricole',
  DIRECTION_INDUSTRIELLE: 'Direction Industrielle',
  DIRECTION_COMMERCIALE: 'Direction Commerciale',
  DIRECTION_FINANCIERE: 'Direction Financière',
  DIRECTEUR_FILIALE: 'Directeur de Filiale',
  ANALYSTE: 'Analyste',
}

export const DEFAULT_NAME: Record<Role, string> = {
  ADMIN: 'A. Traoré',
  DIRECTION_GENERALE: 'N. Coulibaly',
  DIRECTION_PRODUCTION_AGRICOLE: 'F. Diarra',
  DIRECTION_INDUSTRIELLE: 'S. Keïta',
  DIRECTION_COMMERCIALE: 'M. Sangaré',
  DIRECTION_FINANCIERE: 'B. Touré',
  DIRECTEUR_FILIALE: 'O. Dembélé',
  ANALYSTE: 'K. Sidibé',
}

export interface Session {
  name: string
  role: Role
}

interface AuthContextValue {
  session: Session | null
  login: (password: string, role?: Role) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: (password, role = 'DIRECTION_GENERALE') =>
        new Promise<boolean>((resolve) => {
          setTimeout(() => {
            if (password !== DEMO_PASSWORD) {
              resolve(false)
              return
            }
            const s: Session = { name: DEFAULT_NAME[role], role }
            try {
              sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
            } catch {
              /* ignore */
            }
            setSession(s)
            resolve(true)
          }, 450)
        }),
      logout: () => {
        try {
          sessionStorage.removeItem(SESSION_KEY)
        } catch {
          /* ignore */
        }
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}
