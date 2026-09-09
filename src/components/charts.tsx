import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
} from 'recharts'
import type { RiskItem } from '../types'
import { compact, num, num1 } from '../lib/format'

export const CHART_COLORS = {
  NAVY: '#0B1F3A',
  LEAF: '#1F7A4D',
  POS: '#1E7F53',
  NEG: '#C0392B',
  INFO: '#1F5FA8',
  SOIL: '#B5651D',
} as const

const AXIS = { fontSize: 11, fill: '#8A94A3' }
const GRID = '#E4E7EC'

const tipStyle = {
  border: '1px solid #E4E7EC',
  borderRadius: 8,
  fontSize: 12,
  boxShadow: '0 12px 32px rgba(8,22,41,0.18)',
}

function fmt(v: number, unit?: string): string {
  if (unit === 'FCFA') return compact(v)
  return num1(v)
}

/* ------------------------------------------------------------------ LineTrend */
export function LineTrend({
  data,
  dataKey,
  label,
  unit,
  height = 240,
  color = CHART_COLORS.NAVY,
}: {
  data: { label: string; [k: string]: number | string }[]
  dataKey: string
  label?: string
  unit?: string
  height?: number
  color?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => compact(Number(v))} />
        <Tooltip
          contentStyle={tipStyle}
          formatter={(v: number) => [fmt(v, unit), label ?? dataKey]}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ MultiLine */
export function MultiLine({
  data,
  series,
  height = 260,
}: {
  data: { label: string; [k: string]: number | string }[]
  series: { key: string; label: string; color: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => compact(Number(v))} />
        <Tooltip contentStyle={tipStyle} formatter={(v: number, n) => [num1(v), n]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            name={s.label}
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ RecettesCouts */
export function RecettesCouts({
  data,
  height = 280,
}: {
  data: { label: string; recettes: number; couts: number; marge: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis yAxisId="l" tick={AXIS} tickLine={false} axisLine={false} width={52} tickFormatter={(v) => compact(Number(v))} />
        <YAxis
          yAxisId="r"
          orientation="right"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v) => `${num1(Number(v))} %`}
        />
        <Tooltip
          contentStyle={tipStyle}
          formatter={(v: number, n) => (n === 'Marge %' ? [`${num1(v)} %`, n] : [compact(v), n])}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="l" name="Recettes" dataKey="recettes" fill={CHART_COLORS.LEAF} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Bar yAxisId="l" name="Coûts" dataKey="couts" fill={CHART_COLORS.SOIL} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Line yAxisId="r" name="Marge %" type="monotone" dataKey="marge" stroke={CHART_COLORS.NAVY} strokeWidth={2} dot={false} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ BudgetVsActual */
export function BudgetVsActual({
  data,
  height = 280,
}: {
  data: { label: string; budget: number; couts: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={52} tickFormatter={(v) => compact(Number(v))} />
        <Tooltip contentStyle={tipStyle} formatter={(v: number, n) => [compact(v), n]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="Budget" dataKey="budget" fill="#C7D2DF" radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Bar name="Réalisé" dataKey="couts" fill={CHART_COLORS.NAVY} radius={[3, 3, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ ForecastChart */
export function ForecastChart({
  history,
  forecast,
  unit,
  height = 300,
}: {
  history: { label: string; value: number }[]
  forecast: { label: string; value: number; lo: number; hi: number }[]
  unit?: string
  height?: number
}) {
  const merged = [
    ...history.map((h) => ({ label: h.label, hist: h.value })),
    ...forecast.map((f) => ({ label: f.label, prev: f.value, lo: f.lo, band: f.hi - f.lo })),
  ]
  const transition = history[history.length - 1]?.label
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={merged} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={52} tickFormatter={(v) => compact(Number(v))} domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={tipStyle}
          formatter={(v: number, n) => {
            if (n === 'Intervalle 90 %' || n === 'lo') return [null, null] as [null, null]
            return [fmt(v, unit), n === 'hist' ? 'Historique' : 'Prévision']
          }}
        />
        <Area dataKey="lo" stackId="band" stroke="none" fill="transparent" isAnimationActive={false} legendType="none" name="lo" />
        <Area dataKey="band" stackId="band" stroke="none" fill={CHART_COLORS.INFO} fillOpacity={0.14} isAnimationActive={false} name="Intervalle 90 %" />
        <Line dataKey="hist" stroke={CHART_COLORS.NAVY} strokeWidth={2} dot={false} isAnimationActive={false} name="hist" />
        <Line dataKey="prev" stroke={CHART_COLORS.INFO} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} name="prev" />
        {transition && <ReferenceLine x={transition} stroke="#8A94A3" strokeDasharray="3 3" />}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ HBars */
export function HBars({
  data,
  unit,
  colorBySign = false,
  height,
  maxOverride,
}: {
  data: { label: string; value: number; hint?: string }[]
  unit?: string
  colorBySign?: boolean
  height?: number
  maxOverride?: number
}) {
  const max = maxOverride ?? Math.max(...data.map((d) => Math.abs(d.value)), 1)
  return (
    <div className="space-y-2 overflow-y-auto pr-1" style={height ? { maxHeight: height } : undefined}>
      {data.map((d) => {
        const w = (Math.abs(d.value) / max) * 100
        const color = colorBySign ? (d.value < 0 ? 'bg-neg' : 'bg-leaf') : 'bg-navy-800'
        return (
          <div key={d.label} className="grid grid-cols-[minmax(120px,1fr)_2fr_auto] items-center gap-3 text-xs">
            <span className="truncate text-ink-muted" title={d.label}>
              {d.label}
            </span>
            <div className="h-2.5 rounded-full bg-navy-50">
              <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${w}%` }} />
            </div>
            <span className="whitespace-nowrap tabular-nums font-medium text-ink">
              {unit === 'FCFA' ? compact(d.value) : num1(d.value)}
              {d.hint ? <span className="ml-1 font-normal text-ink-faint">{d.hint}</span> : null}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ RiskMatrix */
export function RiskMatrix({
  items,
  selectedId,
  onSelect,
}: {
  items: RiskItem[]
  selectedId?: string | null
  onSelect?: (r: RiskItem) => void
}) {
  const size = 320
  const pad = 34
  const inner = size - pad * 2
  const color = (score: number) => (score >= 75 ? CHART_COLORS.NEG : score >= 55 ? CHART_COLORS.SOIL : score >= 35 ? CHART_COLORS.INFO : CHART_COLORS.POS)
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[360px]">
      <rect x={pad} y={pad} width={inner} height={inner} fill="#F5F6F8" stroke={GRID} />
      {[0.25, 0.5, 0.75].map((t) => (
        <g key={t} stroke={GRID}>
          <line x1={pad + inner * t} y1={pad} x2={pad + inner * t} y2={pad + inner} />
          <line x1={pad} y1={pad + inner * t} x2={pad + inner} y2={pad + inner * t} />
        </g>
      ))}
      <text x={pad} y={size - 8} fontSize={10} fill="#8A94A3">
        Probabilité →
      </text>
      <text x={12} y={pad + 8} fontSize={10} fill="#8A94A3" transform={`rotate(-90 12 ${pad + 8})`}>
        Impact →
      </text>
      {items.map((r) => {
        const cx = pad + r.probability * inner
        const cy = pad + inner - r.impact * inner
        const sel = r.id === selectedId
        return (
          <g key={r.id} className="cursor-pointer" onClick={() => onSelect?.(r)}>
            <circle cx={cx} cy={cy} r={sel ? 9 : 6} fill={color(r.score)} fillOpacity={0.85} stroke={sel ? CHART_COLORS.NAVY : 'white'} strokeWidth={sel ? 2 : 1} />
            <title>{`${r.label} — score ${r.score}`}</title>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ DeviationBars */
export function DeviationBars({
  data,
  height = 240,
}: {
  data: { label: string; attendu: number; observe: number }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => compact(Number(v))} />
        <Tooltip contentStyle={tipStyle} formatter={(v: number, n) => [num(v), n]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="Attendu" dataKey="attendu" fill="#C7D2DF" radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Bar name="Observé" dataKey="observe" fill={CHART_COLORS.NEG} radius={[3, 3, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ MetricToggle helper */
export function useMetricToggle<T extends string>(all: readonly T[], initial: T[]) {
  const [active, setActive] = useState<T[]>(initial)
  const toggle = (m: T) =>
    setActive((cur) => (cur.includes(m) ? (cur.length > 1 ? cur.filter((x) => x !== m) : cur) : [...cur, m]))
  return { active, toggle, all }
}
