---
title: GeoGame
tagline: "Geography mini-games on web and mobile, with a daily challenge and multiplayer rooms."
status: live
featured: true
order: 1
year: "2023"
stack: [React 18, Vite, Leaflet, i18next, Firebase, Firestore, Vercel, Expo, GitHub Actions]
links:
  live: https://geo-game.app/
  repo: https://github.com/SDMM27/GeoGame
role: "Design, development, production release"
highlights:
  - "883 commits"
  - "9 languages"
  - "Site, Expo app and API in a single repository"
  - "Firestore rules tested on emulators"
---

## The problem

There are dozens of geography quizzes, but most are either a text-field form or a map with nothing at stake. I wanted a game where you actually place a country on the map, where you can compete with friends, and that runs equally well in a browser and on a phone.

## What I built

A website (find a country on the map, quizzes, flags, capitals, borders, country rankings), an Ascension mode, a daily challenge and multiplayer rooms with invitations. Everything lives in one repository: the site, the mobile app and the server functions.

Around the game there is what a real product needs: accounts, friends, push notifications, account deletion that wipes all associated data, and a retention policy (expired rooms and invitations are cleaned up daily by a cron job).

## Technical choices

- **A shared game core.** The logic (hooks and utilities) lives in `src/` and the Expo app reuses it through Metro aliases. The game rules are written once, so the site and the mobile app cannot drift apart.
- **Firestore protected by rules, not by trust.** Scores are capped in the security rules. Those caps are generated from the code and data by a script, and CI fails if the rules tables differ from the code. Rules and API are tested against the Firebase emulators.
- **Vercel functions for anything that needs a secret.** Push notifications, daily reminder, account deletion: everything requiring admin rights goes through `firebase-admin` on the server, with a verified Firebase token.
- **Nine languages, two in the bundle.** French and English ship with the app, the other seven are loaded on demand to keep the first load light.
- **Leaflet rather than a heavy engine.** The map is the heart of the experience; Leaflet is enough and stays light.

## What I take from it

The most formative part is not the game, it is the duration: 883 commits over several years taught me to keep code readable as a project grows, to put tests where a mistake is expensive (security rules and the API) and to make web and mobile coexist without duplicating them.
