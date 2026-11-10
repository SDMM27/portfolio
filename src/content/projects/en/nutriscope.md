---
title: NutriScope
tagline: "A food-choice assistance service built on Open Food Facts, the capstone project of my training, built as a pair."
status: wip
featured: false
order: 7
year: "2026"
stack: [Python, DuckDB, Parquet, PostgreSQL, SQL, pandas, pytest]
links:
  repo: https://github.com/SDMM27/NutriScope
role: "Data pipeline and PostgreSQL database, as a pair with Clément Welsch"
highlights:
  - "1,273,539 products kept after cleaning"
  - "5 tables loaded into PostgreSQL"
  - "Built as a pair with Clément Welsch"
  - "Rule-by-rule cleaning, before/after report"
goal: "Let users identify a food product, understand its nutritional quality, get substitutes, and ask questions to a RAG-based assistant."
currentStage: "The data foundation is in place — France extraction from Open Food Facts, cleaning, Parquet tables, then loading into PostgreSQL. Machine learning (image classification, substitution) and RAG are the next steps."
next:
  - "Exploratory analysis and product substitution models"
  - "Image classification to recognize a product"
  - "Conversational assistant with a RAG system"
---

## The problem

A nutrition score alone does not explain why a product is good or not so good, nor what to replace it with. The project aims to help people choose, from Open Food Facts open data, whose volume (over a million products for France) makes a plain CSV file impractical.

## What I built

The data pipeline: extraction of the France scope, cleaning and validation, production of five Parquet tables, then loading into PostgreSQL. In the full run, 1,273,567 French rows were projected and 1,273,539 products kept after cleaning.

## Technical choices

- **DuckDB and Parquet** to work on data too big for memory.
- **Clean rule by rule.** An outlier is not a reason to drop the whole product: depending on the case we fix it, remove only the value, keep the product or discard it. A before/after report documents the effect.
- **Clean once, on a common base,** before building the datasets, to avoid inconsistencies between tables.
- **A deliberately narrow scope** of six main aisles, validated against real data.

## What I take from it

Working as a pair on dirty data forces you to write decisions down: every cleaning rule and mapping choice is documented, which lets us agree and rerun the processing identically.
