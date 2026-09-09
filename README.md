# CMDT AI — Plateforme d'Intelligence Décisionnelle de la Filière Cotonnière

Prototype web navigable pour la Direction Générale de la **Compagnie Malienne pour le
Développement des Textiles (CMDT)**. Un système d'intelligence décisionnelle — pas un chatbot —
qui matérialise la chaîne :

> **Données → Analyse → IA → Prévision → Détection des risques → Recommandation → Décision**

**100 % front-end, aucun backend.** Toutes les données sont **synthétiques** et générées de façon
**déterministe** (même RNG ⇒ même jeu de données à chaque chargement). Le moteur analytique
(scores, prévisions, anomalies, copilote) est simulé dans le navigateur par des fonctions pures.
Aucune connexion à un LLM.

## Modules

| Nº | Module | Route | Contenu |
|----|--------|-------|---------|
| 01 | Vue générale | `/` | Tableau de bord exécutif : KPI campagne, évolution, performance par filiale, alertes |
| 02 | Production agricole | `/production` | Superficies, rendement, intrants, rendement vs pluviométrie |
| 03 | Secteurs & Coopératives | `/secteurs` | ~29 secteurs, table triable, filtres, scores & risques |
| 04 | Collecte & Égrenage | `/egrenage` | Volumes, taux d'égrenage, capacité usines, corridors d'évacuation |
| 05 | Finance & Filière | `/finance` | Recettes vs coûts, budget vs réalisé, coût de revient, insights IA |
| 06 | Prévisions | `/previsions` | 4 séries, horizons 30 j / 90 j / fin de campagne, intervalles 90 % |
| 07 | Risques & Alertes | `/risques` | Matrice probabilité × impact, anomalies, alertes |
| 08 | Intelligence IA | `/copilot` | Copilote d'analyse décisionnelle (moteur d'intentions) |
| 09 | Scénarios | `/scenarios` | Simulateur d'impact — 6 leviers de politique cotonnière |
| 10 | Rapports | `/rapports` | Notes de campagne, génération et export simulés |
| — | Bassin cotonnier | `/bassin` | Carte schématique du croissant sud-Mali |
| — | Vision de déploiement | `/roadmap` | 5 phases + architecture cible |
| — | À propos | `/a-propos` | Périmètre, hypothèses, limites, rôles, IA responsable |

Pages publiques : `/accueil` (présentation) et `/login` (mot de passe : **`1234`**).

## Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS v3 · recharts · lucide-react ·
react-router-dom v7 (HashRouter).

## Arborescence `src/`

```
src/
  main.tsx  App.tsx  auth.tsx  index.css
  config/     weights.ts  nav.ts
  types/      index.ts
  data/       rng.ts  zones.ts  dataset.ts  narrative.ts
  services/   analytics.ts  forecasting.ts  risk.ts  anomaly.ts  ai/copilot.ts
  lib/        format.ts
  components/  ui.tsx  kpi.tsx  charts.tsx  cards.tsx  AIChat.tsx  Layout.tsx
  pages/      Landing  Login  Dashboard  Production  Secteurs  SecteurDetail
              Egrenage  Finance  Forecasting  Risks  Copilot  Scenarios
              Reports  BassinMap  Roadmap  About
```

## Développement

```bash
npm install
npm run dev        # http://localhost:5173/cmdt/
npm run build      # tsc -b && vite build
npm run preview
npm run lint       # oxlint
```

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie `dist/` sur GitHub Pages à chaque
push sur `main` (base `/cmdt/`, via `VITE_BASE`).

> **À activer une fois :** `Settings → Pages → Source : GitHub Actions`.

Si CMDT AI reste un sous-dossier d'un mono-répo, déplacer `deploy.yml` vers le `.github/workflows/`
de la racine du dépôt et ajouter un `working-directory: cmdt-ai` aux étapes du job `build`.

## Avertissement

Prototype de démonstration — données synthétiques — version conceptuelle. Les analyses,
prévisions et recommandations sont des **aides à la décision** : aucune décision automatique,
validation par les directions métier requise. Aucune donnée réelle ni nominative de la CMDT.
