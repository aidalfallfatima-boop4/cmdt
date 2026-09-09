import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { PageHeader, Card, CardHeader, DemoTag } from '../components/ui'
import { HBars } from '../components/charts'
import { RecommendationCard } from '../components/cards'
import { MONTHLY, CAMPAGNE, NATIONAL_KPIS } from '../data/dataset'
import { profitability } from '../services/analytics'
import { num, num1, fcfa, kgha, pct } from '../lib/format'

const DECAY = 0.35

interface Lever {
  key: string
  label: string
  min: number
  max: number
  def: number
  suffix: string
}
const LEVERS: Lever[] = [
  { key: 'prixAchat', label: "Prix d'achat au producteur", min: 250, max: 350, def: 300, suffix: 'FCFA/kg' },
  { key: 'subventionIntrants', label: 'Subvention des intrants', min: 0, max: 60, def: 25, suffix: '%' },
  { key: 'superficie', label: 'Superficie emblavée', min: -15, max: 25, def: 0, suffix: '%' },
  { key: 'encadrement', label: 'Conseil agricole / encadrement', min: -20, max: 30, def: 0, suffix: 'indice' },
  { key: 'mecanisation', label: 'Mécanisation / culture attelée', min: 0, max: 40, def: 10, suffix: '%' },
  { key: 'phyto', label: 'Couverture protection phytosanitaire', min: 0, max: 30, def: 15, suffix: '%' },
]

// Élasticités indicatives : effet (fraction) par levier saturé.
const COEF: Record<string, Record<string, number>> = {
  production: { prixAchat: 0.06, subventionIntrants: 0.03, superficie: 0.12, encadrement: 0.05, mecanisation: 0.05, phyto: 0.04 },
  rendement: { prixAchat: 0.01, subventionIntrants: 0.06, superficie: -0.015, encadrement: 0.09, mecanisation: 0.06, phyto: 0.07 },
  coutFiliere: { prixAchat: 0.09, subventionIntrants: 0.08, superficie: 0.1, encadrement: 0.04, mecanisation: -0.05, phyto: 0.05 },
  recetteExport: { prixAchat: 0.05, subventionIntrants: 0.04, superficie: 0.1, encadrement: 0.06, mecanisation: 0.06, phyto: 0.05 },
  revenuProducteur: { prixAchat: 0.14, subventionIntrants: 0.05, superficie: 0.04, encadrement: 0.03, mecanisation: 0.04, phyto: 0.03 },
  margeFiliere: { prixAchat: -0.1, subventionIntrants: -0.03, superficie: 0.02, encadrement: 0.01, mecanisation: 0.05, phyto: 0.01 },
}

function damped(t: number): number {
  return Math.sign(t) * (1 - Math.exp(-Math.abs(t) / DECAY))
}

export default function Scenarios() {
  const [values, setValues] = useState<Record<string, number>>(Object.fromEntries(LEVERS.map((l) => [l.key, l.def])))
  const last = MONTHLY[MONTHLY.length - 1]

  const intensities = useMemo(() => {
    const out: Record<string, number> = {}
    for (const l of LEVERS) {
      const v = values[l.key]
      const t = v >= l.def ? (l.max === l.def ? 0 : (v - l.def) / (l.max - l.def)) : (l.def === l.min ? 0 : (v - l.def) / (l.def - l.min))
      out[l.key] = damped(t)
    }
    return out
  }, [values])

  const effect = (metric: string): number => {
    const c = COEF[metric]
    let s = 0
    for (const l of LEVERS) s += (c[l.key] ?? 0) * intensities[l.key]
    return s * 100
  }

  const margeBase = profitability(last.recettes, last.couts)
  const revenuBase = CAMPAGNE.paiementsProducteurs / NATIONAL_KPIS.producteurs.value

  const outputs = [
    { label: 'Production coton graine', base: last.cotonGraine, fmt: (v: number) => `${num(v)} t`, eff: effect('production'), accent: false },
    { label: 'Rendement', base: last.rendement, fmt: (v: number) => kgha(v), eff: effect('rendement'), accent: false },
    { label: 'Coût filière', base: last.couts, fmt: (v: number) => fcfa(v), eff: effect('coutFiliere'), accent: false },
    { label: "Recette d'exportation", base: last.recettes, fmt: (v: number) => fcfa(v), eff: effect('recetteExport'), accent: false },
    { label: 'Revenu moyen producteur', base: revenuBase, fmt: (v: number) => fcfa(v), eff: effect('revenuProducteur'), accent: false },
    { label: 'Marge filière', base: margeBase, fmt: (v: number) => `${num1(v)} %`, eff: effect('margeFiliere'), accent: true },
  ]

  const reset = () => setValues(Object.fromEntries(LEVERS.map((l) => [l.key, l.def])))

  const lecture =
    effect('margeFiliere') < -1
      ? "Ce scénario augmente le revenu des producteurs et la production, mais dégrade la marge de la CMDT : il n'est soutenable qu'adossé à un cours mondial élevé ou à un appui de l'État."
      : effect('rendement') > 3
        ? "Ce scénario mise sur la productivité (encadrement, phytosanitaire, mécanisation) : il améliore le rendement et la marge, avec un coût filière contenu à moyen terme."
        : "Scénario proche de la situation de référence : les effets se compensent. Ajuster un levier à la fois pour isoler son impact."

  return (
    <div className="fade-up">
      <PageHeader title="Scénarios de décision" subtitle="Simulateur d'impact — leviers de politique cotonnière" right={<DemoTag />} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Leviers" right={<button type="button" onClick={reset} className="btn-ghost text-xs"><RotateCcw size={13} /> Réinitialiser</button>} />
          <div className="space-y-5 p-5">
            {LEVERS.map((l) => (
              <div key={l.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{l.label}</span>
                  <span className="tabular-nums text-ink-muted">
                    {num1(values[l.key])} {l.suffix}
                  </span>
                </div>
                <input
                  type="range"
                  min={l.min}
                  max={l.max}
                  step={1}
                  value={values[l.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [l.key]: Number(e.target.value) }))}
                  className="mt-2 w-full accent-navy-900"
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {outputs.map((o) => (
              <div key={o.label} className={`card p-4 ${o.accent ? 'ring-1 ring-leaf/40' : ''}`}>
                <p className="stat-label">{o.label}</p>
                <p className="kpi-value mt-1 text-xl">
                  {o.accent ? o.fmt(o.base + o.eff) : o.fmt(o.base * (1 + o.eff / 100))}
                </p>
                <p className={`text-xs font-semibold ${o.eff > 0.2 ? 'text-pos' : o.eff < -0.2 ? 'text-neg' : 'text-ink-faint'}`}>
                  {o.accent ? `${pct(o.eff)} pt` : pct(o.eff)}
                </p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader title="Variation par indicateur" />
            <div className="p-4">
              <HBars data={outputs.map((o) => ({ label: o.label, value: Math.round(o.eff * 10) / 10 }))} colorBySign maxOverride={Math.max(6, ...outputs.map((o) => Math.abs(o.eff)))} />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <RecommendationCard title="Lecture du scénario" body={lecture} tag="Simulation indicative" confidence={55} />
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Simulation indicative — élasticités paramétrées avec rendements décroissants (facteur d'amortissement {DECAY}). Les
        résultats sont à confronter à l'expertise des directions métier avant toute décision.
      </p>
    </div>
  )
}
