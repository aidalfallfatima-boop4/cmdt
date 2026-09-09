import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { PRIMARY_NAV, SECONDARY_NAV, TITLES } from '../config/nav'
import { PRODUCT } from '../config/weights'
import { useAuth, ROLE_LABELS } from '../auth'
import { NOTIFICATIONS } from '../data/narrative'

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-leaf">
        <span className="font-serif text-lg font-bold text-navy-950">C</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">CMDT AI</p>
          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">Intelligence Décisionnelle</p>
        </div>
      )}
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      <div>
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">Pilotage</p>
        <ul className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="w-5 text-[10px] font-mono text-white/35">{item.no}</span>
                <item.icon size={16} className="shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">Contexte</p>
        <ul className="space-y-0.5">
          {SECONDARY_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? 'bg-white/10 font-semibold text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="w-5" />
                <item.icon size={16} className="shrink-0" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function SidebarFooter() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  if (!session) return null
  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-md px-2 py-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-white">
          {session.name.split(' ').map((p) => p[0]).join('')}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-white">{session.name}</p>
          <p className="truncate text-[11px] text-white/50">{ROLE_LABELS[session.role]}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          title="Déconnexion"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  )
}

function NotificationCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-11 z-40 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-card border border-line bg-surface shadow-pop">
        <div className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">Notifications</div>
        <ul className="max-h-96 divide-y divide-line overflow-y-auto">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className={`px-4 py-3 ${n.unread ? 'bg-navy-50/40' : ''}`}>
              <p className="text-xs text-ink">{n.text}</p>
              <p className="mt-1 text-[11px] text-ink-faint">{n.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function Layout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = NOTIFICATIONS.filter((n) => n.unread).length
  const title = TITLES[location.pathname] ?? (location.pathname.startsWith('/secteurs/') ? 'Fiche secteur' : 'CMDT AI')

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy-950 lg:flex">
        <div className="px-5 py-4">
          <Logo />
        </div>
        <SidebarNav />
        <SidebarFooter />
      </aside>

      {/* Sidebar mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-navy-950">
            <div className="flex items-center justify-between px-5 py-4">
              <Logo />
              <button type="button" onClick={() => setMobileOpen(false)} className="text-white/60">
                <X size={20} />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:px-8">
          <button type="button" onClick={() => setMobileOpen(true)} className="text-ink-muted lg:hidden">
            <Menu size={20} />
          </button>
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="hidden text-ink-faint sm:inline">CMDT AI</span>
            <ChevronRight size={14} className="hidden shrink-0 text-ink-faint sm:inline" />
            <span className="truncate font-medium text-ink">{title}</span>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="hidden rounded-full border border-line bg-canvas px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted sm:inline-flex">
              Prototype · Données synthétiques
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative rounded-md p-2 text-ink-muted hover:bg-navy-50"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-neg text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
              <NotificationCenter open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] flex-1 overflow-x-clip px-4 py-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-line px-4 py-4 text-center text-[11px] text-ink-faint lg:px-8">
          <span className="font-semibold text-ink-muted">{PRODUCT.name}</span> · {PRODUCT.tagline} · {PRODUCT.org} ·{' '}
          {PRODUCT.disclaimer} · {PRODUCT.version}
        </footer>
      </div>
    </div>
  )
}
