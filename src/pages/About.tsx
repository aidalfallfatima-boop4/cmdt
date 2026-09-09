import { Target, LayoutGrid, Database, FlaskConical, AlertTriangle, Telescope } from 'lucide-react'
import { PageHeader, Card } from '../components/ui'
import { PRODUCT } from '../config/weights'
import { ROLE_LABELS } from '../auth'
import { ZONE_STATS, SECTEURS, MONTHLY } from '../data/dataset'
import type { Role } from '../types'

const CARDS = [
  {
    icon: Target,
    title: 'Objectif',
    body: "Démontrer un système d'intelligence décisionnelle pour la CMDT : voir, comprendre, anticiper, détecter, recommander et simuler — au service de la Direction Générale et des responsables habilités.",
  },
  {
    icon: LayoutGrid,
    title: 'Périmètre',
    body: '13 modules navigables : tableau de bord exécutif, production agricole, secteurs & coopératives, collecte & égrenage, finance, prévisions, risques, copilote IA, scénarios, rapports, bassin cotonnier, vision de déploiement.',
  },
  {
    icon: Database,
    title: 'Données',
    body: `${ZONE_STATS.length} filiales, ${SECTEURS.length} secteurs, ${MONTHLY.length} mois d'historique. Tendances, saisonnalité, écarts par zone et anomalies volontaires, générés de façon déterministe. Aucune donnée réelle de la CMDT.`,
  },
  {
    icon: FlaskConical,
    title: 'Hypothèses de conception',
    body: "Le nombre de secteurs, la structure des filiales, les indicateurs et les pondérations du moteur sont des hypothèses de travail, à valider et calibrer avec les directions métier.",
  },
  {
    icon: AlertTriangle,
    title: 'Limites',
    body: "Modèles statistiques simplifiés exécutés dans le navigateur ; le copilote est un moteur d'intentions, pas un LLM ; l'export PDF et l'authentification sont simulés.",
  },
  {
    icon: Telescope,
    title: 'Vision future',
    body: 'Data Warehouse, modèles ML entraînés sur données réelles, connexion aux SI métier, alerte précoce et couche LLM + RAG explicable — voir la vision de déploiement.',
  },
]

const ROLES: Role[] = [
  'ADMIN',
  'DIRECTION_GENERALE',
  'DIRECTION_PRODUCTION_AGRICOLE',
  'DIRECTION_INDUSTRIELLE',
  'DIRECTION_COMMERCIALE',
  'DIRECTION_FINANCIERE',
  'DIRECTEUR_FILIALE',
  'ANALYSTE',
]

const SECURITY_CHIPS = [
  'RBAC',
  'Journaux d\'audit',
  'Chiffrement',
  'Authentification API',
  'Gouvernance des données',
  'Moindre privilège',
  'Traçabilité des recommandations',
  'Explication des prédictions',
  'Niveau de confiance',
  'Validation humaine',
]

export default function About() {
  return (
    <div className="fade-up">
      <PageHeader title="À propos du prototype" subtitle={`${PRODUCT.name} · ${PRODUCT.version} · ${PRODUCT.disclaimer}`} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <Card key={c.title} className="p-5">
            <c.icon size={20} className="text-leaf" />
            <h3 className="mt-3 text-sm font-semibold text-ink">{c.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{c.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Système de rôles (extensible)</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <span key={r} className="chip">
                {ROLE_LABELS[r]}
              </span>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Sécurité & IA responsable</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SECURITY_CHIPS.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        {PRODUCT.org} — {PRODUCT.tagline}. Chaîne de valeur : Données → Analyse → IA → Prévision → Détection des risques →
        Recommandation → Décision.
      </p>
    </div>
  )
}
