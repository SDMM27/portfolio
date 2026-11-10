---
title: DailyLingua
tagline: "Une mission linguistique quotidienne bâtie sur de vrais contenus (presse, flux RSS), adaptée à ton niveau."
status: live
featured: true
order: 3
year: "2026"
stack: [Next.js 16, React 19, TypeScript, Supabase, PostgreSQL, Tailwind CSS 4, Claude API, Vitest, Playwright]
links:
  live: https://dailylingua-ashen.vercel.app
  repo: https://github.com/SDMM27/DailyLingua
role: "Conception, développement, base de données, CI"
highlights:
  - "127 commits"
  - "19 langues disponibles"
  - "40 sources de contenu authentique"
  - "Tests unitaires, pgTAP et bout en bout sur iPhone simulé"
---

## Le problème

Les applications de langues reposent souvent sur des phrases fabriquées. Apprendre à partir de contenus réels (articles de presse, flux de sites) est plus motivant, mais demande de choisir, adapter et transformer ces contenus en exercices, tous les jours. Je voulais automatiser cette préparation sans perdre la maîtrise de ce que l'app affiche.

## Ce que j'ai construit

Une web app pensée d'abord pour le téléphone et installable (PWA). À la première ouverture du jour, la **mission est préparée** : choix d'un contenu par langue de l'utilisateur, puis exercices rédigés par un modèle de Claude à partir de ce contenu. Autour : un vocabulaire personnel, des révisions espacées, un suivi de mission, un historique et des préférences, enregistrés par utilisateur.

Deux tâches planifiées font tourner la mécanique : la relève des flux toutes les 6 heures, et la préparation horaire des missions des utilisateurs dont l'heure de génération est passée.

## Choix techniques

- **Supabase avec RLS.** Chaque utilisateur ne voit que ses données, garanti par des politiques au niveau de la base, vérifiées par des tests SQL pgTAP plutôt que supposées.
- **La génération par IA derrière une interface.** Claude (modèle Haiku) est branché derrière `ExerciseGenerator`, avec un générateur de secours déterministe sans IA. Si l'API échoue, la mission existe quand même ; et les tests n'ont besoin d'aucun appel réseau.
- **Des contenus sourcés et vérifiés.** Un catalogue de 40 sources avec leur licence, une commande qui vérifie les flux, les liens et les pages de conditions sans toucher la base.
- **Zod aux frontières.** Données externes et formulaires sont validés à l'entrée, le reste du code travaille sur des types fiables.
- **Une CI qui ressemble à la production.** Typecheck, lint, tests unitaires et d'intégration, pgTAP, parcours de bout en bout sous WebKit en iPhone 13, et un test de fumée après chaque déploiement.
- **Le poids avant tout.** Pour le mobile, je teste sur un build de production : environ 175 Ko de JavaScript contre plus de 3 Mo en mode développement.

## Ce que j'en retiens

La valeur d'un produit qui s'appuie sur un LLM tient surtout à ce qui l'entoure : l'interface qui permet de le remplacer, le repli quand il échoue, les tests qui n'en dépendent pas. J'y ai aussi appris à traiter la base de données comme du code : migrations versionnées, politiques testées, types générés.

*Note : la version déployée exige de créer un compte.*
