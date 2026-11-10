---
title: Professor S
tagline: "A 3D narrative investigation game with a noir mood, set in the fictional port of Hypotown in 1952."
status: wip
featured: false
order: 8
year: "2026"
stack: [Unreal Engine 5, C++]
links: {}
role: "Game design, writing, programming"
highlights:
  - "Unreal Engine 5.8, dedicated C++ module"
  - "Fully bilingual FR/EN game"
  - "A world bible that is the source of truth"
  - "First case playable as a blockout"
goal: "Make an investigation game where you conduct interrogations, collect clues and make choices, with a first playable case as a demo."
currentStage: "The project is in the design and prototyping phase. The world, characters, locations and first case are written. On the Unreal side, the first location exists as a gray blockout, with a notebook and two objects to examine."
next:
  - "Integrate the clues and interrogations of the first case"
  - "Dress the first location beyond the blockout"
  - "Set up FR/EN localization by identifiers"
---

## The problem

An investigation game lives on the consistency of its story: a clue contradicted by another line of dialogue breaks everything. Before writing code, you need a source of truth for the world, the characters, the locations and every case.

## What I built

A world bible (writing rules, mechanics, global arc, decision log), character sheets and a location register, then a first case written end to end: truth, characters, clues, interrogations, choices and endings. On the engine side, an Unreal project with a C++ module and a first level as a blockout.

## Technical choices

- **Versioned text as the source of truth.** Reference documents live in the repository, mirrored from the working documents, so writing and integration stay in sync.
- **Unique identifiers** for every line of dialogue, clue and document, to localize into French and English without rework.
- **Explicit production rules.** Every important clue must be findable by at least two paths; everything stays credible in 1952; violence stays off screen.

## What I take from it

It is the project furthest from AI, and the one that teaches me to structure a large amount of content: an identifier scheme, a source of truth and written rules beat memory.
