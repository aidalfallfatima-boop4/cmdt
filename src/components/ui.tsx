import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'
import type { PerfBand, RiskLevel, AlertSeverity, Trend } from '../types'
import { pct } from '../lib/format'

/* ------------------------------------------------------------------ Card */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="card-h">
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint ${className}`}>
      {children}
    </h2>
  )
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-serif text-xl text-navy-900 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {right && (
        <div className="flex max-w-full flex-wrap items-center gap-2 sm:justify-end">{right}</div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ Controls */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="seg max-w-full flex-wrap overflow-x-auto">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={`${o === value ? 'seg-on' : 'seg-off'} whitespace-nowrap`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function Select<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label?: string
}) {
  return (
    <label className="inline-flex min-w-0 items-center gap-2 text-xs text-ink-muted">
      {label && <span className="shrink-0 font-medium">{label}</span>}
      <select
        className="min-w-0 max-w-[60vw] rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-leaf sm:max-w-none"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/* ------------------------------------------------------------------ Badges */
const PERF_STYLES: Record<PerfBand, string> = {
  EXCELLENT: 'bg-posbg text-pos',
  BON: 'bg-posbg text-pos',
  STABLE: 'bg-infobg text-info',
  A_SURVEILLER: 'bg-warnbg text-warn',
  CRITIQUE: 'bg-negbg text-neg',
}
const PERF_LABEL: Record<PerfBand, string> = {
  EXCELLENT: 'Excellent',
  BON: 'Bon',
  STABLE: 'Stable',
  A_SURVEILLER: 'À surveiller',
  CRITIQUE: 'Critique',
}
export function PerfBadge({ band }: { band: PerfBand }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${PERF_STYLES[band]}`}>
      {PERF_LABEL[band]}
    </span>
  )
}

const RISK_STYLES: Record<RiskLevel, string> = {
  FAIBLE: 'bg-posbg text-pos',
  MODERE: 'bg-infobg text-info',
  ELEVE: 'bg-warnbg text-warn',
  CRITIQUE: 'bg-negbg text-neg',
}
const RISK_LABEL: Record<RiskLevel, string> = {
  FAIBLE: 'Faible',
  MODERE: 'Modéré',
  ELEVE: 'Élevé',
  CRITIQUE: 'Critique',
}
export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${RISK_STYLES[level]}`}>
      {RISK_LABEL[level]}
    </span>
  )
}

const SEV_STYLES: Record<AlertSeverity, string> = {
  CRITIQUE: 'bg-negbg text-neg',
  ELEVE: 'bg-warnbg text-warn',
  MOYEN: 'bg-infobg text-info',
  FAIBLE: 'bg-navy-50 text-ink-muted',
}
const SEV_LABEL: Record<AlertSeverity, string> = {
  CRITIQUE: 'Critique',
  ELEVE: 'Élevé',
  MOYEN: 'Moyen',
  FAIBLE: 'Faible',
}
export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${SEV_STYLES[severity]}`}>
      {SEV_LABEL[severity]}
    </span>
  )
}

/* ------------------------------------------------------------------ Trend */
export function TrendPct({ value, className = '' }: { value: number; className?: string }) {
  const tone = value > 0.05 ? 'text-pos' : value < -0.05 ? 'text-neg' : 'text-ink-faint'
  const Icon = value > 0.05 ? TrendingUp : value < -0.05 ? TrendingDown : Minus
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${tone} ${className}`}>
      <Icon size={13} />
      {pct(value)}
    </span>
  )
}

/* ------------------------------------------------------------------ Sparkline */
export function Sparkline({
  data,
  width = 88,
  height = 26,
  trend = 'flat',
}: {
  data: number[]
  width?: number
  height?: number
  trend?: Trend
}) {
  if (!data.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (width - 2) + 1
      const y = height - 1 - ((v - min) / span) * (height - 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const stroke = trend === 'up' ? '#1E7F53' : trend === 'down' ? '#C0392B' : '#5B6675'
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ Bar */
export function Bar({ value, max, tone = 'navy' }: { value: number; max: number; tone?: 'navy' | 'leaf' | 'neg' | 'warn' }) {
  const w = Math.max(0, Math.min(100, (value / (max || 1)) * 100))
  const bg = tone === 'leaf' ? 'bg-leaf' : tone === 'neg' ? 'bg-neg' : tone === 'warn' ? 'bg-warn' : 'bg-navy-800'
  return (
    <div className="h-2 w-full rounded-full bg-navy-50">
      <div className={`h-2 rounded-full ${bg}`} style={{ width: `${w}%` }} />
    </div>
  )
}

/* ------------------------------------------------------------------ Demo mentions */
export function DemoDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-card border border-warn/30 bg-warnbg/70 px-4 py-3 text-xs text-warn ${className}`}
    >
      <Info size={15} className="mt-0.5 shrink-0" />
      <p>
        Aide à la décision — pas de décision automatique. Les analyses, prévisions et recommandations sont produites à
        partir de <strong>données synthétiques</strong> et doivent être validées par les directions métier.
      </p>
    </div>
  )
}

export function DemoTag({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warnbg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-warn ${className}`}
    >
      Modèle simulé — Données de démonstration
    </span>
  )
}
