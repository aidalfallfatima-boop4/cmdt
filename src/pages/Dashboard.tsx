import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout, Gauge, Factory, Landmark, Percent, HandCoins } from 'lucide-react'
import { PageHeader, Card, CardHeader, Select, Segmented, PerfBadge, TrendPct, Sparkline } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { MultiLine, CHART_COLORS } from '../components/charts'
import { AIInsightCard, AlertCard } from '../components/cards'
import { MONTHLY, ZONE_STATS, NATIONAL_KPIS, periodFactor } from '../data/dataset'
import { INSIGHTS, ALERTS } from '../data/narrative'
import { num, tonnes, kgha, fcfa } from '../lib/format'

const PERIODS = ['Décade', 'Mensuel', 'Trimestre', 'Campagne', 'Cumul'] as const
const METRICS = [
  { key: 'cotonGraine', label: 'Coton graine', color: CHART_COLORS.LEAF },
  { key: 'fibre', label: 'Fibre', color: CHART_COLORS.NAVY },
  { key: 'rendement', label: 'Rendement', color: CHART_COLORS.SOIL },
  { key: 'recettes', label: 'Recettes', color: CHART_COLORS.INFO },
] as const
type MetricKey = (typeof METRICS)[number]['key']

export default function Dashboard() {
  const navigate = useNavigate()
  const [zoneId, setZoneId] = useState<string>('all')
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Mensuel')
  const [active, setActive] = useState<MetricKey[]>(['cotonGraine', 'fibre'])

  const zoneOptions = [
    { value: 'all', label: 'Toutes les filiales' },
    ...ZONE_STATS.map((z) => ({ value: z.zoneId, label: z.zone })),
  ]

  const share = zoneId === 'all' ? 1 : (ZONE_STATS.find((z) => z.zoneId === zoneId)?.cotonGraine ?? 0) / ZONE_STATS.reduce((s, z) => s + z.cotonGraine, 0)
  const pf = periodFactor(period)
  const last = MONTHLY[MONTHLY.length - 1]

  const flow = (v: number) => v * share * pf
  const rate = (v: number) => v

  const chartData = useMemo(() => {
    const single = active.length === 1
    return MONTHLY.map((m) => {
      const row: { label: string; [k: string]: number | string } = { label: m.label }
      for (const met of METRICS) {
        if (!active.includes(met.key)) continue
        const raw = Number(m[met.key])
        if (single) row[met.key] = met.key === 'rendement' ? raw : raw * share
        else {
          const base = Number(MONTHLY[0][met.key])
          row[met.key] = (raw / base) * 100
        }
      }
      return row
    })
  }, [active, share])

  const kpiSpark = (key: MetricKey) => MONTHLY.slice(-7).map((m) => Number(m[key]) * (key === 'rendement' ? 1 : share))

  return (
    <div className="fade-up">
      <PageHeader
        title="Tableau de bord exécutif"
        subtitle="Pilotage consolidé de la filière cotonnière — vue Direction Générale"
        right={
          <>
            <Select label="Filiale" options={zoneOptions} value={zoneId} onChange={setZoneId} />
            <Segmented options={PERIODS} value={period} onChange={setPeriod} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Production coton graine" value={tonnes(flow(last.cotonGraine))} delta={NATIONAL_KPIS.cotonGraine.delta} spark={kpiSpark('cotonGraine')} sparkTone="up" icon={<Sprout size={15} />} accent delay={0} />
        <KpiCard label="Rendement moyen" value={kgha(rate(last.rendement))} delta={NATIONAL_KPIS.rendement.delta} spark={kpiSpark('rendement')} sparkTone="up" icon={<Gauge size={15} />} delay={40} />
        <KpiCard label="Fibre produite" value={tonnes(flow(last.fibre))} delta={NATIONAL_KPIS.fibre.delta} spark={kpiSpark('fibre')} sparkTone="up" icon={<Factory size={15} />} delay={80} />
        <KpiCard label="Recettes" value={fcfa(flow(last.recettes))} delta={NATIONAL_KPIS.recettes.delta} spark={kpiSpark('recettes')} sparkTone="up" icon={<Landmark size={15} />} delay={120} />
        <KpiCard label="Taux d'égrenage" value={`${last.tauxEgrenage.toLocaleString('fr-FR')} %`} delta={NATIONAL_KPIS.tauxEgrenage.delta} deltaSuffix="pt" icon={<Percent size={15} />} delay={160} />
        <KpiCard label="Taux de remboursement" value={`${last.tauxRemboursement.toLocaleString('fr-FR')} %`} delta={NATIONAL_KPIS.tauxRemboursement.delta} deltaSuffix="pt" icon={<HandCoins size={15} />} delay={200} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Évolution de la campagne"
            sub={active.length > 1 ? 'Indice base 100 (premier mois)' : 'Valeurs réelles'}
            right={
              <div className="flex flex-wrap gap-1.5">
                {METRICS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setActive((cur) => (cur.includes(m.key) ? (cur.length > 1 ? cur.filter((x) => x !== m.key) : cur) : [...cur, m.key]))}
                    className={active.includes(m.key) ? 'seg-on' : 'seg-off'}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="p-4">
            <MultiLine data={chartData} series={METRICS.filter((m) => active.includes(m.key)).map((m) => ({ key: m.key, label: m.label, color: m.color }))} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Analyses IA" sub="Lecture décisionnelle du moment" />
          <div className="space-y-3 p-4">
            {INSIGHTS.slice(0, 4).map((i) => (
              <AIInsightCard key={i.id} insight={i} onAnalyze={() => navigate('/copilot')} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Performance par filiale" sub="Classement par score de performance consolidé" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr>
                <th className="th">Filiale</th>
                <th className="th">Coton graine</th>
                <th className="th">Rendement</th>
                <th className="th">Coût de revient</th>
                <th className="th">Croissance</th>
                <th className="th">Score</th>
                <th className="th">Tendance</th>
                <th className="th">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[...ZONE_STATS].sort((a, b) => b.score - a.score).map((z) => (
                <tr key={z.zoneId} className="tr-hover" onClick={() => setZoneId(z.zoneId)}>
                  <td className="td font-medium">{z.zone}</td>
                  <td className="td">{tonnes(z.cotonGraine)}</td>
                  <td className="td">{num(z.rendement)} kg/ha</td>
                  <td className="td">{num(z.coutRevient)} FCFA/kg</td>
                  <td className="td"><TrendPct value={z.growth} /></td>
                  <td className="td font-semibold">{z.score.toLocaleString('fr-FR')}</td>
                  <td className="td"><Sparkline data={z.spark} trend={z.trend} /></td>
                  <td className="td"><PerfBadge band={z.band} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4">
        <CardHeader title="Alertes prioritaires" sub="Situations ouvertes nécessitant un arbitrage" />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {ALERTS.filter((a) => a.status !== 'RESOLUE').slice(0, 6).map((a) => (
            <AlertCard key={a.id} alert={a} onView={() => navigate('/risques')} />
          ))}
        </div>
      </div>
    </div>
  )
}
