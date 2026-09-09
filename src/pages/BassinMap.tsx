import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, CardHeader, Segmented } from '../components/ui'
import { ZONES } from '../data/zones'
import { SECTEURS, ZONE_STATS } from '../data/dataset'
import { CHART_COLORS } from '../components/charts'
import { num, tonnes } from '../lib/format'
import type { Secteur } from '../types'

const MODES = ['Performance', 'Risque', 'Volume', 'Coût de revient'] as const
type Mode = (typeof MODES)[number]

function colorFor(s: Secteur, mode: Mode): string {
  if (mode === 'Performance') return s.score >= 70 ? CHART_COLORS.POS : s.score >= 55 ? CHART_COLORS.INFO : s.score >= 40 ? CHART_COLORS.SOIL : CHART_COLORS.NEG
  if (mode === 'Risque') return s.riskScore >= 75 ? CHART_COLORS.NEG : s.riskScore >= 55 ? CHART_COLORS.SOIL : s.riskScore >= 35 ? CHART_COLORS.INFO : CHART_COLORS.POS
  if (mode === 'Volume') {
    const max = Math.max(...SECTEURS.map((x) => x.cotonGraine))
    const t = s.cotonGraine / max
    return t > 0.66 ? CHART_COLORS.LEAF : t > 0.33 ? CHART_COLORS.INFO : '#C7D2DF'
  }
  return s.coutRevient > 480 ? CHART_COLORS.NEG : s.coutRevient > 430 ? CHART_COLORS.SOIL : CHART_COLORS.POS
}

export default function BassinMap() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('Performance')
  const [hover, setHover] = useState<Secteur | null>(null)

  const points = useMemo(() => {
    return SECTEURS.map((s) => {
      const z = ZONES.find((zz) => zz.id === s.zoneId)!
      const peers = SECTEURS.filter((x) => x.zoneId === s.zoneId)
      const idx = peers.findIndex((x) => x.id === s.id)
      const angle = (idx / peers.length) * Math.PI * 2
      const radius = 6 + (idx % 2) * 2.5
      return { s, x: z.x + Math.cos(angle) * radius, y: z.y + Math.sin(angle) * radius }
    })
  }, [])

  return (
    <div className="fade-up">
      <PageHeader title="Bassin cotonnier" subtitle="Carte schématique (non géographique) du croissant sud du Mali" right={<Segmented options={MODES} value={mode} onChange={setMode} />} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={`Répartition — ${mode}`} sub="Survoler un point pour le détail · cliquer pour ouvrir la fiche" />
          <div className="relative p-4">
            <svg viewBox="0 0 100 95" className="w-full">
              <path
                d="M12,44 C18,30 30,26 42,30 C52,33 58,44 60,54 C63,66 58,80 46,84 C34,88 22,82 18,70 C15,60 8,54 12,44 Z"
                fill="#EEF3EE"
                stroke="#CADBCD"
                strokeWidth="0.6"
              />
              {ZONES.map((z) => (
                <g key={z.id}>
                  <text x={z.x} y={z.y - 9} textAnchor="middle" fontSize="3.1" fontWeight="700" fill={CHART_COLORS.NAVY}>
                    {z.hub}
                  </text>
                  <circle cx={z.x} cy={z.y} r="1.1" fill={CHART_COLORS.NAVY} />
                </g>
              ))}
              {points.map(({ s, x, y }) => (
                <circle
                  key={s.id}
                  cx={x}
                  cy={y}
                  r={hover?.id === s.id ? 2.4 : 1.7}
                  fill={colorFor(s, mode)}
                  stroke="#fff"
                  strokeWidth="0.4"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => navigate(`/secteurs/${s.id}`)}
                />
              ))}
            </svg>

            {hover && (
              <div className="pointer-events-none absolute right-6 top-6 w-56 rounded-card border border-line bg-surface p-3 shadow-pop">
                <p className="text-sm font-semibold text-ink">{hover.name}</p>
                <p className="text-xs text-ink-muted">{hover.zone}</p>
                <dl className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between"><dt className="text-ink-faint">Score</dt><dd className="font-medium">{hover.score.toLocaleString('fr-FR')}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-faint">Coût de revient</dt><dd className="font-medium">{num(hover.coutRevient)} FCFA/kg</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-faint">Coton graine</dt><dd className="font-medium">{tonnes(hover.cotonGraine)}</dd></div>
                </dl>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-line px-4 py-3 text-[11px] text-ink-muted">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pos" /> Favorable</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info" /> Intermédiaire</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-soil" /> À surveiller</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neg" /> Critique</span>
          </div>
        </Card>

        <Card>
          <CardHeader title="Synthèse par filiale" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Filiale</th>
                  <th className="th">Secteurs</th>
                  <th className="th">Coton graine</th>
                  <th className="th">Score</th>
                </tr>
              </thead>
              <tbody>
                {ZONE_STATS.map((z) => (
                  <tr key={z.zoneId}>
                    <td className="td font-medium">{z.zone}</td>
                    <td className="td">{num(SECTEURS.filter((s) => s.zoneId === z.zoneId).length)}</td>
                    <td className="td">{tonnes(z.cotonGraine)}</td>
                    <td className="td font-semibold">{z.score.toLocaleString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
