// Générateur pseudo-aléatoire déterministe — même graine ⇒ même jeu de données.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function next(): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Rng {
  next: () => number
  range: (min: number, max: number) => number
  gauss: (sd?: number) => number
  pick: <T>(arr: readonly T[]) => T
}

export function makeRng(seed = 20260115): Rng {
  const next = mulberry32(seed)
  const range = (min: number, max: number): number => min + (max - min) * next()
  // Somme de 3 uniformes centrées ⇒ approximation gaussienne (variance réduite).
  const gauss = (sd = 1): number => {
    const u = next() + next() + next() - 1.5
    return u * 2 * sd
  }
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length) % arr.length]
  return { next, range, gauss, pick }
}
