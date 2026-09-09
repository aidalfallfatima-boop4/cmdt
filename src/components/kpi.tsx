import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Sparkline } from './ui'
import { num1 } from '../lib/format'
import type { Trend } from '../types'

export function TrendIndicator({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const tone = value > 0.05 ? 'text-pos' : value < -0.05 ? 'text-neg' : 'text-ink-faint'
  const Icon = value > 0.05 ? TrendingUp : value < -0.05 ? TrendingDown : Minus
  const sign = value > 0 ? '+' : ''
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums ${tone}`}>
      <Icon size={12} />
      {sign}
      {num1(value)}
      {suffix ? ` ${suffix}` : ''}
    </span>
  )
}

export function KpiCard({
  label,
  value,
  delta,
  deltaSuffix = '%',
  spark,
  sparkTone = 'flat',
  icon,
  accent = false,
  delay = 0,
}: {
  label: string
  value: string
  delta?: number
  deltaSuffix?: string
  spark?: number[]
  sparkTone?: Trend
  icon?: ReactNode
  accent?: boolean
  delay?: number
}) {
  return (
    <div
      className={`card fade-up p-3 ${accent ? 'ring-1 ring-leaf/40 bg-gradient-to-br from-surface to-posbg/40' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="stat-label">{label}</span>
        {icon && <span className="text-ink-faint">{icon}</span>}
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <span className="kpi-value min-w-0 break-words">{value}</span>
        {spark && spark.length > 1 && (
          <span className="hidden shrink-0 sm:block">
            <Sparkline data={spark} trend={sparkTone} width={72} height={22} />
          </span>
        )}
      </div>
      {delta !== undefined && (
        <div className="mt-1">
          <TrendIndicator value={delta} suffix={deltaSuffix} />
        </div>
      )}
    </div>
  )
}
