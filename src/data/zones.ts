import type { Zone } from '../types'

export interface ZoneRef extends Zone {
  weight: number
  bias: number
}

/** 5 zones : 4 filiales régionales CMDT + l'OHVN. Repère x/y sur carte stylisée du bassin. */
export const ZONES: ZoneRef[] = [
  { id: 'sud', name: 'CMDT Sud', hub: 'Sikasso', x: 55, y: 78, secteurCount: 6, weight: 0.27, bias: 1.0 },
  { id: 'nord', name: 'CMDT Nord-Est', hub: 'Koutiala', x: 52, y: 60, secteurCount: 8, weight: 0.34, bias: 1.1 },
  { id: 'cen', name: 'CMDT Centre', hub: 'Fana', x: 40, y: 55, secteurCount: 6, weight: 0.17, bias: 0.3 },
  { id: 'ouest', name: 'CMDT Ouest', hub: 'Kita', x: 20, y: 48, secteurCount: 5, weight: 0.14, bias: -0.2 },
  { id: 'ohvn', name: 'OHVN', hub: 'Bancoumana', x: 32, y: 62, secteurCount: 4, weight: 0.08, bias: -0.4 },
]

/** Noms de secteurs plausibles par zone (dans l'ordre, part décroissante). */
export const SECTEUR_NAMES: Record<string, string[]> = {
  nord: ['Koutiala', "M'Pessoba", 'Molobala', 'Kouri', 'Yorosso', 'Mahou', 'Karangana', 'Zébala'],
  sud: ['Sikasso', 'Kadiolo', 'Kignan', 'Niéna', 'Loulouni', 'Danderesso'],
  cen: ['Fana', 'Dioïla', 'Massigui', 'Béléko', 'Konobougou', 'Kolokani'],
  ouest: ['Kita', 'Kéniéba', 'Sagabari', 'Bafoulabé', 'Badinko'],
  ohvn: ['Bancoumana', 'Ouéléssébougou', 'Kangaba', 'Siby'],
}

/** Usines d'égrenage rattachées (≈ 17). */
export const USINES: Record<string, string[]> = {
  nord: ['Usine Koutiala I', 'Usine Koutiala II', 'Usine Koutiala III', "Usine M'Pessoba", 'Usine Molobala'],
  sud: ['Usine Sikasso', 'Usine Kadiolo', 'Usine Kignan', 'Usine Bougouni'],
  cen: ['Usine Fana', 'Usine Dioïla', 'Usine Koumantou'],
  ouest: ['Usine Kita', 'Usine San'],
  ohvn: ['Usine Ouéléssébougou', 'Usine Koutiala IV'],
}
