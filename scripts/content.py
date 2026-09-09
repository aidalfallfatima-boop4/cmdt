"""Contenu partagé des présentations exécutives CMDT AI (PDF et PPTX).

Aucune dépendance : ce module ne contient que des données.
"""

PRODUCT = {
    "name": "CMDT AI",
    "tagline": "Plateforme d'Intelligence Décisionnelle de la Filière Cotonnière",
    "org": "Compagnie Malienne pour le Développement des Textiles (CMDT)",
    "disclaimer": "Prototype de démonstration — Données synthétiques — Version conceptuelle",
    "version": "v0.9.0-preview",
    "url": "https://aidalfallfatima-boop4.github.io/cmdt/",
}

# Charte
NAVY = (0x0B, 0x1F, 0x3A)
NAVY_800 = (0x0E, 0x23, 0x40)
LEAF = (0x1F, 0x7A, 0x4D)
LEAF_SOFT = (0xB7, 0xE0, 0xC6)
SOIL = (0xB5, 0x65, 0x1D)
INK = (0x1B, 0x24, 0x30)
INK_MUTED = (0x5B, 0x66, 0x75)
CANVAS = (0xF5, 0xF6, 0xF8)
WHITE = (0xFF, 0xFF, 0xFF)

CHAIN = ["Données", "Analyse", "IA", "Prévision", "Risques", "Recommandation", "Décision"]

# --- Diapositives -----------------------------------------------------------
# type "cover"    : title, subtitle, note
# type "content"  : kicker, title, bullets[], footer
# type "chain"    : titre + chaîne de valeur
# type "module"   : no, name, what, why, sowhat, nowwhat

SLIDES = [
    {
        "type": "cover",
        "title": "CMDT AI",
        "subtitle": "L'intelligence des données au service de la filière cotonnière",
        "note": "Présentation exécutive — Direction Générale de la CMDT",
    },
    {
        "type": "content",
        "kicker": "Pourquoi maintenant",
        "title": "Le pilotage de la filière se joue sur des signaux faibles",
        "bullets": [
            "Les données de la filière (production agricole, égrenage, finance, commercialisation, "
            "territoire) sont dispersées entre systèmes, filiales et fichiers.",
            "Le pilotage arrive souvent après coup : les écarts de rendement, de coût de revient ou "
            "de remboursement sont constatés en fin de campagne.",
            "Les signaux faibles — déficit pluviométrique localisé, pression parasitaire, dérive "
            "d'un coût d'égrenage — sont détectés trop tard pour être corrigés.",
            "La volatilité du cours mondial et du change expose directement les recettes "
            "d'exportation, sans outil de lecture consolidée du risque.",
        ],
        "footer": "Constat partagé avec les directions métier — à valider en phase pilote.",
    },
    {
        "type": "chain",
        "kicker": "Le produit",
        "title": "Un système d'intelligence décisionnelle — pas un chatbot",
        "body": [
            "CMDT AI transforme les données de la filière en informations exploitables, prévisions "
            "et recommandations, pour la Direction Générale et les responsables habilités.",
            "10 modules navigables, un moteur analytique et un copilote d'analyse. "
            "Aide à la décision : aucune décision critique automatisée.",
        ],
    },
    {
        "type": "module",
        "no": "01",
        "name": "Vue générale — Tableau de bord exécutif",
        "what": "Production coton graine, rendement, fibre, recettes, taux d'égrenage et de "
        "remboursement — en un écran, avec sparklines et deltas de campagne.",
        "why": "La DG n'a pas de vue consolidée temps réel : chaque direction a ses propres "
        "tableaux, sans dénominateur commun.",
        "sowhat": "Un référentiel unique de campagne, filtrable par filiale et par période, "
        "avec le classement de performance des 5 filiales.",
        "nowwhat": "Ouvrir la revue de campagne sur ce tableau ; traiter les alertes prioritaires "
        "affichées en pied de page.",
    },
    {
        "type": "module",
        "no": "02",
        "name": "Production agricole",
        "what": "Superficies, rendement, producteurs actifs, SCOOPS, intrants distribués ; "
        "rendement vs pluviométrie ; répartition territoriale.",
        "why": "Le rendement recule dans certaines zones sans lecture claire des causes "
        "(pluie, ravageurs, fertilité, retard intrants).",
        "sowhat": "Isoler les zones et secteurs déficitaires et relier la baisse de rendement "
        "à ses facteurs.",
        "nowwhat": "Cibler le conseil agricole et la mise en place des intrants sur les "
        "secteurs identifiés.",
    },
    {
        "type": "module",
        "no": "03",
        "name": "Secteurs & Coopératives",
        "what": "≈ 29 secteurs, table triable : coton graine, rendement, coût de revient, "
        "remboursement, score de performance, niveau de risque.",
        "why": "Les secteurs en difficulté sont connus tard et traités au cas par cas.",
        "sowhat": "Un score homogène par secteur et une fiche détaillée (diagnostic IA + "
        "recommandations conditionnelles).",
        "nowwhat": "Constituer le portefeuille des secteurs sous seuil pour le plan de "
        "redressement piloté par la DPA.",
    },
    {
        "type": "module",
        "no": "04",
        "name": "Collecte & Égrenage",
        "what": "Coton graine collecté / égrené, stock de fibre, taux d'égrenage, capacité "
        "usines, délai d'enlèvement ; top corridors d'évacuation.",
        "why": "Engorgements et pannes aux pics de collecte, stock de fibre non évacué, "
        "délais anormaux sur certains corridors.",
        "sowhat": "Suivi des flux usine par usine et corridor par corridor, avec alerte sur "
        "les taux d'acheminement < 92 %.",
        "nowwhat": "Lisser l'affectation du coton graine et prioriser les corridors critiques.",
    },
    {
        "type": "module",
        "no": "05",
        "name": "Finance & Filière",
        "what": "Recettes vs coûts, marge filière, intrants, subvention, budget vs réalisé, "
        "coût de revient par secteur ; analyses financières IA.",
        "why": "Les coûts intrants et transport progressent parfois plus vite que les "
        "recettes, réduisant la ristourne redistribuable.",
        "sowhat": "Lecture de la marge filière et de l'écart budgétaire, exposition au prix "
        "mondial et au change rendue explicite.",
        "nowwhat": "Arbitrer le prix d'achat producteur et la ristourne ; décider d'une "
        "politique de couverture des ventes.",
    },
    {
        "type": "module",
        "no": "06",
        "name": "Prévisions",
        "what": "Production coton graine, rendement, cours mondial de la fibre, recettes "
        "d'exportation — horizons 30 j / 90 j / fin de campagne, intervalles 90 %.",
        "why": "Le dimensionnement industriel et logistique se fait sans projection chiffrée "
        "et bornée.",
        "sowhat": "Des fourchettes de production et de recettes pour caler capacités et "
        "trésorerie.",
        "nowwhat": "Dimensionner l'égrenage sur la fourchette haute ; anticiper l'érosion "
        "des recettes liée au Cotlook A.",
    },
    {
        "type": "module",
        "no": "07",
        "name": "Risques & Alertes",
        "what": "Matrice probabilité × impact (≈ 10 risques structurels), anomalies détectées, "
        "alertes opérationnelles avec impact et statut.",
        "why": "Le risque de campagne n'est pas cartographié de façon homogène ni suivi dans "
        "le temps.",
        "sowhat": "Un registre des risques hiérarchisé, chaque risque assorti d'une action "
        "recommandée ; détection automatique des écarts.",
        "nowwhat": "Traiter les risques de score ≥ 70 en priorité ; instruire les anomalies "
        "critiques (coût usine, délai corridor, écart bascule).",
    },
    {
        "type": "module",
        "no": "08",
        "name": "Intelligence IA — Copilote",
        "what": "Assistant d'analyse décisionnelle : interrogation des données en langage "
        "naturel, réponses structurées WHAT · WHY · SO WHAT · NOW WHAT.",
        "why": "Produire une note de lecture décisionnelle demande de croiser plusieurs "
        "sources et prend du temps.",
        "sowhat": "Des réponses immédiates et sourcées sur la situation de campagne, les "
        "secteurs à risque, les décisions prioritaires.",
        "nowwhat": "Prototype = moteur d'intentions. Phase 2 : LLM + RAG sur le Data "
        "Warehouse, citations et niveau de confiance.",
    },
    {
        "type": "module",
        "no": "09",
        "name": "Scénarios de décision",
        "what": "Simulateur d'impact : 6 leviers (prix d'achat, subvention intrants, "
        "superficie, encadrement, mécanisation, protection phytosanitaire).",
        "why": "Les arbitrages de politique cotonnière se prennent sans vision chiffrée des "
        "effets croisés.",
        "sowhat": "Effet estimé sur la production, le rendement, le coût filière, les "
        "recettes, le revenu producteur et la marge — élasticités amorties.",
        "nowwhat": "Confronter les scénarios à l'expertise des directions métier avant "
        "décision ; simulation indicative.",
    },
    {
        "type": "module",
        "no": "10",
        "name": "Rapports",
        "what": "Notes quotidiennes de campagne, revues hebdomadaires collecte / égrenage, "
        "rapports exécutifs mensuels, bilan stratégique de campagne.",
        "why": "La production de rapports est manuelle, hétérogène et peu traçable.",
        "sowhat": "Des rapports normalisés, datés et structurés autour des mêmes indicateurs "
        "que les modules.",
        "nowwhat": "Phase 2 : génération depuis le Data Warehouse, versionnage, signature, "
        "distribution selon le rôle.",
    },
    {
        "type": "content",
        "kicker": "Prévisions & scénarios",
        "title": "De la projection à l'arbitrage",
        "bullets": [
            "4 séries prévues avec intervalles de confiance qui s'élargissent avec l'horizon "
            "(±5 % à 30 j, ±11 % à 90 j, ±15 % en fin de campagne).",
            "Modèles simulés dans le prototype (régression log-linéaire, ARIMA, Gradient "
            "Boosting simulés) ; en production, recalcul quotidien et suivi de dérive.",
            "Le simulateur de scénarios chiffre les effets croisés des leviers de politique "
            "cotonnière, avec rendements décroissants.",
            "Objectif : passer d'un débat d'opinions à un débat de fourchettes, documenté et "
            "reproductible.",
        ],
        "footer": "MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION.",
    },
    {
        "type": "content",
        "kicker": "Risques & IA responsable",
        "title": "Aide à la décision — pas de décision automatique",
        "bullets": [
            "Chaque prédiction est explicable et assortie d'un niveau de confiance ; les "
            "recommandations sont tracées.",
            "Aucune décision critique n'est automatisée : la validation humaine par les "
            "directions métier est obligatoire.",
            "Les données du prototype sont entièrement synthétiques ; aucune donnée réelle ni "
            "nominative de la CMDT.",
            "Sécurité cible : chiffrement, RBAC, journal d'audit, gouvernance des données, "
            "moindre privilège sur toute la chaîne.",
        ],
        "footer": "Registre des risques : ≈ 10 risques structurels, chacun avec une action recommandée.",
    },
    {
        "type": "content",
        "kicker": "Vision de déploiement",
        "title": "Cinq phases, du prototype à l'intelligence prédictive",
        "bullets": [
            "Phase 1 — Prototype (en cours) : maquette sur données synthétiques, validation de "
            "la valeur métier et de l'UX avec la DG.",
            "Phase 2 — Pilote données réelles : une filiale, Data Warehouse PostgreSQL, "
            "premiers modèles ML (rendement, production).",
            "Phase 3 — Connexion aux SI existants : production agricole, égrenage / bascules, "
            "finance / crédit de campagne, météo / satellite ; RBAC, audit, chiffrement.",
            "Phase 4 — Déploiement institutionnel : généralisation aux 5 filiales, formation, "
            "conduite du changement.",
            "Phase 5 — Intelligence prédictive avancée : alerte précoce ravageurs / sécheresse, "
            "optimisation logistique, LLM + RAG explicable.",
        ],
        "footer": "Architecture cible : Sources → Intégration → Data Warehouse → Analytics → ML → "
        "Couche IA/LLM → Moteur de décision → Dashboard · Copilot · Reports.",
    },
    {
        "type": "content",
        "kicker": "Prochaines étapes",
        "title": "Ce que nous proposons à la Direction Générale",
        "bullets": [
            "Valider la valeur métier du prototype et le périmètre fonctionnel des 10 modules.",
            "Désigner une filiale pilote et un référent données par direction métier.",
            "Cadrer la Phase 2 : sources prioritaires, gouvernance de la donnée, cible du Data "
            "Warehouse.",
            "Définir les indicateurs et pondérations officiels (aujourd'hui hypothèses de travail).",
            "Planifier la revue de campagne récurrente appuyée sur la plateforme.",
        ],
        "footer": PRODUCT["url"],
    },
    {
        "type": "content",
        "kicker": "Avertissement",
        "title": "Prototype de démonstration",
        "bullets": [
            "Toutes les données présentées sont synthétiques et générées de façon déterministe.",
            "Le moteur analytique et le copilote sont simulés dans le navigateur ; aucun modèle "
            "de langage n'est connecté.",
            "L'export PDF et l'authentification sont simulés.",
            "Les analyses, prévisions et recommandations sont des aides à la décision, à valider "
            "par les directions métier.",
        ],
        "footer": f"{PRODUCT['org']} · {PRODUCT['version']}",
    },
]
