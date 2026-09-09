import { useMemo, useState } from 'react'
import { Map, Sprout, Gauge, Users, Building2, PackagePlus, HandCoins } from 'lucide-react'
import { PageHeader, Card, CardHeader, Select, Segmented, DemoDisclaimer } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { LineTrend, MultiLine, HBars, CHART_COLORS } from '../components/charts'
import { MONTHLY, ZONE_STATS, SECTEURS, periodFactor, seasonal, CALENDAR } from '../data/dataset'
import { num, tonnes, kgha, fcfa, hectares } from '../lib/format'

const PERIODS = ['Décade', 'Mensuel', 'Trimestre', 'Campagne', 'Cumul'] as const
const SPECS = ['Toutes spéculations', 'Coton conventionnel', 'Coton bio & équitable', 'Semences'] as const
const SPEC_MUL: Record<(typeof SPECS)[number], number> = {
  'Toutes spéculations': 1,
  'Coton conventionnel': 0.93,
  'Coton bio & équitable': 0.05,
  Semences: 0.02,
}
const TS_METRICS = ['superficie', 'cotonGraine', 'rendement', 'producteurs', 'intrants', 'coutRevient'] as const
type TsMetric = (typeof TS_METRICS)[number]

export default function Production() {
  const [zoneId, setZoneId] = useState('all')
  const [secteurId, setSecteurId] = useState('all')
  const [spec, setSpec] = useState<(typeof SPECS)[number]>('Toutes spéculations')
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Mensuel')
  const [tsMetric, setTsMetric] = useState<TsMetric>('rendement')

  const zoneOptions = [{ value: 'all', label: 'Toutes les filiales' }, ...ZONE_STATS.map((z) => ({ value: z.zoneId, label: z.zone }))]
  const secteurOptions = [
    { value: 'all', label: 'Tous les secteurs' },
    ...SECTEURS.filter((s) => zoneId === 'all' || s.zoneId === zoneId).map((s) => ({ value: s.id, label: s.name })),
  ]

  const totalCoton = ZONE_STATS.reduce((s, z) => s + z.cotonGraine, 0)
  const share = useMemo(() => {
    if (secteurId !== 'all') {
      const s = SECTEURS.find((x) => x.id === secteurId)
      return s ? s.cotonGraine / totalCoton : 1
    }
    if (zoneId !== 'all') return (ZONE_STATS.find((z) => z.zoneId === zoneId)?.cotonGraine ?? 0) / totalCoton
    return 1
  }, [zoneId, secteurId, totalCoton])

  const specMul = SPEC_MUL[spec]
  const pf = periodFactor(period)
  const last = MONTHLY[MONTHLY.length - 1]
  const flow = (v: number) => v * share * specMul * pf
  const intrantsLast = last.couts * 0.42

  const tsData = useMemo(
    () =>
      MONTHLY.map((m, i) => {
        const sf = seasonal(CALENDAR[i].mNum, 0.4)
        return {
          label: m.label,
          value:
            tsMetric === 'rendement'
              ? m.rendement
              : tsMetric === 'coutRevient'
                ? Math.round(280 + 160 * (1 + 0.15 * (1 - sf)) * (1 + i * 0.004))
                : tsMetric === 'intrants'
                  ? Math.round(m.couts * 0.42 * share * specMul)
                  : Math.round(Number(m[tsMetric === 'superficie' ? 'superficie' : tsMetric === 'producteurs' ? 'producteurs' : 'cotonGraine']) * share * specMul),
        }
      }),
    [tsMetric, share, specMul],
  )

  const rainData = useMemo(
    () =>
      MONTHLY.map((m, i) => ({
        label: m.label,
        rendement: m.rendement,
        pluvio: Math.round(Math.max(2, 120 * seasonal(CALENDAR[i].mNum, -0.9) + (CALENDAR[i].mNum >= 6 && CALENDAR[i].mNum <= 10 ? 60 : 0))),
      })),
    [],
  )

  const territ = ZONE_STATS.map((z) => ({
    label: z.zone,
    value:
      tsMetric === 'rendement'
        ? z.rendement
        : tsMetric === 'producteurs'
          ? z.producteurs
          : tsMetric === 'superficie'
            ? z.superficie
            : z.cotonGraine,
  }))

  return (
    <div className="fade-up">
      <PageHeader
        title="Production agricole"
        subtitle="Superficies, rendement, encadrement et intrants — Direction de la Production Agricole"
        right={
          <>
            <Select label="Filiale" options={zoneOptions} value={zoneId} onChange={(v) => { setZoneId(v); setSecteurId('all') }} />
            <Select label="Secteur" options={secteurOptions} value={secteurId} onChange={setSecteurId} />
            <Select label="Spéculation" options={SPECS.map((s) => ({ value: s, label: s }))} value={spec} onChange={setSpec} />
            <Segmented options={PERIODS} value={period} onChange={setPeriod} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <KpiCard label="Superficie" value={hectares(flow(last.superficie))} delta={2.4} icon={<Map size={15} />} accent />
        <KpiCard label="Coton graine" value={tonnes(flow(last.cotonGraine))} delta={7.2} icon={<Sprout size={15} />} delay={40} />
        <KpiCard label="Rendement" value={kgha(last.rendement)} delta={3.1} icon={<Gauge size={15} />} delay={80} />
        <KpiCard label="Producteurs actifs" value={num(flow(last.producteurs) / pf)} delta={1.5} icon={<Users size={15} />} delay={120} />
        <KpiCard label="SCOOPS" value={num((SECTEURS.reduce((s, x) => s + x.scoops, 0)) * share)} delta={0.8} icon={<Building2 size={15} />} delay={160} />
        <KpiCard label="Intrants distribués" value={fcfa(flow(intrantsLast))} delta={4.1} icon={<PackagePlus size={15} />} delay={200} />
        <KpiCard label="Taux de remboursement" value={`${last.tauxRemboursement.toLocaleString('fr-FR')} %`} delta={1.1} deltaSuffix="pt" icon={<HandCoins size={15} />} delay={240} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Série temporelle"
            right={
              <Select
                options={[
                  { value: 'superficie', label: 'Superficie' },
                  { value: 'cotonGraine', label: 'Coton graine' },
                  { value: 'rendement', label: 'Rendement' },
                  { value: 'producteurs', label: 'Producteurs' },
                  { value: 'intrants', label: 'Intrants' },
                  { value: 'coutRevient', label: 'Coût de revient' },
                ]}
                value={tsMetric}
                onChange={(v) => setTsMetric(v as TsMetric)}
              />
            }
          />
          <div className="p-4">
            <LineTrend data={tsData} dataKey="value" color={CHART_COLORS.LEAF} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Rendement vs pluviométrie" sub="Rendement (kg/ha) et cumul pluviométrique simulé (mm)" />
          <div className="p-4">
            <MultiLine
              data={rainData}
              series={[
                { key: 'rendement', label: 'Rendement (kg/ha)', color: CHART_COLORS.NAVY },
                { key: 'pluvio', label: 'Pluviométrie (mm)', color: CHART_COLORS.INFO },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Répartition territoriale" sub={`Contribution par filiale — ${tsMetric}`} />
        <div className="p-4">
          <HBars data={territ} />
        </div>
      </Card>

      <DemoDisclaimer className="mt-4" />
      <p className="mt-2 text-xs text-ink-faint">
        Le rendement, les superficies et les pondérations sont des hypothèses de travail, à remplacer par les référentiels
        officiels de la CMDT (fiches de suivi parcellaire, bascules usine) en phase pilote.
      </p>
    </div>
  )
}
