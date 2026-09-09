import { makeRng } from './rng'
import { ZONES, SECTEUR_NAMES, USINES } from './zones'
import {
  performanceScore,
  bandOf,
  riskScore,
  riskLevelOf,
  trendOf,
  profitability,
  volatilityPct,
  growthRate,
  round1,
  clamp,
} from '../services/analytics'
import type { MonthPoint, ZoneStat, Secteur, SecteurMonth } from '../types'

const rng = makeRng(20260115)

/* ------------------------------------------------------------------ *
 *  Calendrier — 12 mois clos, se terminant en janvier 2026.
 * ------------------------------------------------------------------ */
const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

export interface CalMonth {
  month: string
  label: string
  mNum: number
}

function buildCalendar(): CalMonth[] {
  const out: CalMonth[] = []
  let y = 2025
  let m = 2 // février 2025
  for (let i = 0; i < 12; i++) {
    out.push({
      month: `${y}-${String(m).padStart(2, '0')}`,
      label: `${MONTHS_FR[m - 1]} ${String(y).slice(2)}`,
      mNum: m,
    })
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  return out
}

export const CALENDAR: CalMonth[] = buildCalendar()

/** Modulation saisonnière : pic en décembre (collecte / égrenage), creux aux semis (juin-juillet). */
export function seasonal(mNum: number, amp: number): number {
  return 1 + amp * Math.cos(((mNum - 12) / 12) * 2 * Math.PI)
}

function genSeries(target: number, gMonthly: number, amp: number, noisePct: number): number[] {
  const lastFactor = seasonal(CALENDAR[11].mNum, amp)
  return CALENDAR.map((c, i) => {
    const drift = Math.pow(1 + gMonthly, -(11 - i))
    const sf = seasonal(c.mNum, amp) / lastFactor
    const noise = 1 + rng.gauss(noisePct / 100)
    return target * drift * sf * noise
  })
}

function genTaux(target: number, borne: number, noiseAbs: number): number[] {
  const start = target - 0.9
  return CALENDAR.map((_, i) => {
    const v = start + (target - start) * (i / 11) + rng.gauss(noiseAbs)
    return clamp(round1(v), start - 0.6, borne)
  })
}

/* ------------------------------------------------------------------ *
 *  Série nationale mensuelle.
 * ------------------------------------------------------------------ */
const sCotonGraine = genSeries(58000, 0.009, 0.42, 2.4)
const sFibre = genSeries(24600, 0.009, 0.4, 2.2)
const sGraine = genSeries(32500, 0.008, 0.38, 2.4)
const sSuperficie = genSeries(820000, 0.0004, 0.02, 1.6)
const sRendement = genSeries(845, 0.003, 0.05, 1.8)
const sProducteurs = genSeries(215000, 0.0003, 0.01, 1.5)
const sRecettes = genSeries(28.4e9, 0.007, 0.1, 2.6)
const sCouts = genSeries(22.6e9, 0.008, 0.06, 2.2)
const sPaiements = genSeries(19.8e9, 0.0, 0.3, 3.0)
const sTauxEgrenage = genTaux(42.6, 43.5, 0.25)
const sTauxRemb = genTaux(96.1, 98.5, 0.35)
const sCoursFibre = genSeries(1880, -0.004, 0.05, 2.0)

export const MONTHLY: MonthPoint[] = CALENDAR.map((c, i) => ({
  month: c.month,
  label: c.label,
  cotonGraine: Math.round(sCotonGraine[i]),
  fibre: Math.round(sFibre[i]),
  graine: Math.round(sGraine[i]),
  superficie: Math.round(sSuperficie[i]),
  rendement: Math.round(sRendement[i]),
  producteurs: Math.round(sProducteurs[i]),
  recettes: Math.round(sRecettes[i]),
  couts: Math.round(sCouts[i]),
  paiementsProducteurs: Math.round(sPaiements[i]),
  tauxEgrenage: round1(sTauxEgrenage[i]),
  tauxRemboursement: round1(sTauxRemb[i]),
  coursFibre: Math.round(sCoursFibre[i]),
}))

const LAST = MONTHLY[MONTHLY.length - 1]

/** Cumuls de campagne (somme des 12 mois clos). */
export const CAMPAGNE = {
  cotonGraine: MONTHLY.reduce((s, m) => s + m.cotonGraine, 0),
  fibre: MONTHLY.reduce((s, m) => s + m.fibre, 0),
  graine: MONTHLY.reduce((s, m) => s + m.graine, 0),
  recettes: MONTHLY.reduce((s, m) => s + m.recettes, 0),
  couts: MONTHLY.reduce((s, m) => s + m.couts, 0),
  paiementsProducteurs: MONTHLY.reduce((s, m) => s + m.paiementsProducteurs, 0),
}

export const NATIONAL_KPIS = {
  cotonGraine: { value: LAST.cotonGraine, delta: 7.2 },
  fibre: { value: LAST.fibre, delta: 7.0 },
  rendement: { value: LAST.rendement, delta: 3.1 },
  recettes: { value: LAST.recettes, delta: 6.8 },
  couts: { value: LAST.couts, delta: 5.4 },
  superficie: { value: LAST.superficie, delta: 2.4 },
  tauxEgrenage: { value: LAST.tauxEgrenage, delta: 0.6 },
  tauxRemboursement: { value: LAST.tauxRemboursement, delta: 1.1 },
  coursFibre: { value: LAST.coursFibre, delta: -4.5 },
  producteurs: { value: 215000, delta: 3200 },
  usines: 17,
  prixAchat: 300,
  marge: profitability(LAST.recettes, LAST.couts),
} as const

/* ------------------------------------------------------------------ *
 *  Statistiques par filiale (zone).
 * ------------------------------------------------------------------ */
function zoneMonthly(weight: number): number[] {
  return MONTHLY.map((m) => Math.round(m.cotonGraine * weight))
}

export const ZONE_STATS: ZoneStat[] = ZONES.map((z) => {
  const g = rng.gauss(1)
  const cotonGraine = Math.round(CAMPAGNE.cotonGraine * z.weight * (1 + g * 0.02))
  const fibre = Math.round(cotonGraine * 0.426 * (1 + rng.gauss(0.01)))
  const superficie = Math.round(820000 * z.weight * (1 + rng.gauss(0.03)))
  const producteurs = Math.round(215000 * z.weight * (1 + rng.gauss(0.03)))
  const rendement = Math.round(clamp(845 + z.bias * 42 + rng.gauss(28), 520, 1050))
  const recettes = Math.round(CAMPAGNE.recettes * z.weight * (1 + z.bias * 0.02 + rng.gauss(0.02)))
  const couts = Math.round(CAMPAGNE.couts * z.weight * (1 - z.bias * 0.02 + rng.gauss(0.02)))
  const coutRevient = Math.round(clamp((couts / (cotonGraine * 1000)) * (1 - z.bias * 0.02), 360, 560))
  const growth = round1(clamp(7.2 + z.bias * 3.1 + rng.gauss(2.4), -14, 18))
  const marge = profitability(recettes, couts)
  const spark = zoneMonthly(z.weight).slice(-7)
  const score = performanceScore({
    rendement,
    marge,
    volume: clamp((cotonGraine / 190000) * 100),
    repayment: clamp(96 + z.bias * 1.6 + rng.gauss(1), 82, 99),
    quality: clamp(64 + z.bias * 6 + rng.gauss(6), 40, 92),
  })
  return {
    zoneId: z.id,
    zone: z.name,
    cotonGraine,
    fibre,
    superficie,
    rendement,
    producteurs,
    recettes,
    couts,
    coutRevient,
    growth,
    score,
    band: bandOf(score),
    trend: trendOf(growth),
    spark,
  }
})

/* ------------------------------------------------------------------ *
 *  Secteurs (≈ 29) + historique mensuel.
 * ------------------------------------------------------------------ */
interface Forced {
  growth: number
  coutMul: number
  rendement: number
  remboursement: number
}
const FORCED: Record<string, Forced> = {
  'nord-1': { growth: 14.1, coutMul: 0.92, rendement: 985, remboursement: 98.4 },
  'sud-1': { growth: 11.8, coutMul: 0.94, rendement: 940, remboursement: 97.6 },
  'cen-2': { growth: -12.4, coutMul: 1.18, rendement: 690, remboursement: 88.7 },
  'ouest-2': { growth: -9.7, coutMul: 1.14, rendement: 640, remboursement: 84.2 },
  'nord-6': { growth: -6.1, coutMul: 1.12, rendement: 720, remboursement: 90.3 },
  'ohvn-3': { growth: -4.8, coutMul: 1.1, rendement: 705, remboursement: 91.0 },
}

function zipfShares(n: number): number[] {
  const raw = Array.from({ length: n }, (_, k) => 1 / (k + 1))
  const total = raw.reduce((s, v) => s + v, 0)
  return raw.map((v) => v / total)
}

function sectorHistory(campaignCoton: number, campaignRecettes: number, campaignCouts: number, rend: number, remb: number): SecteurMonth[] {
  return CALENDAR.map((c, i) => {
    const sf = seasonal(c.mNum, 0.42) / seasonal(CALENDAR[11].mNum, 0.42)
    const drift = Math.pow(1.009, -(11 - i))
    const n = 1 + rng.gauss(0.03)
    const coton = Math.round((campaignCoton / 12) * sf * drift * n)
    return {
      label: c.label,
      cotonGraine: coton,
      fibre: Math.round(coton * 0.426),
      recettes: Math.round((campaignRecettes / 12) * sf * drift * (1 + rng.gauss(0.03))),
      couts: Math.round((campaignCouts / 12) * (0.6 + 0.4 * sf) * drift * (1 + rng.gauss(0.03))),
      rendement: Math.round(rend * (1 + rng.gauss(0.04)) * (0.9 + 0.1 * sf)),
      tauxRemboursement: round1(clamp(remb + rng.gauss(1.4), 70, 99.5)),
    }
  })
}

export const SECTEURS: Secteur[] = ZONES.flatMap((z) => {
  const names = SECTEUR_NAMES[z.id]
  const n = names.length
  const shares = zipfShares(n)
  const zs = ZONE_STATS.find((s) => s.zoneId === z.id)!
  return names.map((nm, k) => {
    const id = `${z.id}-${k + 1}`
    const forced = FORCED[id]
    const share = shares[k]
    const type: Secteur['type'] =
      k === 0 ? 'Secteur principal' : k === n - 1 ? 'ZPA rattachée' : k === n - 2 ? 'Sous-secteur' : 'Secteur'
    const usine = USINES[z.id][k % USINES[z.id].length]

    const producteurs = Math.round(zs.producteurs * share * (1 + rng.gauss(0.04)))
    const scoops = Math.max(6, Math.round(producteurs / 46))
    const superficie = Math.round(zs.superficie * share * (1 + rng.gauss(0.04)))
    const rendement = forced ? forced.rendement : Math.round(clamp(zs.rendement * (1 + rng.gauss(0.06)), 520, 1060))
    const cotonGraine = Math.round((superficie * rendement) / 1000)
    const fibre = Math.round(cotonGraine * clamp(0.426 + rng.gauss(0.006), 0.4, 0.44))
    const coutRevientBase = zs.coutRevient * (forced ? forced.coutMul : 1 + rng.gauss(0.05))
    const coutRevient = Math.round(clamp(coutRevientBase, 330, 640))
    const couts = Math.round(cotonGraine * 1000 * coutRevient)
    const recettes = Math.round(zs.recettes * share * (rendement / zs.rendement) * (1 + rng.gauss(0.03)))
    const growth = round1(forced ? forced.growth : clamp(zs.growth + rng.gauss(3.2), -15, 19))
    const tauxRemboursement = round1(forced ? forced.remboursement : clamp(96.1 + rng.gauss(2.4), 78, 99))
    const classement1erChoix = Math.round(clamp(70 + (rendement - 820) / 12 + rng.gauss(6), 48, 92))
    const delaiEnlevement = round1(clamp(3.4 + (forced ? 1.6 : 0) + rng.gauss(0.9), 2, 7.5))
    const satisfaction = Math.round(clamp(74 + growth * 0.6 + rng.gauss(6), 48, 94))

    const history = sectorHistory(cotonGraine, recettes, couts, rendement, tauxRemboursement)
    const marge = profitability(recettes, couts)
    const vol = volatilityPct(history.map((h) => h.cotonGraine))
    const score = performanceScore({
      rendement,
      marge,
      volume: clamp((cotonGraine / 46000) * 100),
      repayment: tauxRemboursement,
      quality: clamp((classement1erChoix + satisfaction) / 2),
    })
    const rScore = riskScore({
      yieldDropPct: growth,
      costPressure: clamp((coutRevient - 420) / 12, -3, 13),
      repayment: tauxRemboursement,
      volatility: vol,
    })
    return {
      id,
      name: `Secteur ${nm}`,
      zoneId: z.id,
      zone: z.name,
      type,
      usine,
      producteurs,
      scoops,
      superficie,
      cotonGraine,
      fibre,
      rendement,
      recettes,
      couts,
      coutRevient,
      growth,
      tauxRemboursement,
      classement1erChoix,
      delaiEnlevement,
      satisfaction,
      score,
      band: bandOf(score),
      risk: riskLevelOf(rScore),
      riskScore: rScore,
      trend: trendOf(growth),
      spark: history.slice(-7).map((h) => h.cotonGraine),
      history,
    }
  })
})

/* ------------------------------------------------------------------ *
 *  Finance.
 * ------------------------------------------------------------------ */
export interface FinanceMonth {
  label: string
  month: string
  recettes: number
  couts: number
  marge: number
  intrants: number
  subvention: number
  budget: number
  variance: number
}

export const FINANCE_MONTHLY: FinanceMonth[] = MONTHLY.map((m) => {
  const intrants = Math.round(m.couts * 0.42)
  const subvention = Math.round(intrants * 0.3)
  const budget = Math.round(m.couts * 1.02)
  return {
    label: m.label,
    month: m.month,
    recettes: m.recettes,
    couts: m.couts,
    marge: profitability(m.recettes, m.couts),
    intrants,
    subvention,
    budget,
    variance: round1(((m.couts - budget) / budget) * 100),
  }
})

const FLAST = FINANCE_MONTHLY[FINANCE_MONTHLY.length - 1]

export const FINANCE_KPIS = {
  recettes: { value: FLAST.recettes, delta: 6.8 },
  couts: { value: FLAST.couts, delta: 5.4 },
  marge: { value: FLAST.marge, delta: 1.3 },
  intrants: { value: FLAST.intrants, delta: 4.1 },
  subvention: { value: FLAST.subvention, delta: 2.7 },
  prixAchat: 300,
  ristourneEstimee: 32,
  budget: { value: FLAST.budget, delta: 4.9 },
  variance: { value: FLAST.variance, delta: -0.4 },
} as const

/* ------------------------------------------------------------------ *
 *  Collecte & Égrenage.
 * ------------------------------------------------------------------ */
export interface EgrenageMonth {
  label: string
  collecte: number
  egrene: number
  stock: number
  tauxEgrenage: number
  capacite: number
}

export const EGRENAGE_MONTHLY: EgrenageMonth[] = MONTHLY.map((m, i) => {
  const collecte = m.cotonGraine
  const egrene = Math.round(collecte * clamp(0.88 + i * 0.006 + rng.gauss(0.02), 0.7, 1.02))
  const stock = Math.max(0, Math.round((collecte - egrene) * clamp(0.42 + rng.gauss(0.05), 0.2, 0.7)))
  return {
    label: m.label,
    collecte,
    egrene,
    stock,
    tauxEgrenage: m.tauxEgrenage,
    capacite: round1(clamp(58 + seasonal(CALENDAR[i].mNum, 0.4) * 24 + rng.gauss(3), 40, 98)),
  }
})

const ELAST = EGRENAGE_MONTHLY[EGRENAGE_MONTHLY.length - 1]

export const EGRENAGE_KPIS = {
  cotonGraineCollecte: { value: ELAST.collecte, delta: 7.2 },
  fibreProduite: { value: LAST.fibre, delta: 7.0 },
  stockFibre: { value: ELAST.stock + 4200, delta: 11.4 },
  tauxEgrenage: { value: ELAST.tauxEgrenage, delta: 0.6 },
  capaciteUtilisee: { value: ELAST.capacite, delta: 3.8 },
  delaiEnlevementMoyen: { value: round1(3.9), delta: 6.1 },
} as const

export interface Corridor {
  route: string
  volume: number
  delaiJours: number
  tauxAcheminement: number
}

const CORRIDOR_ROUTES: [string, string][] = [
  ['Koutiala', 'Usine Koutiala II'],
  ['Sikasso', 'Usine Sikasso'],
  ['Kadiolo', 'Usine Kadiolo'],
  ["M'Pessoba", "Usine M'Pessoba"],
  ['Dioïla', 'Usine Fana'],
  ['Kita', 'Usine Kita'],
  ['Yorosso', 'Usine Molobala'],
  ['Bougouni', 'Usine Bougouni'],
  ['Usine Koutiala', 'Bamako'],
  ['Usine Sikasso', 'Bamako'],
  ['Bamako', 'Port de Dakar'],
  ['Bamako', "Port d'Abidjan"],
  ['Bamako', 'Port de Lomé'],
]

export const CORRIDORS: Corridor[] = CORRIDOR_ROUTES.map(([a, b], i) => ({
  route: `${a} → ${b}`,
  volume: Math.round(clamp(38000 - i * 2600 + rng.gauss(3000), 4000, 46000)),
  delaiJours: round1(clamp(2.6 + i * 0.25 + rng.gauss(0.8), 1.5, 7.5)),
  tauxAcheminement: round1(clamp(97 - i * 0.9 + rng.gauss(2.2), 78, 99.5)),
}))
  .sort((x, y) => y.volume - x.volume)

export interface EgrenageZone {
  zone: string
  cotonGraine: number
  stockPct: number
  delai: number
}

export const EGRENAGE_BY_ZONE: EgrenageZone[] = ZONE_STATS.map((z) => ({
  zone: z.zone,
  cotonGraine: z.cotonGraine,
  stockPct: round1(clamp(6 + (z.coutRevient - 430) / 12 + rng.gauss(2), 1, 18)),
  delai: round1(clamp(3.4 + (440 - z.rendement / 2) / 120 + rng.gauss(0.7), 2, 7)),
}))

/* ------------------------------------------------------------------ *
 *  Facteur d'échelle par période d'agrégation.
 * ------------------------------------------------------------------ */
export function periodFactor(period: string): number {
  switch (period) {
    case 'Décade':
      return 10 / 30
    case 'Mensuel':
      return 1
    case 'Trimestre':
      return 3
    case 'Campagne':
      return 8
    case 'Cumul':
      return 11.6
    default:
      return 1
  }
}

export { growthRate }
