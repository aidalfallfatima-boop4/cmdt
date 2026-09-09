import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react'
import { PageHeader, Card, CardHeader } from '../components/ui'

const PHASES = [
  {
    name: 'Prototype',
    status: 'En cours',
    body: "Maquette sur données synthétiques, validation de la valeur métier et de l'UX avec la Direction Générale.",
    items: ['Design system institutionnel', 'Tableau de bord + 10 modules', 'Moteur analytique & copilote simulés'],
  },
  {
    name: 'Pilote avec données réelles',
    status: 'À venir',
    body: 'Une filiale pilote ; Data Warehouse (PostgreSQL) ; premiers modèles ML (rendement, production).',
    items: ['ETL des sources pilotes', 'Data Warehouse', 'Modèles entraînés et back-testés'],
  },
  {
    name: 'Connexion aux systèmes existants',
    status: 'À venir',
    body: 'SI production agricole, égrenage / bascules, finance / crédit de campagne, commercialisation ; imagerie satellitaire / pluviométrie.',
    items: ['Connecteurs SI métier', 'Données météo & satellite', 'RBAC, audit, chiffrement'],
  },
  {
    name: 'Déploiement institutionnel',
    status: 'À venir',
    body: 'Généralisation aux 5 filiales, formation, conduite du changement, exploitation en continu.',
    items: ['Déploiement multi-filiales', 'Formation des utilisateurs', 'Exploitation & support'],
  },
  {
    name: 'Intelligence prédictive avancée',
    status: 'À venir',
    body: 'Recommandations proactives, alerte précoce ravageurs / sécheresse, optimisation logistique des évacuations, LLM + RAG sur le patrimoine de données.',
    items: ['Alerte précoce ravageurs / sécheresse', 'Optimisation des corridors', 'LLM + RAG explicable'],
  },
]

const ARCHI = [
  'Sources (production, industrie, finance, commercialisation, territoire, météo / satellite)',
  'Data Integration (ETL / CDC)',
  'Data Lake / Data Warehouse (PostgreSQL)',
  'Analytics Engine (KPI, scores, classements)',
  'ML Engine (prévision, anomalies, risques)',
  'AI / LLM Layer (copilote, RAG, explications)',
  'Decision Engine (recommandations, scénarios)',
  'Dashboard · Copilot · Reports',
]

export default function Roadmap() {
  return (
    <div className="fade-up">
      <PageHeader title="Vision de déploiement" subtitle="Du prototype à l'intelligence prédictive de la filière cotonnière" />

      <div className="relative space-y-4 border-l-2 border-line pl-6">
        {PHASES.map((p, i) => (
          <div key={p.name} className="relative">
            <span className="absolute -left-[31px] top-1 grid h-5 w-5 place-items-center rounded-full bg-surface">
              {i === 0 ? <CheckCircle2 size={18} className="text-leaf" /> : <Circle size={16} className="text-ink-faint" />}
            </span>
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-ink">
                  Phase {i + 1} — {p.name}
                </h3>
                <span className={`chip ${i === 0 ? 'border-leaf/40 text-leaf-dark' : ''}`}>{p.status}</span>
              </div>
              <p className="mt-1.5 text-xs text-ink-muted">{p.body}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.items.map((it) => (
                  <li key={it} className="rounded-md bg-navy-50 px-2 py-1 text-[11px] text-ink-muted">
                    {it}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Architecture cible" sub="Chaîne de traitement de la donnée à la décision" />
        <div className="flex flex-wrap items-center gap-2 p-4">
          {ARCHI.map((a, i) => (
            <div key={a} className="flex items-center gap-2">
              <span className="rounded-md border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink">
                <span className="mr-1.5 font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                {a}
              </span>
              {i < ARCHI.length - 1 && <span className="text-ink-faint">→</span>}
            </div>
          ))}
        </div>
        <div className="m-4 mt-0 flex items-start gap-2 rounded-card border border-info/30 bg-infobg/60 p-3 text-xs text-info">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          <p>
            Sécurité transverse & IA responsable : chiffrement, RBAC et journal d'audit sur toute la chaîne ; traçabilité
            et explication des prédictions, niveau de confiance affiché, validation humaine obligatoire — aucune décision
            critique automatisée.
          </p>
        </div>
      </Card>
    </div>
  )
}
