// Formatage FR — FCFA / tonnes / hectares / kg/ha / USD/tonne.

const nf = new Intl.NumberFormat('fr-FR')
const nf1 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const num = (v: number): string => nf.format(Math.round(v))
export const num1 = (v: number): string => nf1.format(v)

export function fcfa(v: number, opts: { sign?: boolean } = {}): string {
  const s = opts.sign && v > 0 ? '+' : ''
  const a = Math.abs(v)
  if (a >= 1e9) return `${s}${nf1.format(v / 1e9)} Md FCFA`
  if (a >= 1e6) return `${s}${nf1.format(v / 1e6)} M FCFA`
  if (a >= 1e3) return `${s}${nf1.format(v / 1e3)} k FCFA`
  return `${s}${nf.format(Math.round(v))} FCFA`
}

export function tonnes(v: number): string {
  const a = Math.abs(v)
  if (a >= 1e6) return `${nf1.format(v / 1e6)} Mt`
  if (a >= 1e3) return `${nf1.format(v / 1e3)} k t`
  return `${nf.format(Math.round(v))} t`
}

export function compact(v: number): string {
  const a = Math.abs(v)
  if (a >= 1e6) return `${nf1.format(v / 1e6)} M`
  if (a >= 1e3) return `${nf1.format(v / 1e3)} k`
  return nf.format(Math.round(v))
}

export const kgha = (v: number): string => `${nf.format(Math.round(v))} kg/ha`
export const usdT = (v: number): string => `${nf.format(Math.round(v))} USD/t`
export const hectares = (v: number): string => `${nf.format(Math.round(v))} ha`

export function pct(v: number, digits = 1): string {
  const s = v > 0 ? '+' : ''
  return `${s}${new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v)} %`
}

export function pctPlain(v: number, digits = 1): string {
  return `${new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v)} %`
}

export type Tone = 'pos' | 'neg' | 'flat'
export function toneOf(v: number): Tone {
  if (v > 0.05) return 'pos'
  if (v < -0.05) return 'neg'
  return 'flat'
}
