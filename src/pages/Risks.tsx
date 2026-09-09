import { useState } from 'react'
import { ShieldAlert, AlertOctagon, Radar, Inbox, ArrowUpDown } from 'lucide-react'
import { PageHeader, Card, CardHeader, Segmented, SeverityBadge } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { RiskMatrix, DeviationBars } from '../components/charts'
import { RecommendationCard } from '../components/cards'
import { RISK_REGISTER } from '../services/risk'
import { ANOMALIES } from '../services/anomaly'
import { ALERTS } from '../data/narrative'
import { num, num1, pct } from '../lib/format'
import type { RiskItem, Anomaly } from '../types'

const TABS = ['Matrice de risques', 'Anomalies', 'Alertes'] as const

export default function Risks() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Matrice de risques')
  const [selRisk, setSelRisk] = useState<RiskItem | null>(RISK_REGISTER[0])
  const [selAnom, setSelAnom] = useState<Anomaly | null>(ANOMALIES[0])
  const [sortDesc, setSortDesc] = useState(true)

  const risks = [...RISK_REGISTER].sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score))
  const nCrit = RISK_REGISTER.filter((r) => r.score >= 70).length
  const nOpen = ALERTS.filter((a) => a.status !== 'RESOLUE').length

  return (
    <div className="fade-up">
      <PageHeader title="Risques & Alertes" subtitle="Cartographie des risques structurels, anomalies détectées et alertes opérationnelles" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Risques suivis" value={num(RISK_REGISTER.length)} icon={<ShieldAlert size={15} />} accent />
        <KpiCard label="Risques critiques (≥ 70)" value={num(nCrit)} icon={<AlertOctagon size={15} />} delay={40} />
        <KpiCard label="Anomalies détectées (30 j)" value={num(ANOMALIES.length)} icon={<Radar size={15} />} delay={80} />
        <KpiCard label="Alertes ouvertes" value={num(nOpen)} icon={<Inbox size={15} />} delay={120} />
      </div>

      <div className="mt-4">
        <Segmented options={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === 'Matrice de risques' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Matrice probabilité × impact" sub="Cliquer un point pour afficher l'action recommandée" />
            <div className="flex flex-col items-center p-4">
              <RiskMatrix items={RISK_REGISTER} selectedId={selRisk?.id} onSelect={setSelRisk} />
              <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px] text-ink-muted">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neg" /> Critique</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-soil" /> Élevé</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info" /> Modéré</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pos" /> Faible</span>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {selRisk && (
              <Card className="border-l-4 border-l-navy-800 p-4">
                <span className="chip">{selRisk.category}</span>
                <h4 className="mt-2 text-sm font-semibold text-ink">{selRisk.label}</h4>
                <p className="mt-1 text-xs text-ink-muted">
                  Probabilité {num1(selRisk.probability * 100)} % · Impact {num1(selRisk.impact * 100)} % · Score {selRisk.score}
                </p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-leaf-dark">Action recommandée</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{selRisk.action}</p>
              </Card>
            )}
            <Card>
              <CardHeader
                title="Registre des risques"
                right={
                  <button type="button" className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink" onClick={() => setSortDesc((d) => !d)}>
                    Score <ArrowUpDown size={11} />
                  </button>
                }
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr>
                      <th className="th">Risque</th>
                      <th className="th">Catégorie</th>
                      <th className="th">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {risks.map((r) => (
                      <tr key={r.id} className={`tr-hover ${selRisk?.id === r.id ? 'bg-navy-50/60' : ''}`} onClick={() => setSelRisk(r)}>
                        <td className="td">{r.label}</td>
                        <td className="td text-xs">{r.category}</td>
                        <td className="td font-semibold">{r.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'Anomalies' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Anomalies détectées" sub="Écart significatif vs trajectoire attendue" />
            <ul className="divide-y divide-line">
              {ANOMALIES.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSelAnom(a)}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-navy-50/60 ${selAnom?.id === a.id ? 'bg-navy-50/60' : ''}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{a.entity}</p>
                      <p className="text-xs text-ink-muted">{a.metric}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${a.deviationPct < 0 ? 'text-neg' : 'text-warn'}`}>{pct(a.deviationPct)}</p>
                      <SeverityBadge severity={a.severity} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {selAnom && (
            <Card>
              <CardHeader title={selAnom.entity} sub={selAnom.metric} />
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-md bg-canvas/70 p-3">
                    <p className="stat-label">Attendu</p>
                    <p className="mt-1 text-lg font-semibold">{num1(selAnom.expected)}</p>
                  </div>
                  <div className="rounded-md bg-canvas/70 p-3">
                    <p className="stat-label">Observé</p>
                    <p className="mt-1 text-lg font-semibold">{num1(selAnom.observed)}</p>
                  </div>
                  <div className="rounded-md bg-negbg p-3">
                    <p className="stat-label">Écart</p>
                    <p className="mt-1 text-lg font-semibold text-neg">{pct(selAnom.deviationPct)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <DeviationBars data={selAnom.series} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">{selAnom.note}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'Alertes' && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {ALERTS.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{a.subject}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{a.scope} · {new Date(a.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <SeverityBadge severity={a.severity} />
                </div>
                <p className="mt-2 text-xs text-ink-muted"><span className="font-medium text-ink">Impact :</span> {a.impact}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{a.detail}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">Statut : {a.status.replace('_', ' ').toLowerCase()}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <RecommendationCard
              title="Plan de redressement des secteurs sous seuil"
              body="Piloté par la Direction de la Production Agricole : diagnostic terrain, objectifs de rendement et de remboursement par SCOOPS, revue mensuelle en comité de campagne."
              tag="DPA"
              confidence={70}
            />
            <RecommendationCard
              title="Sécurisation du calendrier des intrants"
              body="Avec la Direction Financière et les fournisseurs : verrouiller les appels d'offres, le préfinancement et la logistique jusqu'aux magasins de secteur avant l'ouverture de campagne."
              tag="Direction Financière"
              confidence={67}
            />
          </div>
        </div>
      )}
    </div>
  )
}
