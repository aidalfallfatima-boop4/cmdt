import { MONTHLY, ZONE_STATS, SECTEURS, FINANCE_KPIS } from '../../data/dataset'
import { FORECASTS } from '../forecasting'
import { RISK_REGISTER } from '../risk'
import { rankBy, profitability } from '../analytics'
import { fcfa, num, num1, kgha, usdT, pct } from '../../lib/format'
import type { ChatBlock, ChatMessage } from '../../types'

const LAST = MONTHLY[MONTHLY.length - 1]

export const SUGGESTED_QUESTIONS = [
  'Quelle est la situation de la campagne cotonnière en cours ?',
  'Quels secteurs présentent les plus grands risques cette campagne ?',
  'Pourquoi le rendement baisse-t-il dans certaines zones ?',
  'Quelles filiales sont les plus performantes ?',
  'Prévois la production de coton graine en fin de campagne.',
  'Quelles décisions prioritaires pour la Direction Générale ?',
]

const NOTE_IA: ChatBlock = {
  type: 'note',
  text: 'Aide à la décision — pas de décision automatique. Analyse à valider par les directions métier. Données synthétiques.',
}
const NOTE_MODELE: ChatBlock = {
  type: 'note',
  text: 'MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION.',
}

interface Answer {
  content: string
  blocks: ChatBlock[]
}

function situationCampagne(): Answer {
  const marge = profitability(LAST.recettes, LAST.couts)
  return {
    content:
      "Vue d'ensemble de la campagne cotonnière en cours, à partir des séries d'exploitation consolidées.",
    blocks: [
      {
        type: 'kpis',
        kpis: [
          { label: 'Production coton graine', value: `${num(LAST.cotonGraine)} t`, delta: '+7,2 %', tone: 'pos' },
          { label: 'Fibre produite', value: `${num(LAST.fibre)} t`, delta: '+7,0 %', tone: 'pos' },
          { label: 'Rendement moyen', value: kgha(LAST.rendement), delta: '+3,1 %', tone: 'pos' },
          { label: 'Recettes', value: fcfa(LAST.recettes), delta: '+6,8 %', tone: 'pos' },
          { label: "Taux d'égrenage", value: `${num1(LAST.tauxEgrenage)} %`, delta: '+0,6 pt', tone: 'pos' },
          { label: 'Taux de remboursement', value: `${num1(LAST.tauxRemboursement)} %`, delta: '+1,1 pt', tone: 'pos' },
        ],
      },
      {
        type: 'text',
        text: `La dynamique de campagne est positive, tirée par les filiales Nord-Est et Sud. La marge filière ressort à ${num1(marge)} %. Deux points de vigilance : le repli du cours mondial de la fibre (-4,5 %) et la dégradation localisée du remboursement du crédit intrants.`,
      },
      NOTE_IA,
    ],
  }
}

function secteursRisque(): Answer {
  const worst = rankBy(SECTEURS.filter((s) => s.score < 55), (s) => s.score, false).slice(0, 3)
  const list = worst.length ? worst : rankBy(SECTEURS, (s) => s.score, false).slice(0, 3)
  return {
    content: 'Secteurs les plus exposés cette campagne (score de performance sous le seuil de 55).',
    blocks: [
      {
        type: 'bars',
        bars: list.map((s) => ({
          label: `${s.name} · ${s.zone}`,
          value: s.score,
          hint: `risque ${s.risk.toLowerCase()} · rendement ${num(s.rendement)} kg/ha`,
        })),
      },
      {
        type: 'list',
        items: [
          `${list[0].name} : revue agronomique sur site sous 10 jours et plan de maîtrise du coût de revient.`,
          `${list[1].name} : analyse des impayés par SCOOPS et conditionnement de la campagne suivante à un plan d'apurement.`,
          `${list[2].name} : mutualisation logistique avec le secteur performant le plus proche et renforcement du conseil sur la fertilité.`,
        ],
      },
      NOTE_IA,
    ],
  }
}

function rendementBaisse(): Answer {
  const byZone = rankBy(ZONE_STATS, (z) => z.rendement, true)
  return {
    content: 'Trois facteurs expliquent le recul du rendement observé dans certaines zones.',
    blocks: [
      {
        type: 'list',
        items: [
          'Déficit pluviométrique localisé et mauvaise répartition des pluies sur les parcelles semées tardivement.',
          'Pression parasitaire (jassides) et perte d\'efficacité des pyréthrinoïdes par résistance.',
          'Baisse de fertilité des sols des vieilles zones, amplifiée par les retards de mise en place des intrants.',
        ],
      },
      {
        type: 'bars',
        bars: byZone.map((z) => ({ label: z.zone, value: z.rendement, hint: kgha(z.rendement) })),
      },
      {
        type: 'note',
        text: "Impact : sans correction, l'écart de rendement se répercute sur le volume de coton graine, le taux de remboursement et la ristourne de fin de campagne.",
      },
    ],
  }
}

function filialesPerformantes(): Answer {
  const ranked = rankBy(ZONE_STATS, (z) => z.score, true)
  return {
    content: 'Classement des filiales par score de performance consolidé.',
    blocks: [
      {
        type: 'bars',
        bars: ranked.map((z) => ({
          label: z.zone,
          value: z.score,
          hint: `${z.band.replace('_', ' ').toLowerCase()} · croissance ${pct(z.growth)}`,
        })),
      },
      {
        type: 'text',
        text: `${ranked[0].zone} est en tête (rendement et coût de revient maîtrisés). ${ranked[ranked.length - 1].zone} ferme la marche, pénalisée par des rendements plus faibles et une pression sur les coûts.`,
      },
      NOTE_IA,
    ],
  }
}

function previsionProduction(): Answer {
  const f = FORECASTS[0]
  return {
    content: `Prévision de production de coton graine — modèle « ${f.model} ».`,
    blocks: [
      {
        type: 'kpis',
        kpis: [
          { label: 'Prévision 30 j', value: `${num(f.h30)} t`, tone: 'flat' },
          { label: 'Prévision 90 j', value: `${num(f.h90)} t`, tone: 'flat' },
          { label: 'Fin de campagne', value: `${num(f.finCampagne)} t`, tone: 'flat' },
        ],
      },
      {
        type: 'bars',
        bars: f.forecast.map((p) => ({
          label: p.label,
          value: p.value,
          hint: `intervalle 90 % : ${num(p.lo)} – ${num(p.hi)} t`,
        })),
      },
      NOTE_MODELE,
    ],
  }
}

function decisionsDG(): Answer {
  return {
    content: 'Décisions prioritaires proposées à la Direction Générale, par ordre d\'urgence.',
    blocks: [
      {
        type: 'list',
        items: [
          'Lancer un plan de redressement des secteurs sous le seuil de performance, piloté par la Direction de la Production Agricole.',
          'Sécuriser l\'approvisionnement et le calendrier de mise en place des intrants avec le pool bancaire et les fournisseurs.',
          'Couvrir le risque de prix : fixations échelonnées des ventes de fibre et mécanisme de lissage / ristourne.',
          'Désengorger les usines et les corridors d\'évacuation aux pics de collecte (maintenance préventive, capacités de transport).',
          'Renforcer le conseil agricole sur la fertilité et la rotation des cultures dans les vieilles zones.',
          'Engager la gouvernance de la donnée (Data Warehouse, Phase 2) pour fiabiliser le pilotage.',
        ],
      },
      NOTE_IA,
    ],
  }
}

function marche(): Answer {
  const f = FORECASTS[2]
  return {
    content: 'Situation du marché mondial de la fibre et exposition de la filière.',
    blocks: [
      {
        type: 'kpis',
        kpis: [
          { label: 'Cours fibre (Cotlook A)', value: usdT(LAST.coursFibre), delta: '-4,5 %', tone: 'neg' },
          { label: 'Projection 90 j', value: usdT(f.h90), tone: 'neg' },
          { label: 'Part de la fibre exportée', value: '≈ 98 %', tone: 'flat' },
        ],
      },
      {
        type: 'text',
        text: "La quasi-totalité de la fibre est exportée : les recettes sont directement sensibles au cours mondial et au change USD/FCFA. La projection Cotlook A reste baissière, ce qui plaide pour une couverture partielle des ventes.",
      },
      NOTE_MODELE,
    ],
  }
}

function finance(): Answer {
  return {
    content: 'Situation financière de la filière — recettes, coûts, intrants et marge.',
    blocks: [
      {
        type: 'kpis',
        kpis: [
          { label: 'Recettes', value: fcfa(FINANCE_KPIS.recettes.value), delta: pct(FINANCE_KPIS.recettes.delta), tone: 'pos' },
          { label: 'Coûts filière', value: fcfa(FINANCE_KPIS.couts.value), delta: pct(FINANCE_KPIS.couts.delta), tone: 'neg' },
          { label: 'Marge filière', value: `${num1(FINANCE_KPIS.marge.value)} %`, delta: `${pct(FINANCE_KPIS.marge.delta)} pt`, tone: 'pos' },
          { label: 'Intrants distribués', value: fcfa(FINANCE_KPIS.intrants.value), delta: pct(FINANCE_KPIS.intrants.delta), tone: 'flat' },
          { label: 'Subvention État', value: fcfa(FINANCE_KPIS.subvention.value), tone: 'flat' },
          { label: 'Écart budgétaire', value: `${num1(FINANCE_KPIS.variance.value)} %`, tone: 'flat' },
        ],
      },
      {
        type: 'text',
        text: `Prix d'achat au producteur : ${FINANCE_KPIS.prixAchat} FCFA/kg (1er choix). Ristourne de fin de campagne estimée à ${FINANCE_KPIS.ristourneEstimee} FCFA/kg — indicatif, fonction du résultat consolidé.`,
      },
      NOTE_IA,
    ],
  }
}

function risquesRegistre(): Answer {
  const top = rankBy(RISK_REGISTER, (r) => r.score, true).slice(0, 4)
  return {
    content: 'Risques structurels les plus élevés du registre de campagne.',
    blocks: [
      { type: 'bars', bars: top.map((r) => ({ label: r.label, value: r.score, hint: r.category })) },
      { type: 'list', items: top.map((r) => `${r.category} — ${r.action}`) },
      NOTE_IA,
    ],
  }
}

interface Intent {
  test: RegExp
  answer: () => Answer
}

const INTENTS: Intent[] = [
  { test: /situation|vue d.?ensemble|campagne en cours|état de la campagne|où en/i, answer: situationCampagne },
  { test: /rendement.*(baiss|recul|chute)|pourquoi.*rendement|(baiss|recul).*rendement/i, answer: rendementBaisse },
  { test: /filiale|zone.*performan|performan.*(filiale|zone)|meilleure?s? (filiale|zone|région)/i, answer: filialesPerformantes },
  { test: /pr[ée]v(ois|ision|is).*production|production.*fin de campagne|forecast.*production/i, answer: previsionProduction },
  { test: /d[ée]cision|priorit[ée]|que faire|recommand.*(dg|direction g)/i, answer: decisionsDG },
  { test: /cours|march[ée]|export|cotlook|prix mondial|change|dollar/i, answer: marche },
  { test: /finance|co[ûu]t|intrant|marge|subvention|budget|tr[ée]sorerie/i, answer: finance },
  { test: /registre|matrice.*risque|risques? structurel/i, answer: risquesRegistre },
]

function fallback(q: string): Answer {
  return {
    content: `Je n'ai pas de lecture directe pour « ${q.trim()} ». Voici les analyses que je peux produire :`,
    blocks: [
      { type: 'list', items: SUGGESTED_QUESTIONS },
      {
        type: 'note',
        text: 'Prototype — moteur de réponses simulées, sans LLM. En Phase 2 : LLM + RAG sur le Data Warehouse, avec citations des sources et niveau de confiance.',
      },
    ],
  }
}

function resolve(question: string): Answer {
  // Cas « secteurs à risque » vs « registre de risques ».
  if (/(secteur|zpa).*(risque|difficult|pire|exposé)|(risque|difficult|pire|exposé).*(secteur|zpa)/i.test(question))
    return secteursRisque()
  for (const intent of INTENTS) if (intent.test.test(question)) return intent.answer()
  if (/risque|exposé|menace|vuln[ée]rab/i.test(question)) return risquesRegistre()
  return fallback(question)
}

let seq = 0
const nextId = (): string => `msg-${++seq}-${Date.now().toString(36)}`

export function userMessage(text: string): ChatMessage {
  return { id: nextId(), role: 'user', content: text }
}

export function askCopilot(question: string): ChatMessage {
  const a = resolve(question)
  return { id: nextId(), role: 'assistant', content: a.content, blocks: a.blocks }
}

export const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Bonjour. Je suis le copilote CMDT AI. Interrogez les données de production, d'égrenage, financières et territoriales de la filière cotonnière pour obtenir des analyses décisionnelles. Prototype — réponses simulées.",
}
