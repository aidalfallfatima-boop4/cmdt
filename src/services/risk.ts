import { SECTEURS } from '../data/dataset'
import type { RiskItem } from '../types'

export const SECTEURS_A_RISQUE = SECTEURS.filter((s) => s.score < 55)
export const SECTEURS_REMB_FAIBLE = SECTEURS.filter((s) => s.tauxRemboursement < 92)

const N = SECTEURS_A_RISQUE.length
const NR = SECTEURS_REMB_FAIBLE.length

export const RISK_REGISTER: RiskItem[] = [
  {
    id: 'r1',
    label: `Déficit pluviométrique / mauvaise répartition des pluies sur ${N} secteurs`,
    category: 'Climatique',
    probability: 0.58,
    impact: 0.78,
    score: 80,
    trend: 'up',
    action:
      "Activer le suivi pluviométrique décadaire par secteur, prépositionner des semences de cycle court et cibler le conseil sur les dates de semis dans les zones déficitaires.",
  },
  {
    id: 'r2',
    label: 'Infestation de jassides et résistance aux pyréthrinoïdes',
    category: 'Phytosanitaire',
    probability: 0.64,
    impact: 0.62,
    score: 70,
    trend: 'up',
    action:
      "Sécuriser un stock tampon d'insecticides à matières actives alternatives et renforcer le conseil sur la rotation des familles chimiques et le seuil d'intervention.",
  },
  {
    id: 'r3',
    label: 'Volatilité du cours mondial (Cotlook A) et du change USD/FCFA',
    category: 'Marché',
    probability: 0.8,
    impact: 0.66,
    score: 68,
    trend: 'flat',
    action:
      "Mettre en place une politique de couverture partielle des ventes (fixations échelonnées) et un mécanisme de lissage du prix producteur adossé au fonds de soutien.",
  },
  {
    id: 'r4',
    label: 'Retard de mise en place des intrants (engrais, pesticides)',
    category: 'Financier',
    probability: 0.52,
    impact: 0.68,
    score: 62,
    trend: 'flat',
    action:
      "Verrouiller le calendrier d'appels d'offres et de préfinancement avec le pool bancaire, et suivre un tableau de bord logistique intrants par filiale jusqu'aux magasins de secteur.",
  },
  {
    id: 'r5',
    label: `Baisse du taux de remboursement du crédit intrants dans ${NR} secteurs`,
    category: 'Financier',
    probability: 0.55,
    impact: 0.6,
    score: 58,
    trend: 'up',
    action:
      "Analyser les causes d'impayés par SCOOPS, renforcer la caution solidaire et conditionner l'accès à la campagne suivante à un plan d'apurement.",
  },
  {
    id: 'r6',
    label: 'Tension de trésorerie filière → retard de paiement du coton graine',
    category: 'Financier',
    probability: 0.48,
    impact: 0.72,
    score: 57,
    trend: 'flat',
    action:
      "Sécuriser la ligne de crédit de campagne et un calendrier de décaissement calé sur le pic de collecte novembre-février, avec reporting hebdomadaire à la Direction Financière.",
  },
  {
    id: 'r7',
    label: "Engorgement / pannes des usines d'égrenage, stock fibre non évacué",
    category: 'Industriel',
    probability: 0.5,
    impact: 0.58,
    score: 52,
    trend: 'flat',
    action:
      "Planifier la maintenance préventive hors pic, lisser l'affectation du coton graine entre usines et réserver des capacités de transport pour l'évacuation de la fibre.",
  },
  {
    id: 'r8',
    label: "Concurrence de l'orpaillage sur la main-d'œuvre et les superficies",
    category: 'Social',
    probability: 0.66,
    impact: 0.48,
    score: 49,
    trend: 'up',
    action:
      "Cibler les zones exposées avec un appui à la mécanisation et à la culture attelée pour réduire la contrainte de main-d'œuvre, et suivre l'évolution des emblavures.",
  },
  {
    id: 'r9',
    label: 'Concentration de la production sur la zone Nord-Est (~34 %)',
    category: 'Marché',
    probability: 0.7,
    impact: 0.44,
    score: 46,
    trend: 'flat',
    action:
      "Diversifier l'appui productif vers les filiales Centre et Ouest et sécuriser des itinéraires d'évacuation alternatifs pour réduire la dépendance à un seul bassin.",
  },
  {
    id: 'r10',
    label: 'Baisse tendancielle de la fertilité des sols / rendement des vieilles zones',
    category: 'Climatique',
    probability: 0.62,
    impact: 0.46,
    score: 43,
    trend: 'up',
    action:
      "Promouvoir la rotation coton-céréales-légumineuses, la fumure organique et les cultures de couverture, et suivre des parcelles de référence par secteur.",
  },
]
