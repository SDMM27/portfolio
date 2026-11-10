---
title: NutriScope
tagline: "Un service d'aide au choix alimentaire bâti sur Open Food Facts, projet fil rouge de ma formation, en binôme."
status: wip
featured: false
order: 7
year: "2026"
stack: [Python, DuckDB, Parquet, PostgreSQL, SQL, pandas, pytest]
links:
  repo: https://github.com/SDMM27/NutriScope
role: "Pipeline de données et base PostgreSQL, en binôme avec Clément Welsch"
highlights:
  - "1 273 539 produits conservés après nettoyage"
  - "5 tables chargées dans PostgreSQL"
  - "Réalisé en binôme avec Clément Welsch"
  - "Nettoyage règle par règle, rapport avant/après"
goal: "Permettre d'identifier un produit alimentaire, d'expliquer sa qualité nutritionnelle, de proposer des substituts et de répondre aux questions de l'utilisateur grâce à un assistant RAG."
currentStage: "Le socle de données est en place — extraction du périmètre France depuis Open Food Facts, nettoyage, tables Parquet puis chargement dans PostgreSQL. Le machine learning (classification d'images, substitution) et le RAG sont les étapes suivantes."
next:
  - "Analyse exploratoire et modèles de substitution de produits"
  - "Classification d'images pour reconnaître un produit"
  - "Assistant conversationnel avec un système RAG"
---

## Le problème

Un score nutritionnel seul n'explique pas pourquoi un produit est bon ou moins bon, ni par quoi le remplacer. Le projet vise à aider à choisir, à partir des données ouvertes d'Open Food Facts, dont le volume (plus d'un million de produits pour la France) rend un simple fichier CSV impraticable.

## Ce que j'ai construit

Le pipeline de données : extraction du périmètre France, nettoyage et validation, production de cinq tables au format Parquet, puis chargement dans PostgreSQL. Lors du traitement complet, 1 273 567 lignes françaises ont été projetées et 1 273 539 produits conservés après nettoyage.

## Choix techniques

- **DuckDB et Parquet** pour travailler sur des données trop volumineuses pour la mémoire.
- **Nettoyer règle par règle.** Une valeur aberrante n'est pas une raison de supprimer tout le produit : selon le cas on corrige, on retire seulement la valeur, on garde le produit ou on l'écarte. Un rapport avant/après documente l'effet.
- **Nettoyer une seule fois, sur une base commune,** avant de créer les jeux de données, pour éviter les incohérences entre tables.
- **Un périmètre volontairement restreint** à six grands rayons, validés sur les données réelles.

## Ce que j'en retiens

Travailler à deux sur des données sales oblige à écrire les décisions : chaque règle de nettoyage et chaque choix de mapping est documenté, ce qui permet de se mettre d'accord et de refaire le traitement à l'identique.
