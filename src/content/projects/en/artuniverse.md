---
title: ArtUniverse
tagline: "The Shazam for paintings — photograph a painting, the app recognizes it, tells its story and recommends other works."
status: wip
featured: true
order: 4
year: "2026"
stack: [Expo, React Native, TypeScript, CLIP (Transformers.js), PostgreSQL, pgvector, Wikidata, Vercel]
links: {}
role: "Design, mobile app, backend, catalog ingestion"
highlights:
  - "71 commits"
  - "512-dimension CLIP embeddings"
  - "61 server tests, 25 mobile tests (November 5 review)"
  - "Full photo-to-page chain already in place"
goal: "Photograph a painting in a museum or elsewhere, have it recognized reliably, then get its story (artist, context, technique) with accurate, sourced information, and related works to discover."
currentStage: "The end-to-end chain works (photo, cropping, visual fingerprint, similarity search, result page, local collection), but recognition is not measured yet and the artwork catalog is not curated yet. A review of the project has set the improvement plan."
next:
  - "Build an evaluation benchmark to measure recognition instead of judging it by eye"
  - "Curate the catalog (works people actually meet in museums) and handle licenses and image rights"
  - "Make the \"found / approximate / unknown\" decision reliable"
  - "Enrich and source the stories of the artworks"
---

## The problem

In front of a painting in a museum, you want to know what you are looking at without hunting for a label. Art recognition apps exist, but they often rely on paid third-party APIs or give information without sources. I want a recognition engine I control end to end, and stories whose origin can be checked.

## What I built

An Expo mobile app with four tabs (Home, Scan, Collection, Discover) and a backend that receives a photo, computes its visual fingerprint, looks for the closest artwork in a catalog and returns its metadata with a text about the work. The user's collection is saved locally on the device. The catalog is built offline by ingestion batches from Wikidata.

## Technical choices

- **A home-made recognition engine.** A CLIP model run server-side (ONNX via Transformers.js) turns each image into a 512-dimension vector; PostgreSQL with pgvector finds the closest works. No paid recognition API, so no per-image cost.
- **Cropping before upload.** The app guides how the painting is framed and crops the photo, and the server also tries several candidate crops to regain confidence when the background gets in the way.
- **A three-level result status** (found, approximate, none) rather than yes/no, so the app never claims more than it knows.
- **A catalog built in batches.** Wikidata ingestion is scheduled and resumable, rather than one big script run once.

## What I take from it

The most useful thing was the critical review of the project: it shows that "it works in a demo" does not mean "it is reliable". As long as recognition is not measured on an evaluation set and the licenses of texts and images are not handled, the app is not ready for others to test. That is why it is presented here as a work in progress, not as a product.
