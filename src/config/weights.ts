// Pondérations et seuils du moteur analytique simulé — tout est ajustable ici.

export const PRODUCT = {
  name: 'CMDT AI',
  tagline: "Plateforme d'Intelligence Décisionnelle de la Filière Cotonnière",
  org: 'Compagnie Malienne pour le Développement des Textiles (CMDT)',
  disclaimer: 'Prototype de démonstration — Données synthétiques — Version conceptuelle',
  version: 'v0.9.0-preview',
} as const

/** Score de performance d'un secteur / d'une zone (somme = 1). */
export const PERFORMANCE_WEIGHTS = {
  yield: 0.3,
  profitability: 0.22,
  volume: 0.18,
  repayment: 0.18,
  quality: 0.12,
} as const

/** Score de risque (somme = 1). Plus haut = plus risqué. */
export const RISK_WEIGHTS = {
  yieldDrop: 0.32,
  costPressure: 0.26,
  lowRepayment: 0.24,
  volatility: 0.18,
} as const

export const PERFORMANCE_BANDS = [
  { band: 'EXCELLENT', min: 85 },
  { band: 'BON', min: 70 },
  { band: 'STABLE', min: 55 },
  { band: 'A_SURVEILLER', min: 40 },
  { band: 'CRITIQUE', min: 0 },
] as const

export const RISK_BANDS = [
  { level: 'CRITIQUE', min: 75 },
  { level: 'ELEVE', min: 55 },
  { level: 'MODERE', min: 35 },
  { level: 'FAIBLE', min: 0 },
] as const

export const ANOMALY_SIGMA = 2.0

export const FORECAST = {
  horizonsDays: [30, 90] as const,
  confidence: 0.9,
  bandPct30: 0.05,
  bandPct90: 0.11,
  bandPctCampagne: 0.15,
} as const
