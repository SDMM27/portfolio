---
title: Professor S
tagline: "Un jeu d'enquête narratif en 3D, ambiance noire, dans le port fictif d'Hypotown en 1952."
status: wip
featured: false
order: 8
year: "2026"
stack: [Unreal Engine 5, C++]
links: {}
role: "Game design, écriture, programmation"
highlights:
  - "Unreal Engine 5.8, module C++ dédié"
  - "Jeu entièrement bilingue FR/EN"
  - "Une bible d'univers qui fait foi"
  - "Première affaire en blockout jouable"
goal: "Réaliser un jeu d'enquête où l'on mène des interrogatoires, relève des indices et tranche des choix, avec une première affaire jouable comme démo."
currentStage: "Le projet est en phase de conception et de prototypage. L'univers, les personnages, les lieux et la première affaire sont écrits. Côté Unreal, le premier lieu existe en blockout gris, avec un carnet et deux objets à examiner."
next:
  - "Intégrer les indices et les interrogatoires de la première affaire"
  - "Habiller le premier lieu au-delà du blockout"
  - "Mettre en place la localisation FR/EN par identifiants"
---

## Le problème

Un jeu d'enquête vit de la cohérence de son récit : un indice contredit par un autre dialogue casse tout. Avant d'écrire du code, il faut une source de vérité pour l'univers, les personnages, les lieux et chaque affaire.

## Ce que j'ai construit

Une bible d'univers (règles d'écriture, mécaniques, arc global, journal des décisions), des fiches de personnages et un registre de lieux, puis une première affaire écrite de bout en bout : vérité, personnages, indices, interrogatoires, choix et fins. Côté moteur, un projet Unreal avec un module C++ et un premier niveau en blockout.

## Choix techniques

- **Du texte versionné qui fait foi.** Les documents de référence vivent dans le dépôt, avec un mirroring depuis les documents de travail, pour qu'écriture et intégration restent synchronisées.
- **Des identifiants uniques** pour chaque ligne de dialogue, indice et document, afin de localiser en français et en anglais sans retouche.
- **Des règles de production explicites.** Chaque indice important doit pouvoir être trouvé par au moins deux chemins ; tout reste crédible en 1952 ; la violence reste hors champ.

## Ce que j'en retiens

C'est le projet le plus éloigné de l'IA, et celui qui m'apprend à structurer une grosse quantité de contenu : un schéma d'identifiants, une source de vérité et des règles écrites valent mieux que de la mémoire.
