---
title: MMA Universe
tagline: "A French-language MMA platform that publishes its own computed ranking, the FightScore."
status: live
featured: true
order: 2
year: "2024"
stack: [Next.js 14, TypeScript, PostgreSQL (Neon), Expo, Playwright, GitHub Actions, Clerk]
links:
  live: https://mma-universe.vercel.app
  repo: https://github.com/SDMM27/MMAUniverse
role: "Design, scraping, rating model, website and mobile app"
highlights:
  - "389 commits"
  - "13 organizations tracked"
  - "1,468 test fights never seen by the model"
  - "Rating engine in TypeScript, no ML library"
---

## The problem

French-language MMA news and results are scattered, and existing rankings are either official (hence debatable) or votes. I wanted a fighter rating computed from the real statistics of each fight, with no editorial opinion, and to publish it on a complete site: cards, results, fighter pages, news.

## What I built

- A Next.js site: events, fighter pages with record and rating curve, ranking by weight class and pound-for-pound, a fight simulator, news through RSS feeds, picks with user accounts.
- An Expo mobile app that consumes the site's API routes.
- A collection pipeline run by GitHub Actions: daily sync, passes every 30 minutes on event nights, ranking recomputed every Monday, news every 2 hours.
- The **FightScore**, a rating engine written in TypeScript from end to end.

## Technical choices

- **Scraping in two steps.** Each scraper first writes a JSON file, then a separate step pushes that file into Postgres. A sync can be replayed without any network request, and every refresh leaves a trace in git history.
- **Playwright only where needed.** UFCStats is protected by a JavaScript challenge: I use a headless browser there, with one context reused across the whole crawl. Everywhere else `axios` and `cheerio` are enough, with spaced-out requests.
- **Parsers tested on real HTML.** Pages are saved as fixtures: if a source changes its structure, a test fails instead of silently corrupting the database.
- **A four-step score.** (1) A dominance score per win, counting won rounds as much as the finish. (2) A single Glicko rating over the whole career, with uncertainty that grows with inactivity. (3) A style profile. (4) A win probability from a hand-written logistic regression (gradient descent) on 15 differences between two fighters.
- **No k-means for styles.** My first version used it; clusters changed from one recompute to the next, so labels were unreliable. I switched to rules compared against the weight class.

## Validation

Parameters are tuned on fights before March 2023, then evaluated on the following 1,468 fights, which the model has never seen: about 57% correct predictions with career rating alone, about 58% with the logistic regression, against 50% for chance. That is modest, and expected for such an uncertain sport. The methodology page of the site says so plainly.

## What I take from it

A model is only worth what you can measure: separating training from testing and publishing honest numbers, even unflattering ones, taught me more than any accuracy gain. I also learned that the hard part of a data project is not the model but reconciling sources (accents, nicknames, transliterations across Sherdog, UFCStats and ufc.com).
