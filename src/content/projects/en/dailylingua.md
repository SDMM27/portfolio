---
title: DailyLingua
tagline: "A daily language mission built on real content (press, RSS feeds), adapted to your level."
status: live
featured: true
order: 3
year: "2026"
stack: [Next.js 16, React 19, TypeScript, Supabase, PostgreSQL, Tailwind CSS 4, Claude API, Vitest, Playwright]
links:
  live: https://dailylingua-ashen.vercel.app
  repo: https://github.com/SDMM27/DailyLingua
role: "Design, development, database, CI"
highlights:
  - "127 commits"
  - "19 languages available"
  - "40 authentic content sources"
  - "Unit, pgTAP and end-to-end tests on a simulated iPhone"
---

## The problem

Language apps often rely on made-up sentences. Learning from real content (news articles, site feeds) is more motivating, but it means choosing, adapting and turning that content into exercises every single day. I wanted to automate that preparation without losing control over what the app displays.

## What I built

A phone-first web app, installable as a PWA. On the first open of the day, the **mission is prepared**: one piece of content is picked for each of the user's languages, then exercises are written by a Claude model from that content. Around it: personal vocabulary, spaced repetition, mission tracking, history and preferences, all stored per user.

Two scheduled jobs drive the machinery: feeds are fetched every 6 hours, and missions for users whose generation time has passed are prepared every hour.

## Technical choices

- **Supabase with RLS.** Each user only sees their own data, enforced by database-level policies and verified by pgTAP SQL tests rather than assumed.
- **AI generation behind an interface.** Claude (Haiku model) plugs in behind `ExerciseGenerator`, with a deterministic fallback generator that uses no AI. If the API fails, the mission still exists; and tests need no network call.
- **Sourced and verified content.** A catalog of 40 sources with their licenses, and a command that checks feeds, links and terms pages without touching the database.
- **Zod at the boundaries.** External data and forms are validated on the way in, so the rest of the code works on reliable types.
- **CI that mirrors production.** Typecheck, lint, unit and integration tests, pgTAP, end-to-end flows on WebKit as an iPhone 13, and a smoke test after every deployment.
- **Weight first.** For mobile I test on a production build: about 175 KB of JavaScript versus more than 3 MB in development mode.

## What I take from it

The value of a product built on an LLM mostly lies in what surrounds it: the interface that lets you swap it, the fallback when it fails, the tests that do not depend on it. I also learned to treat the database as code: versioned migrations, tested policies, generated types.

*Note: the deployed version requires creating an account.*
