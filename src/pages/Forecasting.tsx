import { useState } from 'react'
import { PageHeader, Card, CardHeader, Segmented, DemoTag } from '../components/ui'
import { ForecastChart } from '../components/charts'
import { RecommendationCard } from '../components/cards'
import { FORECASTS } from '../services/forecasting'
import { num, num1, fcfa } from '../lib/format'
import type { ForecastSeries } from '../types'

function fmtValue(v: number, unit: string): string {
  if (unit === 'FCFA') return fcfa(v)
  if (unit === 't') return `${num(v)} t`
  if (unit === 'kg/ha') return `${num(v)} kg/ha`
  if (unit === 'USD/t') return `${num(v)} USD/t`
  return num1(v)
}

function deltaVsLast(f: ForecastSeries, value: number): number {
  const last = f.history[f.history.length - 1].value
  return ((value - last) / last) * 100
}

export default function Forecasting() {
  const [key, setKey] = useState(FORECASTS[0].label)
  const f = FORECASTS.find((x) => x.label === key) ?? FORECASTS[0]

  return (
    <div className="fade-up">
      <PageHeader
        title="Prévisions"
        subtitle="Projections à 30 j, 90 j et fin de campagne — avec intervalles de confiance"
        right={<DemoTag />}
      />

      <Segmented options={FORECASTS.map((x) => x.label) as [string, ...string[]]} value={key} onChange={setKey} />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={f.label} sub={`Modèle : ${f.model} · unité : ${f.unit}`} />
          <div className="p-4">
            <ForecastChart history={f.history} forecast={f.forecast} unit={f.unit} />
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <p className="stat-label">Prévision à 30 j</p>
            <p className="kpi-value mt-1">{fmtValue(f.h30, f.unit)}</p>
            <p className="text-xs text-ink-muted">
              {num1(deltaVsLast(f, f.h30))} % vs dernier mois · intervalle 90 % : {fmtValue(f.forecast[0].lo, f.unit)} – {fmtValue(f.forecast[0].hi, f.unit)}
            </p>
          </Card>
          <Card className="p-4 ring-1 ring-leaf/40">
            <p className="stat-label">Prévision à 90 j</p>
            <p className="kpi-value mt-1">{fmtValue(f.h90, f.unit)}</p>
            <p className="text-xs text-ink-muted">
              {num1(deltaVsLast(f, f.h90))} % vs dernier mois · intervalle 90 % : {fmtValue(f.forecast[2].lo, f.unit)} – {fmtValue(f.forecast[2].hi, f.unit)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="stat-label">Prévision fin de campagne</p>
            <p className="kpi-value mt-1">{fmtValue(f.finCampagne, f.unit)}</p>
            <p className="text-xs text-ink-muted">
              {num1(deltaVsLast(f, f.finCampagne))} % vs dernier mois · intervalle 90 % : {fmtValue(f.forecast[f.forecast.length - 1].lo, f.unit)} – {fmtValue(f.forecast[f.forecast.length - 1].hi, f.unit)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="stat-label">Fiabilité du modèle</p>
            <p className="kpi-value mt-1">{num1(100 - f.mape)} %</p>
            <p className="text-xs text-ink-muted">MAPE {num1(f.mape)} % sur le back-test</p>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title="Synthèse des séries" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr>
                <th className="th">Métrique</th>
                <th className="th">Modèle</th>
                <th className="th">Dernier mois</th>
                <th className="th">Prév. 30 j</th>
                <th className="th">Prév. 90 j</th>
                <th className="th">Fin de campagne</th>
                <th className="th">MAPE</th>
              </tr>
            </thead>
            <tbody>
              {FORECASTS.map((x) => (
                <tr key={x.key}>
                  <td className="td font-medium">{x.label}</td>
                  <td className="td text-xs">{x.model}</td>
                  <td className="td">{fmtValue(x.history[x.history.length - 1].value, x.unit)}</td>
                  <td className="td">{fmtValue(x.h30, x.unit)}</td>
                  <td className="td">{fmtValue(x.h90, x.unit)}</td>
                  <td className="td">{fmtValue(x.finCampagne, x.unit)}</td>
                  <td className="td">{num1(x.mape)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <RecommendationCard
          title="Dimensionner l'égrenage et les corridors sur la production fin de campagne prévue"
          body="Caler le plan de charge des usines et les capacités de transport sur la fourchette haute de la prévision de coton graine, pour absorber le pic de collecte sans engorgement."
          tag="Industrie / Logistique"
          confidence={71}
        />
        <RecommendationCard
          title="Couvrir l'exposition au cours mondial de la fibre"
          body="La projection Cotlook A reste baissière : engager des fixations de prix échelonnées sur les ventes à venir et sécuriser le prix producteur via le mécanisme de lissage."
          tag="Commercial / Finance"
          confidence={64}
        />
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        MODÈLE SIMULÉ — en production, recalcul quotidien sur le Data Warehouse (Prophet / ARIMA / Gradient Boosting), avec
        suivi de dérive du modèle et validation humaine avant diffusion.
      </p>
    </div>
  )
}
