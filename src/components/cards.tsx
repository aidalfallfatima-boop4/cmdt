import { useState } from 'react'
import { Sparkles, ChevronDown, ShieldAlert, Lightbulb, ArrowRight } from 'lucide-react'
import { SeverityBadge } from './ui'
import type { Insight, Alert, InsightLevel } from '../types'

const LEVEL_BORDER: Record<InsightLevel, string> = {
  positif: 'border-l-pos',
  attention: 'border-l-warn',
  risque: 'border-l-neg',
  information: 'border-l-info',
}
const LEVEL_LABEL: Record<InsightLevel, string> = {
  positif: 'Signal positif',
  attention: 'Point de vigilance',
  risque: 'Risque',
  information: 'Information',
}

export function AiBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy-700 ${className}`}
    >
      <Sparkles size={12} className="text-leaf" />
      Généré par CMDT AI
    </span>
  )
}

export function AIInsightCard({ insight, onAnalyze }: { insight: Insight; onAnalyze?: (i: Insight) => void }) {
  return (
    <div className={`card border-l-4 p-4 ${LEVEL_BORDER[insight.level]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="stat-label">{LEVEL_LABEL[insight.level]}</span>
        {insight.metricHint && <span className="chip">{insight.metricHint}</span>}
      </div>
      <h4 className="mt-2 text-sm font-semibold text-ink">{insight.title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{insight.detail}</p>
      {onAnalyze && (
        <button
          type="button"
          onClick={() => onAnalyze(insight)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-leaf hover:text-leaf-dark"
        >
          Analyser <ArrowRight size={13} />
        </button>
      )}
    </div>
  )
}

export function AlertCard({ alert, onView }: { alert: Alert; onView?: (a: Alert) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card p-4">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-start justify-between gap-3 text-left">
        <div className="flex items-start gap-2.5">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-ink-faint" />
          <div>
            <p className="text-sm font-semibold text-ink">{alert.subject}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {alert.scope} · {new Date(alert.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <ChevronDown size={15} className={`text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <p className="mt-2 pl-[26px] text-xs text-ink-muted">
        <span className="font-medium text-ink">Impact :</span> {alert.impact}
      </p>
      {open && (
        <div className="mt-2 pl-[26px]">
          <p className="text-xs leading-relaxed text-ink-muted">{alert.detail}</p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">Statut : {alert.status.replace('_', ' ').toLowerCase()}</p>
          {onView && (
            <button type="button" onClick={() => onView(alert)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-leaf hover:text-leaf-dark">
              Ouvrir dans Risques & Alertes <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function RecommendationCard({
  title,
  body,
  tag,
  confidence,
}: {
  title: string
  body: string
  tag?: string
  confidence?: number
}) {
  return (
    <div className="card border-l-4 border-l-leaf p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-dark">
          <Lightbulb size={14} /> Recommandation
        </span>
        {tag && <span className="chip">{tag}</span>}
      </div>
      <h4 className="mt-2 text-sm font-semibold text-ink">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{body}</p>
      {confidence !== undefined && (
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          Niveau de confiance : {confidence} %
        </p>
      )}
    </div>
  )
}
