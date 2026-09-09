import { Link } from 'react-router-dom'
import { Eye, Brain, LineChart, ArrowRight } from 'lucide-react'
import { PRODUCT } from '../config/weights'

const CHAIN = ['Données', 'Analyse', 'IA', 'Prévision', 'Risques', 'Recommandation', 'Décision']

const PILLARS = [
  {
    icon: Eye,
    title: 'Voir & Comprendre',
    body: "Production nationale, par filiale et par secteur — avec les causes derrière chaque écart : pluviométrie, pression parasitaire, coûts, remboursement du crédit intrants.",
  },
  {
    icon: LineChart,
    title: 'Prévoir',
    body: "Production de coton graine, rendement moyen, cours mondial de la fibre et recettes d'exportation, avec intervalles de confiance et horizons de campagne.",
  },
  {
    icon: Brain,
    title: 'Recommander & Décider',
    body: "Cartographie des risques, recommandations hiérarchisées et simulation de scénarios (prix producteur, subvention intrants, encadrement, mécanisation).",
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-leaf">
            <span className="font-serif text-lg font-bold text-navy-950">C</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">CMDT AI</p>
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/50">Intelligence Décisionnelle</p>
          </div>
        </div>
        <Link to="/login" className="btn-leaf">
          Accéder à la plateforme <ArrowRight size={15} />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="py-16 sm:py-24">
          <span className="chip border-white/20 bg-white/5 text-white/70">{PRODUCT.disclaimer}</span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            L'intelligence des données au service de la filière cotonnière
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/70">
            Transformer les données agricoles, industrielles, financières et territoriales de la CMDT en informations
            exploitables, prévisions et recommandations — pour la Direction Générale et les responsables habilités. Ce
            n'est pas un chatbot : c'est un système d'intelligence décisionnelle.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-leaf">
              Ouvrir le tableau de bord <ArrowRight size={15} />
            </Link>
            <Link to="/a-propos" className="btn-ghost border-white/20 bg-white/5 text-white hover:bg-white/10">
              À propos du prototype
            </Link>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-card border border-white/10 bg-white/5 p-6">
              <p.icon size={22} className="text-leaf" />
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/65">{p.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-card border border-white/10 bg-white/5 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">Chaîne de valeur</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {CHAIN.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-md bg-navy-800 px-3 py-1.5 text-sm font-medium">{step}</span>
                {i < CHAIN.length - 1 && <ArrowRight size={14} className="text-white/30" />}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/40">
        {PRODUCT.org} · {PRODUCT.version} · Données synthétiques
      </footer>
    </div>
  )
}
