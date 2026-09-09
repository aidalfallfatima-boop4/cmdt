import {
  LayoutDashboard,
  Sprout,
  Building2,
  Factory,
  Landmark,
  LineChart,
  ShieldAlert,
  BrainCircuit,
  SlidersHorizontal,
  FileText,
  Map,
  Route,
  Info,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  no?: string
  label: string
  to: string
  icon: LucideIcon
}

export const PRIMARY_NAV: NavItem[] = [
  { no: '01', label: 'Vue générale', to: '/', icon: LayoutDashboard },
  { no: '02', label: 'Production agricole', to: '/production', icon: Sprout },
  { no: '03', label: 'Secteurs & Coopératives', to: '/secteurs', icon: Building2 },
  { no: '04', label: 'Collecte & Égrenage', to: '/egrenage', icon: Factory },
  { no: '05', label: 'Finance & Filière', to: '/finance', icon: Landmark },
  { no: '06', label: 'Prévisions', to: '/previsions', icon: LineChart },
  { no: '07', label: 'Risques & Alertes', to: '/risques', icon: ShieldAlert },
  { no: '08', label: 'Intelligence IA', to: '/copilot', icon: BrainCircuit },
  { no: '09', label: 'Scénarios', to: '/scenarios', icon: SlidersHorizontal },
  { no: '10', label: 'Rapports', to: '/rapports', icon: FileText },
]

export const SECONDARY_NAV: NavItem[] = [
  { label: 'Bassin cotonnier', to: '/bassin', icon: Map },
  { label: 'Vision de déploiement', to: '/roadmap', icon: Route },
  { label: 'À propos du prototype', to: '/a-propos', icon: Info },
]

/** Fil d'Ariane / titres d'entête par route. */
export const TITLES: Record<string, string> = {
  '/': 'Tableau de bord exécutif',
  '/production': 'Production agricole',
  '/secteurs': 'Secteurs & Coopératives',
  '/egrenage': 'Collecte & Égrenage',
  '/finance': 'Finance & Filière',
  '/previsions': 'Prévisions',
  '/risques': 'Risques & Alertes',
  '/copilot': 'Intelligence IA',
  '/scenarios': 'Scénarios de décision',
  '/rapports': 'Rapports',
  '/bassin': 'Bassin cotonnier',
  '/roadmap': 'Vision de déploiement',
  '/a-propos': 'À propos du prototype',
}
