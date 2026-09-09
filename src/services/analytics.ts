import {
  PERFORMANCE_WEIGHTS,
  RISK_WEIGHTS,
  PERFORMANCE_BANDS,
  RISK_BANDS,
} from '../config/weights'
import type { PerfBand, RiskLevel, Trend } from '../types'

export const clamp = (v: number, min = 0, max = 100): number => Math.max(min, Math.min(max, v))
export const round1 = (v: number): number => Math.round(v * 10) / 10

export function growthRate(cur: number, prev: number): number {
  if (!prev) return 0
  return round1(((cur - prev) / prev) * 100)
}

/** Marge filière en % (recettes vs coûts). */
export function profitability(recettes: number, couts: number): number {
  if (!recettes) return 0
  return round1(((recettes - couts) / recettes) * 100)
}

export interface PerfInput {
  rendement: number
  marge: number
  volume: number
  repayment: number
  quality: number
}

/** Normalisations : rendement 400→0 / 1100→100 ; marge ×2.6 ; remboursement 80→0 / 100→100. */
export function performanceScore(i: PerfInput): number {
  const yieldN = clamp(((i.rendement - 400) / (1100 - 400)) * 100)
  const margeN = clamp(i.marge * 2.6)
  const volN = clamp(i.volume)
  const repayN = clamp(((i.repayment - 80) / (100 - 80)) * 100)
  const qualN = clamp(i.quality)
  const s =
    yieldN * PERFORMANCE_WEIGHTS.yield +
    margeN * PERFORMANCE_WEIGHTS.profitability +
    volN * PERFORMANCE_WEIGHTS.volume +
    repayN * PERFORMANCE_WEIGHTS.repayment +
    qualN * PERFORMANCE_WEIGHTS.quality
  return round1(clamp(s))
}

export function bandOf(score: number): PerfBand {
  for (const b of PERFORMANCE_BANDS) if (score >= b.min) return b.band
  return 'CRITIQUE'
}

export interface RiskInput {
  yieldDropPct: number // Δ production en % (négatif = recul)
  costPressure: number // écart coûts vs recettes (points)
  repayment: number // taux de remboursement en %
  volatility: number // coefficient de variation des volumes en %
}

export function riskScore(i: RiskInput): number {
  const yieldDrop = clamp(-i.yieldDropPct * 6, 0, 100)
  const cost = clamp(i.costPressure * 7, 0, 100)
  const lowRepay = clamp((96 - i.repayment) * 6, 0, 100)
  const vol = clamp(i.volatility * 4, 0, 100)
  const s =
    yieldDrop * RISK_WEIGHTS.yieldDrop +
    cost * RISK_WEIGHTS.costPressure +
    lowRepay * RISK_WEIGHTS.lowRepayment +
    vol * RISK_WEIGHTS.volatility
  return round1(clamp(s))
}

export function riskLevelOf(score: number): RiskLevel {
  for (const b of RISK_BANDS) if (score >= b.min) return b.level
  return 'FAIBLE'
}

export function trendOf(growth: number): Trend {
  if (growth > 1.5) return 'up'
  if (growth < -1.5) return 'down'
  return 'flat'
}

export function rankBy<T>(arr: T[], key: (t: T) => number, desc = true): T[] {
  return [...arr].sort((a, b) => (desc ? key(b) - key(a) : key(a) - key(b)))
}

/** Coefficient de variation en % (écart-type / moyenne). */
export function volatilityPct(series: number[]): number {
  if (series.length < 2) return 0
  const mean = series.reduce((s, v) => s + v, 0) / series.length
  if (!mean) return 0
  const variance = series.reduce((s, v) => s + (v - mean) ** 2, 0) / series.length
  return round1((Math.sqrt(variance) / mean) * 100)
}
