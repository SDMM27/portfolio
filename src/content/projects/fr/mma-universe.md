---
title: MMA Universe
tagline: "Une plateforme MMA en français qui publie son propre classement calculé, le FightScore."
status: live
featured: true
order: 2
year: "2024"
stack: [Next.js 14, TypeScript, PostgreSQL (Neon), Expo, Playwright, GitHub Actions, Clerk]
links:
  live: https://mma-universe.vercel.app
  repo: https://github.com/SDMM27/MMAUniverse
role: "Conception, scraping, modèle de notation, site et app mobile"
highlights:
  - "389 commits"
  - "13 organisations suivies"
  - "1 468 combats de test jamais vus par le modèle"
  - "Notation en TypeScript, sans bibliothèque de ML"
---

## Le problème

L'actualité et les résultats MMA en français sont éparpillés, et les classements existants sont soit officiels (donc discutables), soit des votes. Je voulais une note de combattant calculée à partir des statistiques réelles de chaque combat, sans avis éditorial, et la publier sur un site complet : cartes, résultats, fiches combattants, actualités.

## Ce que j'ai construit

- Un site Next.js : événements, fiches combattants avec palmarès et courbe de note, classement par catégorie et pound-for-pound, simulateur de combat, actualités par flux RSS, pronostics avec compte utilisateur.
- Une app mobile Expo qui consomme les routes API du site.
- Un pipeline de collecte tourné par GitHub Actions : synchro quotidienne, passes toutes les 30 minutes les soirs d'événement, recalcul du classement chaque lundi, actualités toutes les 2 heures.
- Le **FightScore**, un moteur de notation écrit en TypeScript de bout en bout.

## Choix techniques

- **Scraper en deux temps.** Chaque scraper écrit d'abord un fichier JSON, puis une étape séparée pousse ce fichier dans Postgres. Une synchro est rejouable sans refaire de requêtes réseau, et chaque rafraîchissement laisse une trace dans l'historique git.
- **Playwright seulement où il le faut.** UFCStats est protégé par un challenge JavaScript : j'y utilise un navigateur headless avec un contexte réutilisé pendant tout le crawl. Pour le reste, `axios` et `cheerio` suffisent, avec des requêtes espacées.
- **Parseurs testés sur du HTML réel.** Les pages sont enregistrées en fixtures : si une source change sa structure, un test échoue au lieu de corrompre la base sans bruit.
- **Un score en quatre étapes.** (1) Un score de dominance par victoire, qui compte autant les rounds gagnés que le finish. (2) Une note Glicko unique sur toute la carrière, avec une incertitude qui grandit à l'inactivité. (3) Un profil de style. (4) Une probabilité de victoire par régression logistique écrite à la main (descente de gradient) sur 15 écarts entre deux combattants.
- **Pas de k-means pour les styles.** Ma première version les utilisait ; les clusters changeaient d'un recalcul à l'autre, donc les étiquettes n'étaient pas fiables. Je suis passé à des règles comparées à la catégorie.

## Validation

Les paramètres sont réglés sur les combats antérieurs à mars 2023, puis évalués sur les 1 468 combats suivants, que le modèle n'a jamais vus : environ 57 % de bonnes prédictions avec la seule note de carrière, environ 58 % avec la régression logistique, contre 50 % au hasard. C'est modeste, et c'est normal pour un sport aussi incertain. La page méthodologie du site le dit clairement.

## Ce que j'en retiens

Un modèle n'a de valeur que mesuré : séparer l'entraînement du test et publier des chiffres honnêtes, même peu flatteurs, m'a appris plus que n'importe quel gain de précision. J'ai aussi retenu que la partie difficile d'un projet de données n'est pas le modèle mais le rapprochement des sources (noms accentués, surnoms, translittérations entre Sherdog, UFCStats et ufc.com).
