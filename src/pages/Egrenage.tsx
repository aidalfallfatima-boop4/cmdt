import { Factory, Package, Boxes, Percent, Activity, Timer } from 'lucide-react'
import { PageHeader, Card, CardHeader } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { MultiLine, HBars, CHART_COLORS } from '../components/charts'
import { AlertCard } from '../components/cards'
import { EGRENAGE_KPIS, EGRENAGE_MONTHLY, EGRENAGE_BY_ZONE, CORRIDORS } from '../data/dataset'
import { ALERTS } from '../data/narrative'
import { num, tonnes } from '../lib/format'
import type { Alert } from '../types'

const EXTRA_ALERT: Alert = {
  id: 'a-koutiala',
  date: '2026-01-21',
  severity: 'ELEVE',
  subject: "Engorgement de l'usine de Koutiala aux pics de collecte",
  scope: 'Direction Industrielle',
  impact: 'File d\'attente camions · stock de coton graine exposé aux intempéries',
  status: 'EN_COURS',
  detail:
    "Le flux entrant dépasse la capacité de traitement de l'usine aux pics de novembre-janvier. Lissage de l'affectation vers les usines voisines et créneaux de livraison programmés demandés.",
}

export default function Egrenage() {
  const logiAlerts = ALERTS.filter((a) => /corridor|usine|enlèvement|égren/i.test(a.subject))

  return (
    <div className="fade-up">
      <PageHeader title="Collecte & Égrenage" subtitle="Évacuation du coton graine, production de fibre et capacité industrielle" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Coton graine collecté" value={tonnes(EGRENAGE_KPIS.cotonGraineCollecte.value)} delta={EGRENAGE_KPIS.cotonGraineCollecte.delta} icon={<Factory size={15} />} accent />
        <KpiCard label="Fibre produite" value={tonnes(EGRENAGE_KPIS.fibreProduite.value)} delta={EGRENAGE_KPIS.fibreProduite.delta} icon={<Package size={15} />} delay={40} />
        <KpiCard label="Stock fibre" value={tonnes(EGRENAGE_KPIS.stockFibre.value)} delta={EGRENAGE_KPIS.stockFibre.delta} icon={<Boxes size={15} />} delay={80} />
        <KpiCard label="Taux d'égrenage" value={`${EGRENAGE_KPIS.tauxEgrenage.value.toLocaleString('fr-FR')} %`} delta={EGRENAGE_KPIS.tauxEgrenage.delta} deltaSuffix="pt" icon={<Percent size={15} />} delay={120} />
        <KpiCard label="Capacité usines utilisée" value={`${EGRENAGE_KPIS.capaciteUtilisee.value.toLocaleString('fr-FR')} %`} delta={EGRENAGE_KPIS.capaciteUtilisee.delta} deltaSuffix="pt" icon={<Activity size={15} />} delay={160} />
        <KpiCard label="Délai d'enlèvement moyen" value={`${EGRENAGE_KPIS.delaiEnlevementMoyen.value.toLocaleString('fr-FR')} j`} delta={EGRENAGE_KPIS.delaiEnlevementMoyen.delta} icon={<Timer size={15} />} delay={200} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Volumes : collecte vs égrené" sub="12 mois clos" />
          <div className="p-4">
            <MultiLine
              data={EGRENAGE_MONTHLY.map((m) => ({ label: m.label, collecte: m.collecte, egrene: m.egrene }))}
              series={[
                { key: 'collecte', label: 'Coton graine collecté', color: CHART_COLORS.LEAF },
                { key: 'egrene', label: 'Coton graine égrené', color: CHART_COLORS.NAVY },
              ]}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Délai & capacité" sub="Délai d'enlèvement (j) et capacité usines utilisée (%)" />
          <div className="p-4">
            <MultiLine
              data={EGRENAGE_MONTHLY.map((m, i) => ({ label: m.label, capacite: m.capacite, delai: 3.4 + Math.sin(i) * 0.6 + i * 0.05 }))}
              series={[
                { key: 'capacite', label: 'Capacité utilisée (%)', color: CHART_COLORS.INFO },
                { key: 'delai', label: "Délai d'enlèvement (j)", color: CHART_COLORS.SOIL },
              ]}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Répartition du coton graine par filiale" sub="Volume collecté · part de stock non évacué" />
        <div className="p-4">
          <HBars data={EGRENAGE_BY_ZONE.map((z) => ({ label: z.zone, value: z.cotonGraine, hint: `${z.stockPct.toLocaleString('fr-FR')} % en stock` }))} />
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Top 10 des corridors d'évacuation" sub="Triés par volume acheminé" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="th">Corridor</th>
                <th className="th">Volume</th>
                <th className="th">Délai</th>
                <th className="th">% acheminé à l'heure</th>
              </tr>
            </thead>
            <tbody>
              {CORRIDORS.slice(0, 10).map((c) => (
                <tr key={c.route}>
                  <td className="td font-medium">{c.route}</td>
                  <td className="td">{tonnes(c.volume)}</td>
                  <td className="td">{c.delaiJours.toLocaleString('fr-FR')} j</td>
                  <td className={`td font-semibold ${c.tauxAcheminement < 92 ? 'text-neg' : 'text-ink'}`}>
                    {c.tauxAcheminement.toLocaleString('fr-FR')} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4">
        <CardHeader title="Alertes logistiques / industrielles" />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <AlertCard alert={EXTRA_ALERT} />
          {logiAlerts.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Volumes et délais simulés à partir de la série nationale. En phase pilote, brancher les pesées usine, les bons
        d'enlèvement et la GMAO des {num(17)} unités d'égrenage.
      </p>
    </div>
  )
}
