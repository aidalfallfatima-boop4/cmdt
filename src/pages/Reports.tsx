import { useState } from 'react'
import { FileText, Eye, RefreshCw, Download, Loader2, Check } from 'lucide-react'
import { PageHeader, Card, Segmented } from '../components/ui'
import { REPORTS } from '../data/narrative'
import type { ReportCard } from '../types'

const FILTERS = ['Tous', 'Quotidien', 'Hebdomadaire', 'Mensuel', 'Bilan de campagne'] as const

type BtnState = 'idle' | 'busy' | 'done'

function ActionButton({ label, icon }: { label: string; icon: 'view' | 'gen' | 'pdf' }) {
  const [state, setState] = useState<BtnState>('idle')
  const Icon = icon === 'view' ? Eye : icon === 'gen' ? RefreshCw : Download
  const run = () => {
    if (state === 'busy') return
    setState('busy')
    setTimeout(() => {
      setState('done')
      setTimeout(() => setState('idle'), 1600)
    }, 1100)
  }
  return (
    <button type="button" onClick={run} className="btn-ghost text-xs">
      {state === 'busy' ? <Loader2 size={13} className="animate-spin" /> : state === 'done' ? <Check size={13} className="text-pos" /> : <Icon size={13} />}
      {label}
    </button>
  )
}

function ReportItem({ r }: { r: ReportCard }) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-navy-50 text-navy-800">
          <FileText size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="chip">{r.kind}</span>
          <h3 className="mt-1.5 text-sm font-semibold text-ink">{r.title}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            {r.period} · {r.pages} pages · généré le {r.generatedAt}
          </p>
          <ul className="mt-2 space-y-1">
            {r.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-xs text-ink-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-leaf" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <ActionButton label="Voir" icon="view" />
            <ActionButton label="Générer" icon="gen" />
            <ActionButton label="Exporter PDF" icon="pdf" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function Reports() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Tous')
  const list = REPORTS.filter((r) => filter === 'Tous' || r.kind === filter)

  return (
    <div className="fade-up">
      <PageHeader title="Rapports" subtitle="Notes de campagne et rapports exécutifs — génération et export simulés" right={<Segmented options={FILTERS} value={filter} onChange={setFilter} />} />

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((r) => (
          <ReportItem key={r.id} r={r} />
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Génération et export simulés. En Phase 2, les rapports sont produits depuis le Data Warehouse, versionnés, signés
        électroniquement et distribués selon le rôle du destinataire.
      </p>
    </div>
  )
}
