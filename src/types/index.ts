// Types du domaine — CMDT AI (filière cotonnière malienne).

export type PerfBand = 'EXCELLENT' | 'BON' | 'STABLE' | 'A_SURVEILLER' | 'CRITIQUE'
export type RiskLevel = 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE'
export type Trend = 'up' | 'down' | 'flat'
export type AlertSeverity = 'CRITIQUE' | 'ELEVE' | 'MOYEN' | 'FAIBLE'
export type AlertStatus = 'OUVERTE' | 'EN_COURS' | 'RESOLUE'
export type InsightLevel = 'positif' | 'attention' | 'risque' | 'information'

export type Role =
  | 'ADMIN'
  | 'DIRECTION_GENERALE'
  | 'DIRECTION_PRODUCTION_AGRICOLE'
  | 'DIRECTION_INDUSTRIELLE'
  | 'DIRECTION_COMMERCIALE'
  | 'DIRECTION_FINANCIERE'
  | 'DIRECTEUR_FILIALE'
  | 'ANALYSTE'

/** Filiale / zone d'intervention (≈ « région »). */
export interface Zone {
  id: string
  name: string
  hub: string
  x: number
  y: number
  secteurCount: number
}

/** Point mensuel national (série d'exploitation / de campagne). */
export interface MonthPoint {
  month: string
  label: string
  cotonGraine: number
  fibre: number
  graine: number
  superficie: number
  rendement: number
  producteurs: number
  recettes: number
  couts: number
  paiementsProducteurs: number
  tauxEgrenage: number
  tauxRemboursement: number
  coursFibre: number
}

export interface ZoneStat {
  zoneId: string
  zone: string
  cotonGraine: number
  fibre: number
  superficie: number
  rendement: number
  producteurs: number
  recettes: number
  couts: number
  coutRevient: number
  growth: number
  score: number
  band: PerfBand
  trend: Trend
  spark: number[]
}

export interface SecteurMonth {
  label: string
  cotonGraine: number
  fibre: number
  recettes: number
  couts: number
  rendement: number
  tauxRemboursement: number
}

export interface Secteur {
  id: string
  name: string
  zoneId: string
  zone: string
  type: 'Secteur principal' | 'Secteur' | 'Sous-secteur' | 'ZPA rattachée'
  usine: string
  producteurs: number
  scoops: number
  superficie: number
  cotonGraine: number
  fibre: number
  rendement: number
  recettes: number
  couts: number
  coutRevient: number
  growth: number
  tauxRemboursement: number
  classement1erChoix: number
  delaiEnlevement: number
  satisfaction: number
  score: number
  band: PerfBand
  risk: RiskLevel
  riskScore: number
  trend: Trend
  spark: number[]
  history: SecteurMonth[]
}

export interface Insight {
  id: string
  level: InsightLevel
  title: string
  detail: string
  metricHint?: string
}

export interface Alert {
  id: string
  date: string
  severity: AlertSeverity
  subject: string
  scope: string
  impact: string
  status: AlertStatus
  detail: string
}

export interface RiskItem {
  id: string
  label: string
  category: 'Climatique' | 'Phytosanitaire' | 'Marché' | 'Financier' | 'Industriel' | 'Social'
  probability: number
  impact: number
  score: number
  trend: Trend
  action: string
}

export interface Anomaly {
  id: string
  entity: string
  metric: string
  expected: number
  observed: number
  deviationPct: number
  severity: AlertSeverity
  date: string
  note: string
  series: { label: string; attendu: number; observe: number }[]
}

export interface ForecastSeries {
  key: string
  label: string
  unit: string
  history: { label: string; value: number }[]
  forecast: { label: string; value: number; lo: number; hi: number }[]
  h30: number
  h90: number
  finCampagne: number
  mape: number
  model: string
}

export interface ReportCard {
  id: string
  kind: 'Quotidien' | 'Hebdomadaire' | 'Mensuel' | 'Bilan de campagne'
  title: string
  period: string
  generatedAt: string
  highlights: string[]
  pages: number
}

export interface AppNotification {
  id: string
  kind: 'alerte' | 'anomalie' | 'prevision' | 'rapport'
  text: string
  time: string
  unread: boolean
}

export interface ChatBlock {
  type: 'text' | 'kpis' | 'bars' | 'list' | 'note'
  text?: string
  kpis?: { label: string; value: string; delta?: string; tone?: 'pos' | 'neg' | 'flat' }[]
  bars?: { label: string; value: number; hint?: string }[]
  items?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  blocks?: ChatBlock[]
}
