import { Database, Workflow, LineChart, ShieldCheck } from 'lucide-react'
import { PageHeader, Card, CardHeader } from '../components/ui'
import { AIChat } from '../components/AIChat'

const CAPS = [
  { icon: Database, title: 'Interrogation des données', body: 'Production, égrenage, finance et territoire — en langage naturel, sur le jeu de données consolidé.' },
  { icon: Workflow, title: 'Analyse décisionnelle', body: 'Structure WHAT · WHY · SO WHAT · NOW WHAT : le constat, la cause, l\'enjeu, l\'action.' },
  { icon: LineChart, title: 'Prévision & scénarios', body: 'Projections de production, rendement, cours et recettes ; lecture des scénarios de décision.' },
  { icon: ShieldCheck, title: 'IA responsable', body: 'Aide à la décision, pas de décision automatique. Chaque analyse est à valider par les directions métier.' },
]

export default function Copilot() {
  return (
    <div className="fade-up">
      <PageHeader title="Intelligence IA" subtitle="Copilote d'analyse décisionnelle de la filière cotonnière" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIChat />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Ce que le copilote peut faire" />
            <div className="space-y-3 p-4">
              {CAPS.map((c) => (
                <div key={c.title} className="flex gap-3">
                  <c.icon size={18} className="mt-0.5 shrink-0 text-leaf" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.title}</p>
                    <p className="text-xs text-ink-muted">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-l-4 border-l-warn p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warn">Prototype</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              Le copilote est un <strong>moteur d'intentions</strong> : il reconnaît des questions types et compose des
              réponses à partir du jeu de données synthétique. Aucun modèle de langage n'est connecté.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              En Phase 2 : LLM + RAG sur le Data Warehouse, avec citation des sources, niveau de confiance et journal
              d'audit des recommandations.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
