import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowUpDown, Building2, Gauge, ShieldAlert, Trophy } from 'lucide-react'
import { PageHeader, Card, Select, PerfBadge, RiskBadge, TrendPct } from '../components/ui'
import { KpiCard } from '../components/kpi'
import { ZONE_STATS, SECTEURS } from '../data/dataset'
import { num, tonnes, kgha } from '../lib/format'
import type { Secteur } from '../types'

type SortKey = 'name' | 'zone' | 'cotonGraine' | 'rendement' | 'superficie' | 'growth' | 'coutRevient' | 'tauxRemboursement' | 'score'
const RISK_LEVELS = ['Tous niveaux', 'FAIBLE', 'MODERE', 'ELEVE', 'CRITIQUE'] as const

export default function Secteurs() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [zoneId, setZoneId] = useState('all')
  const [risk, setRisk] = useState<(typeof RISK_LEVELS)[number]>('Tous niveaux')
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: 'score', desc: true })

  const scoreAvg = Math.round(SECTEURS.reduce((s, x) => s + x.score, 0) / SECTEURS.length)
  const nRisk = SECTEURS.filter((s) => s.score < 55).length
  const bestYield = [...SECTEURS].sort((a, b) => b.rendement - a.rendement)[0]

  const rows = useMemo(() => {
    let list = SECTEURS.filter((s) => {
      if (zoneId !== 'all' && s.zoneId !== zoneId) return false
      if (risk !== 'Tous niveaux' && s.risk !== risk) return false
      if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.zone.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
    const dir = sort.desc ? -1 : 1
    list = [...list].sort((a, b) => {
      const av = a[sort.key as keyof Secteur]
      const bv = b[sort.key as keyof Secteur]
      if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv) * dir
      return ((av as number) - (bv as number)) * dir
    })
    return list
  }, [q, zoneId, risk, sort])

  const th = (key: SortKey, label: string, extra = '') => (
    <th className={`th ${extra}`}>
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-ink"
        onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : true }))}
      >
        {label}
        <ArrowUpDown size={11} className={sort.key === key ? 'text-leaf' : 'text-ink-faint'} />
      </button>
    </th>
  )

  return (
    <div className="fade-up">
      <PageHeader title="Intelligence du réseau de production" subtitle={`${SECTEURS.length} secteurs suivis · ${ZONE_STATS.length} filiales`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Secteurs suivis" value={num(SECTEURS.length)} icon={<Building2 size={15} />} accent />
        <KpiCard label="Score moyen réseau" value={scoreAvg.toLocaleString('fr-FR')} icon={<Gauge size={15} />} delay={40} />
        <KpiCard label="Secteurs à risque élevé" value={num(nRisk)} icon={<ShieldAlert size={15} />} delay={80} />
        <KpiCard label="Meilleur rendement" value={bestYield.name.replace('Secteur ', '')} icon={<Trophy size={15} />} delay={120} />
      </div>

      <Card className="mt-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-md border border-line bg-surface px-2.5">
            <Search size={15} className="text-ink-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un secteur…"
              className="bg-transparent py-2 pl-2 text-sm outline-none"
            />
          </div>
          <Select label="Filiale" options={[{ value: 'all', label: 'Toutes' }, ...ZONE_STATS.map((z) => ({ value: z.zoneId, label: z.zone }))]} value={zoneId} onChange={setZoneId} />
          <Select
            label="Risque"
            options={RISK_LEVELS.map((r) => ({ value: r, label: r === 'Tous niveaux' ? r : r.charAt(0) + r.slice(1).toLowerCase() }))}
            value={risk}
            onChange={setRisk}
          />
          <span className="ml-auto text-xs text-ink-muted">{rows.length} résultat(s)</span>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr>
                {th('name', 'Secteur')}
                {th('zone', 'Filiale')}
                {th('cotonGraine', 'Coton graine')}
                {th('rendement', 'Rendement')}
                {th('superficie', 'Superficie')}
                {th('growth', 'Croissance')}
                {th('coutRevient', 'Coût de revient')}
                {th('tauxRemboursement', 'Remboursement')}
                {th('score', 'Score')}
                <th className="th">Risque</th>
                <th className="th">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="tr-hover" onClick={() => navigate(`/secteurs/${s.id}`)}>
                  <td className="td">
                    <span className="font-medium">{s.name}</span>
                    <span className="block text-[11px] text-ink-faint">{s.type}</span>
                  </td>
                  <td className="td">{s.zone}</td>
                  <td className="td">{tonnes(s.cotonGraine)}</td>
                  <td className="td">{kgha(s.rendement)}</td>
                  <td className="td">{num(s.superficie)} ha</td>
                  <td className="td"><TrendPct value={s.growth} /></td>
                  <td className="td">{num(s.coutRevient)} FCFA/kg</td>
                  <td className="td">{s.tauxRemboursement.toLocaleString('fr-FR')} %</td>
                  <td className="td font-semibold">{s.score.toLocaleString('fr-FR')}</td>
                  <td className="td"><RiskBadge level={s.risk} /></td>
                  <td className="td"><PerfBadge band={s.band} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
