---
title: GeoGame
tagline: "Des mini-jeux de géographie sur le web et le mobile, avec défi quotidien et salons multijoueurs."
status: live
featured: true
order: 1
year: "2023"
stack: [React 18, Vite, Leaflet, i18next, Firebase, Firestore, Vercel, Expo, GitHub Actions]
links:
  live: https://geo-game.app/
  repo: https://github.com/SDMM27/GeoGame
role: "Conception, développement, mise en production"
highlights:
  - "883 commits"
  - "9 langues"
  - "Site, app Expo et API dans un seul dépôt"
  - "Règles Firestore testées sur émulateur"
---

## Le problème

Les quiz de géographie existent par dizaines, mais la plupart sont soit un formulaire à champ texte, soit une carte sans enjeu. Je voulais un jeu où l'on place vraiment un pays sur la carte, où l'on peut se mesurer à des amis, et qui tourne aussi bien dans un navigateur que sur un téléphone.

## Ce que j'ai construit

Un site (trouver un pays sur la carte, quiz, drapeaux, capitales, frontières, classements de pays), un mode Ascension, un défi quotidien et des salons multijoueurs avec invitations. L'ensemble tient dans un seul dépôt : le site, l'application mobile et les fonctions serveur.

Autour du jeu, il y a ce qu'un vrai produit demande : comptes, amis, notifications push, suppression de compte avec effacement de toutes les données associées, et une politique de rétention (salons et invitations expirés nettoyés chaque jour par un cron).

## Choix techniques

- **Un cœur de jeu partagé.** La logique (hooks et utilitaires) vit dans `src/` et l'app Expo la réutilise via des alias Metro. Les règles du jeu ne sont écrites qu'une fois, ce qui évite que le site et le mobile divergent.
- **Firestore protégé par des règles, pas par la confiance.** Les scores sont plafonnés côté règles de sécurité. Ces plafonds sont générés à partir du code et des données par un script, et la CI échoue si les tables des règles s'écartent du code. Les règles et l'API sont testées contre les émulateurs Firebase.
- **Fonctions Vercel pour ce qui exige un secret.** Notifications push, rappel quotidien, suppression de compte : tout ce qui nécessite des droits d'administration passe par `firebase-admin` côté serveur, avec jeton Firebase vérifié.
- **Neuf langues, deux dans le bundle.** Le français et l'anglais sont embarqués, les sept autres sont chargées à la demande pour ne pas alourdir le premier chargement.
- **Leaflet plutôt qu'un moteur lourd.** La carte est le cœur de l'expérience ; Leaflet suffit et reste léger.

## Ce que j'en retiens

Le plus formateur n'est pas le jeu, c'est la durée : 883 commits sur plusieurs années m'ont appris à garder un code lisible quand un projet grossit, à écrire les tests au bon endroit (les règles de sécurité et l'API, là où une erreur coûte cher) et à faire cohabiter web et mobile sans les dupliquer.
