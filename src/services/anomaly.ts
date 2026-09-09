import { SECTEURS } from '../data/dataset'
import { ANOMALY_SIGMA } from '../config/weights'
import { rankBy, round1 } from './analytics'
import type { Anomaly, AlertSeverity } from '../types'

function linreg(ys: number[]): (x: number) => number {
  const n = ys.length
  const mx = (n - 1) / 2
  const my = ys.reduce((s, v) => s + v, 0) / n
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (i - mx) * (ys[i] - my)
    den += (i - mx) ** 2
  }
  const slope = den ? num / den : 0
  const intercept = my - slope * mx
  return (x) => intercept + slope * x
}

function residStd(ys: number[], f: (x: number) => number): number {
  const n = ys.length
  const v = ys.reduce((s, y, i) => s + (y - f(i)) ** 2, 0) / n
  return Math.sqrt(v)
}

function sevOf(z: number): AlertSeverity {
  const a = Math.abs(z)
  if (a >= 3.2) return 'CRITIQUE'
  if (a >= 2.6) return 'ELEVE'
  if (a >= ANOMALY_SIGMA) return 'MOYEN'
  return 'FAIBLE'
}

const TODAY = '2026-01-28'

interface Probe {
  metric: string
  pick: (h: (typeof SECTEURS)[number]['history'][number]) => number
  direction: 'down' | 'up'
  note: string
}

const PROBES: Probe[] = [
  {
    metric: 'Rendement (kg/ha)',
    pick: (h) => h.rendement,
    direction: 'down',
    note: 'Rendement en recul marqué par rapport à la trajectoire attendue — revue agronomique à programmer.',
  },
  {
    metric: 'Coûts de campagne (FCFA)',
    pick: (h) => h.couts,
    direction: 'up',
    note: 'Coûts (postes intrants + transport) au-dessus de la tendance — contrôle de gestion à diligenter.',
  },
  {
    metric: 'Taux de remboursement (%)',
    pick: (h) => h.tauxRemboursement,
    direction: 'down',
    note: 'Taux de remboursement du crédit intrants en décrochage — analyse des impayés par SCOOPS.',
  },
]

function buildDynamic(): Anomaly[] {
  const out: Anomaly[] = []
  const worst = rankBy(SECTEURS, (s) => s.riskScore, true).slice(0, 5)
  for (const s of worst) {
    let best: { probe: Probe; z: number; f: (x: number) => number; ys: number[] } | null = null
    for (const probe of PROBES) {
      const ys = s.history.map(probe.pick)
      const train = ys.slice(0, -1)
      const f = linreg(train)
      const sd = residStd(train, f) || 1
      const predicted = f(ys.length - 1)
      const z = (ys[ys.length - 1] - predicted) / sd
      const relevant = probe.direction === 'down' ? z < -ANOMALY_SIGMA : z > ANOMALY_SIGMA
      if (relevant && (!best || Math.abs(z) > Math.abs(best.z))) best = { probe, z, f, ys }
    }
    if (!best) continue
    const { probe, z, f, ys } = best
    const observed = ys[ys.length - 1]
    const expected = f(ys.length - 1)
    out.push({
      id: `an-${s.id}`,
      entity: s.name,
      metric: probe.metric,
      expected: round1(expected),
      observed: round1(observed),
      deviationPct: round1(((observed - expected) / expected) * 100),
      severity: sevOf(z),
      date: TODAY,
      note: probe.note,
      series: s.history.slice(-6).map((h, i) => ({
        label: h.label,
        attendu: round1(f(s.history.length - 6 + i)),
        observe: round1(probe.pick(h)),
      })),
    })
    if (out.length >= 6) break
  }
  return out
}

function demoSeries(base: number, gapPct: number, unit: 'j' | 'pct' | 'x'): Anomaly['series'] {
  const labels = ['Sep 25', 'Oct 25', 'Nov 25', 'Déc 25', 'Jan 26']
  return labels.map((label, i) => {
    const t = i / (labels.length - 1)
    const attendu = unit === 'j' ? base : base
    const observe = base * (1 + gapPct * t)
    return { label, attendu: round1(attendu), observe: round1(observe) }
  })
}

const DEMO: Anomaly[] = [
  {
    id: 'an-mpessoba',
    entity: "Usine M'Pessoba",
    metric: "Coût d'égrenage (FCFA/t)",
    expected: 100,
    observed: 122,
    deviationPct: 22,
    severity: 'ELEVE',
    date: TODAY,
    note: "Coût d'égrenage +22 % vs tendance : consommation d'énergie et heures de maintenance en hausse — audit technique de l'usine.",
    series: demoSeries(100, 0.22, 'x'),
  },
  {
    id: 'an-dioila-fana',
    entity: 'Corridor Dioïla → Usine Fana',
    metric: "Délai d'enlèvement (j)",
    expected: 3.5,
    observed: 6.2,
    deviationPct: 77.1,
    severity: 'CRITIQUE',
    date: TODAY,
    note: "Délai d'enlèvement 6,2 j vs 3,5 j attendus : sous-capacité de transport sur le corridor au pic de collecte — renfort logistique immédiat.",
    series: demoSeries(3.5, 0.77, 'j'),
  },
  {
    id: 'an-keniaba-bascule',
    entity: 'Secteur Kéniéba',
    metric: 'Écart poids-bascule usine vs déclarations ZPA (%)',
    expected: 0,
    observed: -4.1,
    deviationPct: -4.1,
    severity: 'ELEVE',
    date: TODAY,
    note: 'Écart de -4,1 % entre les pesées usine et les déclarations ZPA — contrôle terrain et fiabilisation des points de pesée.',
    series: [
      { label: 'Sep 25', attendu: 0, observe: -1.2 },
      { label: 'Oct 25', attendu: 0, observe: -2.1 },
      { label: 'Nov 25', attendu: 0, observe: -3.0 },
      { label: 'Déc 25', attendu: 0, observe: -3.8 },
      { label: 'Jan 26', attendu: 0, observe: -4.1 },
    ],
  },
]

export const ANOMALIES: Anomaly[] = [...DEMO, ...buildDynamic()].slice(0, 9)
