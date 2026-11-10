---
title: ArtUniverse
tagline: "Le Shazam de la peinture — photographie un tableau, l'app le reconnaît, le raconte et recommande d'autres œuvres."
status: wip
featured: true
order: 4
year: "2026"
stack: [Expo, React Native, TypeScript, CLIP (Transformers.js), PostgreSQL, pgvector, Wikidata, Vercel]
links: {}
role: "Conception, application mobile, backend, ingestion du catalogue"
highlights:
  - "71 commits"
  - "Embeddings CLIP de 512 dimensions"
  - "61 tests côté serveur, 25 côté mobile (revue du 5 novembre)"
  - "Chaîne complète photo → fiche déjà en place"
goal: "Photographier un tableau au musée ou ailleurs, le faire reconnaître de façon fiable, puis obtenir son histoire (artiste, contexte, technique) avec des informations exactes et sourcées, et des œuvres proches à découvrir."
currentStage: "La chaîne de bout en bout fonctionne (photo, recadrage, empreinte visuelle, recherche par similarité, fiche, collection locale), mais la reconnaissance n'est pas encore mesurée et le catalogue d'œuvres n'est pas encore curé. Une revue du projet a fixé le plan d'amélioration."
next:
  - "Construire un banc d'évaluation pour mesurer la reconnaissance au lieu de l'estimer à l'œil"
  - "Curer le catalogue (œuvres réellement croisées dans les musées) et traiter les licences et droits d'images"
  - "Fiabiliser la décision « trouvé / approximatif / inconnu »"
  - "Enrichir et sourcer les récits des œuvres"
---

## Le problème

Devant un tableau au musée, on voudrait savoir ce qu'on regarde sans chercher une étiquette. Les applications de reconnaissance d'art existent, mais reposent souvent sur des API tierces payantes ou donnent des informations sans source. Je veux une reconnaissance que je maîtrise de bout en bout, et des récits dont on peut vérifier l'origine.

## Ce que j'ai construit

Une application mobile Expo avec quatre onglets (Accueil, Scanner, Collection, Découvrir) et un backend qui reçoit une photo, calcule son empreinte visuelle, cherche l'œuvre la plus proche dans un catalogue et renvoie ses métadonnées avec un texte sur l'œuvre. La collection de l'utilisateur est sauvegardée en local sur l'appareil. Le catalogue est construit hors ligne par des lots d'ingestion depuis Wikidata.

## Choix techniques

- **Un moteur de reconnaissance maison.** Un modèle CLIP exécuté côté serveur (ONNX via Transformers.js) transforme chaque image en vecteur de 512 dimensions ; PostgreSQL avec pgvector retrouve les œuvres proches. Pas d'API de reconnaissance payante, donc aucun coût par image.
- **Un recadrage avant l'envoi.** L'app guide le cadrage du tableau et recadre la photo, et le serveur teste aussi plusieurs recadrages candidats pour retrouver de la confiance quand le fond gêne.
- **Un statut de résultat à trois niveaux** (trouvé, approximatif, aucun) plutôt qu'un oui/non, pour ne pas affirmer à tort.
- **Un catalogue construit par lots.** L'ingestion Wikidata est planifiée et reprenable, plutôt qu'un gros script lancé une fois.

## Ce que j'en retiens

Le plus utile a été la revue critique du projet : elle montre que « ça marche en démo » ne veut pas dire « c'est fiable ». Tant que la reconnaissance n'est pas mesurée sur un jeu d'évaluation et que les licences des textes et des images ne sont pas traitées, l'app n'est pas prête à être testée par d'autres. C'est pourquoi elle est présentée ici comme un chantier en cours, pas comme un produit.
