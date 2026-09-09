import { Landmark, Coins, Percent, PackagePlus, HandCoins, Scale } from 'lucide-react'
import { PageHeader, Card, CardHeader } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { RecettesCouts, BudgetVsActual, LineTrend, HBars, CHART_COLORS } from '../components/charts'
import { AIInsightCard, AiBadge } from '../components/cards'
import { FINANCE_KPIS, FINANCE_MONTHLY, SECTEURS } from '../data/dataset'
import { fcfa } from '../lib/format'
import type { Insight } from '../types'

const netAvgCout = SECTEURS.reduce((s, x) => s + x.coutRevient, 0) / SECTEURS.length

const FIN_INSIGHTS: Insight[] = [
  {
    id: 'f1',
    level: 'risque',
    title: 'Les coûts intrants et transport progressent plus vite que les recettes sur plusieurs secteurs',
    detail: `${SECTEURS.filter((s) => s.coutRevient > netAvgCout * 1.08).length} secteurs affichent un coût de revient nettement au-dessus de la moyenne réseau. À rythme constant, l'écart réduit la ristourne redistribuable.`,
    metricHint: 'Coût de revient',
  },
  {
    id: 'f2',
    level: FINANCE_KPIS.marge.value >= 18 ? 'positif' : 'attention',
    title: `Marge filière à ${FINANCE_KPIS.marge.value.toLocaleString('fr-FR')} % — ${FINANCE_KPIS.marge.value >= 18 ? 'au-dessus' : 'proche'} de la cible interne`,
    detail: 'La marge reste sensible au cours mondial de la fibre et au change USD/FCFA ; une variation de 5 % du Cotlook A déplace significativement le résultat de campagne.',
    metricHint: 'Marge filière',
  },
  {
    id: 'f3',
    level: 'information',
    title: `Écart budgétaire du mois : ${FINANCE_KPIS.variance.value.toLocaleString('fr-FR')} %`,
    detail: 'Réalisé des coûts filière comparé au budget de campagne. Le poste transport explique la majeure partie de la variance.',
    metricHint: 'Budget',
  },
  {
    id: 'f4',
    level: 'attention',
    title: 'Recettes concentrées sur la fibre exportée (~98 %)',
    detail: "L'exposition au prix mondial et au change est quasi totale. La diversification (graine / huilerie, sous-produits) reste marginale dans le résultat.",
    metricHint: 'Recettes',
  },
]

export default function Finance() {
  return (
    <div className="fade-up">
      <PageHeader title="Finance & Filière" subtitle="Crédit de campagne, coûts filière, budget et marge — Direction Financière" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Recettes" value={fcfa(FINANCE_KPIS.recettes.value)} delta={FINANCE_KPIS.recettes.delta} icon={<Landmark size={15} />} accent />
        <KpiCard label="Coûts filière" value={fcfa(FINANCE_KPIS.couts.value)} delta={FINANCE_KPIS.couts.delta} icon={<Coins size={15} />} delay={40} />
        <KpiCard label="Marge filière" value={`${FINANCE_KPIS.marge.value.toLocaleString('fr-FR')} %`} delta={FINANCE_KPIS.marge.delta} deltaSuffix="pt" icon={<Percent size={15} />} delay={80} />
        <KpiCard label="Intrants distribués" value={fcfa(FINANCE_KPIS.intrants.value)} delta={FINANCE_KPIS.intrants.delta} icon={<PackagePlus size={15} />} delay={120} />
        <KpiCard label="Subvention État" value={fcfa(FINANCE_KPIS.subvention.value)} delta={FINANCE_KPIS.subvention.delta} icon={<HandCoins size={15} />} delay={160} />
        <KpiCard label="Écart budgétaire" value={`${FINANCE_KPIS.variance.value.toLocaleString('fr-FR')} %`} delta={FINANCE_KPIS.variance.delta} icon={<Scale size={15} />} delay={200} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recettes vs coûts" sub="Barres recettes / coûts · ligne marge filière (%)" />
          <div className="p-4">
            <RecettesCouts data={FINANCE_MONTHLY.map((m) => ({ label: m.label, recettes: m.recettes, couts: m.couts, marge: m.marge }))} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Budget vs réalisé" sub="Coût de campagne — 12 mois" />
          <div className="p-4">
            <BudgetVsActual data={FINANCE_MONTHLY.map((m) => ({ label: m.label, budget: m.budget, couts: m.couts }))} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Évolution de la marge" sub="Marge filière (%) sur la campagne" />
          <div className="p-4">
            <LineTrend data={FINANCE_MONTHLY.map((m) => ({ label: m.label, marge: m.marge }))} dataKey="marge" label="Marge %" color={CHART_COLORS.NAVY} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Coût de revient par secteur" sub="FCFA/kg de coton graine · écart au seuil cible" />
          <div className="p-4">
            <HBars
              data={[...SECTEURS]
                .sort((a, b) => b.coutRevient - a.coutRevient)
                .map((s) => ({ label: s.name.replace('Secteur ', ''), value: Math.round(s.coutRevient - netAvgCout) }))}
              colorBySign
              height={520}
            />
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <CardHeader title="Analyses financières IA" />
          <AiBadge />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {FIN_INSIGHTS.map((i) => (
            <AIInsightCard key={i.id} insight={i} />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Prix d'achat au producteur : {FINANCE_KPIS.prixAchat} FCFA/kg (1er choix). Ristourne de fin de campagne estimée à{' '}
        {FINANCE_KPIS.ristourneEstimee} FCFA/kg — indicatif, fonction du résultat consolidé et de la décision de
        l'interprofession.
      </p>
    </div>
  )
}
