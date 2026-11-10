---
title: Dr Vocal
tagline: "Un assistant vocal 100 % local pour piloter Spotify, Discord et ses notes à la voix, sans quitter sa partie."
status: wip
featured: true
order: 6
year: "2026"
stack: [Python, faster-whisper, openWakeWord, Piper, Silero VAD, Spotify API, discord.py, uv, pytest]
links:
  repo: https://github.com/SDMM27/DrVocal
role: "Conception, développement, mesures"
highlights:
  - "53 commits"
  - "Réveil, transcription et voix : tout en local"
  - "0,25 % de CPU en veille (mesure sur 10 min de flux silencieux)"
  - "Aucune action destructrice dans le catalogue"
goal: "Piloter son PC à la voix pendant une partie, en français et sans alt-tab — musique, salon vocal, prise de notes, sessions Claude Code — avec un assistant qui ne pèse pas sur le jeu, ne se réveille pas à tort et ne peut rien supprimer."
currentStage: "Les fonctions de base existent (Spotify, bot Discord, notes, sessions Claude Code facultatives) et le mot de réveil a été entraîné puis mesuré avec une vraie voix. L'outil sert aujourd'hui à un seul utilisateur, avec une installation encore manuelle (configuration et voix à télécharger). Les mesures en situation de jeu réel restent à faire."
next:
  - "Mesurer la veille et les faux réveils pendant une vraie partie avec Discord"
  - "Rendre l'installation possible sans fichier de configuration"
  - "Mieux comprendre chaque utilisateur malgré le bruit du jeu"
  - "Faciliter l'ajout de nouvelles actions"
---

## Le problème

En pleine partie, changer de musique ou se couper le micro oblige à quitter le jeu, et les assistants vocaux grand public envoient l'audio dans le cloud, se réveillent à tort et consomment des ressources. Je voulais un assistant qui reste discret, qui fonctionne en local et dont on peut lister précisément ce qu'il a le droit de faire.

## Ce que j'ai construit

Un assistant pour Windows 11 qui écoute en veille, se réveille par une touche maintenue ou par un mot de réveil, transcrit la phrase, la comprend et exécute une action : lancer un titre, un album ou une playlist Spotify, écrire dans un salon Discord ou se déplacer dans un salon vocal via un bot personnel, dicter une note dans un nouveau fichier daté, ou lancer une session Claude Code en arrière-plan.

## Choix techniques

- **Local par défaut.** Réveil (openWakeWord), détection de fin de phrase (Silero), transcription (faster-whisper) et voix (Piper) tournent sur la machine. Seules les actions Spotify, Discord et Claude Code passent par le réseau, et seulement après un réveil.
- **Compréhension par règles, pas par LLM.** L'assistant ne converse pas : il associe la phrase à une action d'un catalogue fermé. C'est prévisible, rapide et sans réseau. Les échanges ouverts passent par Claude Code.
- **Un catalogue fermé, par conception.** Ni suppression de fichier ni fermeture d'application : ces actions n'existent pas. Une note n'écrase jamais une note existante.
- **Prudence vis-à-vis des anti-triche.** La simulation de touches est désactivée par défaut, parce qu'envoyer des touches pendant qu'un jeu est au premier plan peut être perçu comme de l'automatisation. Un document explique le risque.
- **Des cibles chiffrées et un point de contrôle.** Moins de 2 % de CPU en veille, moins de 300 Mo de RAM, moins d'un faux réveil par heure. Si openWakeWord ne les tient pas, le plan prévoit un autre moteur puis une touche à maintenir.

## Ce que j'en retiens

Fixer les chiffres à atteindre avant de coder le réveil m'a obligé à mesurer, y compris sur des cas simples : en veille sur un flux silencieux, l'assistant tient 0,25 % de CPU et 213 Mo de RAM, sans faux réveil, sur 10 minutes. C'est un début, pas une preuve : la vraie épreuve est une partie avec des amis qui parlent sur Discord.
