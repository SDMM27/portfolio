---
title: TennisTrackin
tagline: "Des statistiques de match de tennis à partir d'une simple vidéo : détection, suivi, événements, stats."
status: wip
featured: true
order: 5
year: "2026"
stack: [Python, YOLO (Ultralytics), PyTorch, OpenCV, pandas, pytest]
links:
  repo: https://github.com/SDMM27/TennisTrackin
role: "Conception, vision par ordinateur, évaluation"
highlights:
  - "Étape 0 livrée : détection et suivi joueurs/balle"
  - "6 décisions d'architecture documentées (ADR)"
  - "Chaque étape mesurée contre le jeu TenniSet"
  - "Environ 10 images/s sur CPU à 640 px"
goal: "Analyser après coup une vidéo de match (caméra fixe, fond de court) pour produire des statistiques — services, coups droits, revers, longueur des échanges, zones de frappe, score — avec un MVP honnête dont chaque étape est mesurée."
currentStage: "L'étape 0 est livrée — ingestion vidéo, détection et suivi des joueurs et de la balle avec YOLO, contrats de données validés. Les premières mesures montrent que la balle n'est correctement détectée que sur moins de 2 % des images avec un détecteur générique : le suivi de balle est donc le prochain chantier."
next:
  - "Monter un jeu de référence sur des vidéos amateur, avec vérité terrain de la balle"
  - "Entraîner un suivi de balle fiable (fine-tuning), avec interpolation des trous"
  - "Calibrer le court (homographie) pour obtenir une vue de dessus"
  - "Détecter les frappes et les classer, puis compter les points"
---

## Le problème

Les statistiques de tennis détaillées sont réservées aux matchs professionnels équipés de capteurs. Pour un joueur amateur, filmer son match avec un téléphone posé derrière le court est à la portée de tous, mais il n'existe pas d'outil simple pour transformer cette vidéo en chiffres.

## Ce que j'ai construit

Un paquet Python installable, `tennisvision`, avec une ligne de commande : `analyze` produit une vidéo annotée, un fichier de pistes (`tracks.csv`) et un résumé (`summary.json`) ; `clip` extrait un échange ; `validate` vérifie les sorties contre des contrats de données ; `models` gère le cache des poids. Les sorties référencent des chemins relatifs, le traitement fonctionne hors ligne une fois les modèles téléchargés.

## Choix techniques

- **Décider par écrit.** Six ADR fixent le périmètre de la v1, le traitement hors ligne côté serveur, les limites d'une seule caméra, les licences. Je ne cherche ni le temps réel ni l'arbitrage au centimètre.
- **Mesurer contre une référence.** Chaque étape de la feuille de route a une métrique chiffrée calculée contre les annotations du jeu TenniSet : détection de balle, stabilité des identités des joueurs, instants de frappe.
- **Des contrats de données.** Les fichiers produits sont validés par schéma, pour qu'une étape en aval ne reçoive pas un format qui a dérivé.
- **Des tests sans modèle.** Un faux tracker permet de tester le pipeline sans télécharger de poids ni exécuter YOLO.

## Ce que j'en retiens

La première mesure a été humble : sur le point de test, la vraie balle n'est détectée que sur moins de 2 % des images avec un YOLO générique, et le taux « brut » plus flatteur à plus haute résolution venait presque entièrement d'une roue de caméra immobile prise pour une balle. Sans vérité terrain, un bon chiffre peut être un faux positif. D'où la décision de commencer par construire le jeu de référence avant d'optimiser quoi que ce soit.
