import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Sprout, Gauge, Landmark, Coins, Scale, HandCoins } from 'lucide-react'
import { PageHeader, Card, CardHeader, PerfBadge, RiskBadge } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { MultiLine, CHART_COLORS } from '../components/charts'
import { RecommendationCard } from '../components/cards'
import { SECTEURS } from '../data/dataset'
import { num, tonnes, kgha, fcfa } from '../lib/format'

function ScoreRing({ score }: { score: number }) {
  const r = 46
  const c = 2 * Math.PI * r
  const off = c * (1 - score / 100)
  const color = score >= 70 ? CHART_COLORS.POS : score >= 55 ? CHART_COLORS.INFO : score >= 40 ? CHART_COLORS.SOIL : CHART_COLORS.NEG
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#E4E7EC" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" className="fill-ink" fontSize="22" fontWeight="700">
        {score.toLocaleString('fr-FR')}
      </text>
      <text x="60" y="74" textAnchor="middle" className="fill-ink-faint" fontSize="9">
        SCORE / 100
      </text>
    </svg>
  )
}

export default function SecteurDetail() {
  const { id } = useParams()
  const s = SECTEURS.find((x) => x.id === id)
  if (!s) return <Navigate to="/secteurs" replace />

  const netAvg = Math.round(SECTEURS.reduce((a, x) => a + x.score, 0) / SECTEURS.length)
  const nearestPeer = [...SECTEURS]
    .filter((x) => x.zoneId === s.zoneId && x.id !== s.id)
    .sort((a, b) => b.score - a.score)[0]

  const diag =
    s.score >= 70
      ? "Surperformance portée par le rendement et un coût de revient maîtrisé. Le secteur peut servir de référence pour la mutualisation logistique et le conseil technique dans la filiale."
      : s.score >= 55
        ? "Performance dans la moyenne du réseau. La marge reste limitée par les coûts d'intrants et de transport ; un gain sur le coût de revient débloquerait le passage à la bande supérieure."
        : "Sous-performance : recul du rendement par rapport à la trajectoire attendue, pression sur le coût de revient et taux de remboursement en retrait. Un plan de redressement ciblé est requis."

  const recs = [
    s.rendement < 780 && {
      title: 'Revue agronomique sur site sous 10 jours',
      body: "Diagnostiquer les causes du déficit de rendement (dates de semis, fertilisation, pression parasitaire) et calibrer un plan d'accompagnement par SCOOPS.",
      tag: 'Production agricole',
      confidence: 74,
    },
    s.coutRevient > 470 && {
      title: 'Plan de maîtrise du coût de revient',
      body: 'Analyser les postes intrants et transport, renégocier les rotations logistiques et cibler les parcelles les plus coûteuses à encadrer.',
      tag: 'Contrôle de gestion',
      confidence: 68,
    },
    nearestPeer && {
      title: `Mutualisation logistique avec ${nearestPeer.name}`,
      body: `Partager les moyens d'évacuation et de stockage avec le secteur performant le plus proche (${nearestPeer.name}, score ${nearestPeer.score.toLocaleString('fr-FR')}).`,
      tag: 'Logistique',
      confidence: 62,
    },
    s.tauxRemboursement < 92 && {
      title: 'Renforcement du conseil sur la fertilité et le remboursement',
      body: "Coupler l'accès aux intrants de la campagne suivante à un plan d'apurement et intensifier la fumure organique / la rotation.",
      tag: 'Financier',
      confidence: 66,
    },
  ].filter(Boolean) as { title: string; body: string; tag: string; confidence: number }[]

  return (
    <div className="fade-up">
      <Link to="/secteurs" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> Retour au réseau
      </Link>
      <PageHeader
        title={s.name}
        subtitle={`${s.type} · ${s.zone} · Rattachement : ${s.usine}`}
        right={
          <>
            <RiskBadge level={s.risk} />
            <PerfBadge band={s.band} />
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <ScoreRing score={s.score} />
            <div className="text-sm">
              <p className="text-ink-muted">
                Écart vs moyenne réseau :{' '}
                <span className={s.score >= netAvg ? 'font-semibold text-pos' : 'font-semibold text-neg'}>
                  {s.score >= netAvg ? '+' : ''}
                  {(s.score - netAvg).toLocaleString('fr-FR')}
                </span>
              </p>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-4"><dt className="text-ink-faint">Producteurs</dt><dd className="font-medium">{num(s.producteurs)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-faint">SCOOPS</dt><dd className="font-medium">{num(s.scoops)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-faint">Remboursement</dt><dd className="font-medium">{s.tauxRemboursement.toLocaleString('fr-FR')} %</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-faint">Classement 1er choix</dt><dd className="font-medium">{s.classement1erChoix.toLocaleString('fr-FR')} %</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-faint">Localisation</dt><dd className="font-medium">{s.zone}</dd></div>
              </dl>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-3">
          <KpiCard label="Coton graine" value={tonnes(s.cotonGraine)} icon={<Sprout size={15} />} accent />
          <KpiCard label="Rendement" value={kgha(s.rendement)} icon={<Gauge size={15} />} delay={40} />
          <KpiCard label="Recettes" value={fcfa(s.recettes)} icon={<Landmark size={15} />} delay={80} />
          <KpiCard label="Coûts" value={fcfa(s.couts)} icon={<Coins size={15} />} delay={120} />
          <KpiCard label="Coût de revient" value={`${num(s.coutRevient)} FCFA/kg`} icon={<Scale size={15} />} delay={160} />
          <KpiCard label="Remboursement" value={`${s.tauxRemboursement.toLocaleString('fr-FR')} %`} icon={<HandCoins size={15} />} delay={200} />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title="Historique 12 mois" sub="Coton graine, recettes et rendement" />
        <div className="p-4">
          <MultiLine
            data={s.history.map((h) => ({ label: h.label, cotonGraine: h.cotonGraine, recettes: h.recettes, rendement: h.rendement }))}
            series={[
              { key: 'cotonGraine', label: 'Coton graine (t)', color: CHART_COLORS.LEAF },
              { key: 'recettes', label: 'Recettes (FCFA)', color: CHART_COLORS.INFO },
              { key: 'rendement', label: 'Rendement (kg/ha)', color: CHART_COLORS.SOIL },
            ]}
          />
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Diagnostic IA" sub="Lecture décisionnelle du secteur" />
          <div className="p-4">
            <p className="text-sm leading-relaxed text-ink-muted">{diag}</p>
            <div className="mt-3">
              <MultiLine
                data={s.history.map((h) => ({ label: h.label, rendement: h.rendement, remb: h.tauxRemboursement }))}
                series={[
                  { key: 'rendement', label: 'Rendement', color: CHART_COLORS.NAVY },
                  { key: 'remb', label: 'Remboursement %', color: CHART_COLORS.POS },
                ]}
                height={180}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {recs.slice(0, 3).map((r) => (
            <RecommendationCard key={r.title} {...r} />
          ))}
        </div>
      </div>
    </div>
  )
}
