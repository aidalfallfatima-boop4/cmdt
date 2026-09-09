import { MONTHLY, ZONE_STATS, SECTEURS } from './dataset'
import { fcfa } from '../lib/format'
import { profitability } from '../services/analytics'
import type { Insight, Alert, ReportCard, AppNotification } from '../types'

const LAST = MONTHLY[MONTHLY.length - 1]
const nRisque = SECTEURS.filter((s) => s.score < 55).length
const marge = profitability(LAST.recettes, LAST.couts)
const topZone = [...ZONE_STATS].sort((a, b) => b.score - a.score)[0]

export const INSIGHTS: Insight[] = [
  {
    id: 'i1',
    level: 'positif',
    title: 'La production de coton graine progresse de +7,2 % sur la campagne',
    detail:
      "Croissance portée par les filiales Nord-Est et Sud, sous l'effet conjugué d'une pluviométrie favorable et d'une légère extension des superficies emblavées. La dynamique reste concentrée sur le bassin historique.",
    metricHint: 'Production coton graine',
  },
  {
    id: 'i2',
    level: 'risque',
    title: `${nRisque} secteurs présentent un risque élevé de sous-performance`,
    detail:
      'Profil commun : rendement en recul par rapport à la trajectoire attendue, coût de revient en hausse plus rapide que les recettes, et taux de remboursement du crédit intrants dégradé. Un plan de redressement ciblé est recommandé.',
    metricHint: 'Score de performance',
  },
  {
    id: 'i3',
    level: 'positif',
    title: `Le taux d'égrenage gagne +0,6 pt, à ${LAST.tauxEgrenage.toLocaleString('fr-FR')} %`,
    detail:
      "Le rendement fibre se maintient au-dessus de la cible interne de 42 %, signe d'une qualité de coton graine et d'un réglage des usines satisfaisants sur la période de pointe.",
    metricHint: "Taux d'égrenage",
  },
  {
    id: 'i4',
    level: 'attention',
    title: 'Le cours mondial de la fibre recule de -4,5 %',
    detail:
      "La projection Cotlook A reste orientée à la baisse. Combinée à l'exposition au change USD/FCFA, cette érosion pèse sur les recettes d'exportation attendues et sur la marge filière. Une couverture partielle des ventes est à étudier.",
    metricHint: 'Cours mondial fibre',
  },
  {
    id: 'i5',
    level: 'information',
    title: `Recettes consolidées du mois : ${fcfa(LAST.recettes)}`,
    detail: `Marge filière estimée à ${marge.toLocaleString('fr-FR')} % sur la période. La filiale la plus performante est ${topZone.zone} (score ${topZone.score.toLocaleString('fr-FR')}).`,
    metricHint: 'Recettes',
  },
  {
    id: 'i6',
    level: 'attention',
    title: "Le coût de revient du coton graine progresse dans plusieurs secteurs",
    detail:
      "Postes intrants et transport en cause. À rythme constant, l'écart avec les recettes réduit la ristourne de fin de campagne redistribuable aux producteurs.",
    metricHint: 'Coût de revient',
  },
]

export const ALERTS: Alert[] = [
  {
    id: 'a1',
    date: '2026-01-26',
    severity: 'CRITIQUE',
    subject: 'Déficit pluviométrique confirmé sur le secteur de Dioïla',
    scope: 'Filiale CMDT Centre',
    impact: 'Rendement projeté -18 % vs attendu · remboursement crédit intrants sous pression',
    status: 'OUVERTE',
    detail:
      "Cumul pluviométrique décadaire inférieur de 30 % à la normale sur les trois dernières décades. Risque de perte sur les parcelles semées tardivement. Revue agronomique sur site demandée sous 10 jours.",
  },
  {
    id: 'a2',
    date: '2026-01-24',
    severity: 'ELEVE',
    subject: "Coût d'égrenage de l'usine de M'Pessoba au-dessus de la moyenne du réseau",
    scope: 'Direction Industrielle',
    impact: "Coût unitaire +22 % vs tendance · marge filière érodée sur la zone Nord-Est",
    status: 'EN_COURS',
    detail:
      "Surconsommation énergétique et heures de maintenance non planifiée. Audit technique lancé, plan de fiabilisation attendu.",
  },
  {
    id: 'a3',
    date: '2026-01-22',
    severity: 'ELEVE',
    subject: "Délai d'enlèvement anormal sur le corridor Dioïla → Usine Fana",
    scope: 'Logistique / évacuation',
    impact: '6,2 j vs 3,5 j attendus · coton graine exposé aux intempéries et aux pertes de poids',
    status: 'OUVERTE',
    detail:
      "Sous-capacité de transport au pic de collecte. Renfort de rotations camions et priorisation du corridor demandés.",
  },
  {
    id: 'a4',
    date: '2026-01-20',
    severity: 'MOYEN',
    subject: 'Baisse du taux de remboursement du crédit intrants dans plusieurs secteurs',
    scope: 'Direction Financière / UN-SCPC',
    impact: 'Taux moyen des secteurs concernés sous 90 % · risque sur le bouclage du crédit de campagne',
    status: 'EN_COURS',
    detail:
      "Concentration des impayés sur un nombre limité de SCOOPS. Plans d'apurement en cours de négociation.",
  },
  {
    id: 'a5',
    date: '2026-01-18',
    severity: 'MOYEN',
    subject: "Rentabilité du secteur de Kéniéba sous le seuil cible",
    scope: 'Filiale CMDT Ouest',
    impact: "Coût de revient > recettes attendues · concurrence de l'orpaillage sur la main-d'œuvre",
    status: 'OUVERTE',
    detail:
      "Rendement bas et emblavures en retrait. Appui à la mécanisation et au conseil technique à cibler sur le secteur.",
  },
  {
    id: 'a6',
    date: '2026-01-15',
    severity: 'FAIBLE',
    subject: 'Écart budgétaire de campagne à surveiller sur les coûts filière',
    scope: 'Contrôle de gestion',
    impact: "Réalisé légèrement au-dessus du budget sur le poste transport",
    status: 'RESOLUE',
    detail: 'Écart expliqué par le renchérissement du carburant. Révision de l\'enveloppe transport validée.',
  },
]

export const REPORTS: ReportCard[] = [
  {
    id: 'rep-q',
    kind: 'Quotidien',
    title: 'Note quotidienne de campagne à la Direction Générale',
    period: '28 janvier 2026',
    generatedAt: '2026-01-28 06:30',
    pages: 3,
    highlights: [
      'Collecte cumulée conforme à la trajectoire de campagne (+7,2 %)',
      '3 alertes ouvertes : pluviométrie Dioïla, corridor Fana, coût usine M\'Pessoba',
      'Cours Cotlook A en repli — recettes export sous surveillance',
    ],
  },
  {
    id: 'rep-h',
    kind: 'Hebdomadaire',
    title: "Revue hebdomadaire de la collecte et de l'égrenage",
    period: 'Semaine du 19 au 25 janvier 2026',
    generatedAt: '2026-01-26 08:00',
    pages: 9,
    highlights: [
      "Taux d'égrenage moyen 42,6 % — au-dessus de la cible interne",
      'Capacité usines utilisée à un niveau de pointe sur la zone Nord-Est',
      'Stock de fibre non évacué en hausse — priorité aux corridors vers Bamako',
    ],
  },
  {
    id: 'rep-m',
    kind: 'Mensuel',
    title: 'Rapport exécutif mensuel — pilotage de la filière',
    period: 'Janvier 2026',
    generatedAt: '2026-01-28 07:15',
    pages: 24,
    highlights: [
      'Production, rendement et recettes en progression sur la campagne',
      `${nRisque} secteurs classés à risque — plan de redressement proposé`,
      'Marge filière estimée en légère amélioration, sensible au cours mondial',
    ],
  },
  {
    id: 'rep-b',
    kind: 'Bilan de campagne',
    title: 'Synthèse stratégique de campagne cotonnière',
    period: 'Campagne 2025 / 2026 (12 mois clos)',
    generatedAt: '2026-01-27 18:40',
    pages: 41,
    highlights: [
      'Bilan production, industrie, commercialisation et finance consolidé',
      'Cartographie des risques structurels et recommandations pluriannuelles',
      'Scénarios de prix producteur et de ristourne de fin de campagne',
    ],
  },
]

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', kind: 'alerte', text: 'Nouvelle alerte critique : déficit pluviométrique sur le secteur de Dioïla', time: 'il y a 2 h', unread: true },
  { id: 'n2', kind: 'anomalie', text: "Anomalie détectée : coût d'égrenage de l'usine M'Pessoba +22 % vs tendance", time: 'il y a 5 h', unread: true },
  { id: 'n3', kind: 'prevision', text: 'Prévision de production fin de campagne mise à jour (intervalle 90 %)', time: 'il y a 1 j', unread: true },
  { id: 'n4', kind: 'rapport', text: 'Le rapport exécutif mensuel de janvier 2026 est disponible', time: 'il y a 1 j', unread: false },
  { id: 'n5', kind: 'anomalie', text: "Anomalie logistique : délai d'enlèvement corridor Dioïla → Usine Fana", time: 'il y a 2 j', unread: false },
]
