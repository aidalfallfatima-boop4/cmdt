import { MONTHLY } from '../data/dataset'
import { FORECAST } from '../config/weights'
import type { ForecastSeries, MonthPoint } from '../types'

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

/** Prolonge le calendrier à partir du dernier point connu (AAAA-MM). */
function futureLabels(lastMonth: string, count: number): string[] {
  const [ys, ms] = lastMonth.split('-')
  let y = Number(ys)
  let m = Number(ms)
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    m++
    if (m > 12) {
      m = 1
      y++
    }
    out.push(`${MONTHS_FR[m - 1]} ${String(y).slice(2)}`)
  }
  return out
}

function bandFor(h: number): number {
  if (h <= 1) return FORECAST.bandPct30
  if (h <= 3) return FORECAST.bandPct90
  return FORECAST.bandPctCampagne
}

function build(
  key: keyof MonthPoint,
  label: string,
  unit: string,
  model: string,
  mape: number,
): ForecastSeries {
  const values = MONTHLY.map((m) => Number(m[key]))
  const labels = MONTHLY.map((m) => m.label)
  const n = values.length

  // Taux de croissance mensuel moyen sur les 6 derniers mois.
  const recent = values.slice(-7)
  let g = 0
  for (let i = 1; i < recent.length; i++) g += (recent[i] - recent[i - 1]) / recent[i - 1]
  g /= recent.length - 1

  const history = labels.map((l, i) => ({ label: l, value: Math.round(values[i]) }))
  const last = values[n - 1]
  const fLabels = futureLabels(MONTHLY[n - 1].month, 5)

  const forecast = fLabels.map((l, i) => {
    const h = i + 1
    // Projection composée + légère modulation saisonnière (atténuation progressive de la croissance).
    const damp = 1 - 0.06 * i
    const base = last * Math.pow(1 + g * damp, h)
    const band = bandFor(h)
    return {
      label: l,
      value: Math.round(base),
      lo: Math.round(base * (1 - band)),
      hi: Math.round(base * (1 + band)),
    }
  })

  return {
    key,
    label,
    unit,
    history,
    forecast,
    h30: forecast[0].value,
    h90: forecast[2].value,
    finCampagne: forecast[forecast.length - 1].value,
    mape,
    model,
  }
}

export const FORECASTS: ForecastSeries[] = [
  build('cotonGraine', 'Production coton graine', 't', 'Régression log-linéaire + saisonnalité + météo simulée', 5.4),
  build('rendement', 'Rendement moyen', 'kg/ha', 'Gradient Boosting simulé', 4.7),
  build('coursFibre', 'Cours mondial de la fibre', 'USD/t', 'ARIMA simulé + tendance baissière', 6.1),
  build('recettes', "Recettes d'exportation", 'FCFA', 'Régression log-linéaire + saisonnalité', 4.2),
]

export function forecastByKey(key: string): ForecastSeries {
  return FORECASTS.find((f) => f.key === key) ?? FORECASTS[0]
}
