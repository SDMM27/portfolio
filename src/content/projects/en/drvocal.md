---
title: Dr Vocal
tagline: "A 100% local voice assistant to control Spotify, Discord and your notes by voice, without leaving your game."
status: wip
featured: true
order: 6
year: "2026"
stack: [Python, faster-whisper, openWakeWord, Piper, Silero VAD, Spotify API, discord.py, uv, pytest]
links:
  repo: https://github.com/SDMM27/DrVocal
role: "Design, development, measurements"
highlights:
  - "53 commits"
  - "Wake word, transcription and voice: all local"
  - "0.25% CPU on standby (measured over 10 min of silent stream)"
  - "No destructive action in the catalog"
goal: "Control your PC by voice during a game, in French and without alt-tabbing — music, voice channel, note-taking, Claude Code sessions — with an assistant that does not weigh on the game, does not wake up by mistake and cannot delete anything."
currentStage: "The core features exist (Spotify, Discord bot, notes, optional Claude Code sessions) and the wake word has been trained and measured with a real voice. The tool serves a single user today, with a still-manual setup (configuration and voice to download). Measurements during real gameplay remain to be done."
next:
  - "Measure standby load and false wake-ups during a real game with Discord"
  - "Make setup possible without a configuration file"
  - "Better understand each user despite game noise"
  - "Make it easier to add new actions"
---

## The problem

In the middle of a game, changing the music or muting yourself means leaving the game, and mainstream voice assistants send audio to the cloud, wake up by mistake and use resources. I wanted an assistant that stays discreet, runs locally, and whose permitted actions can be listed precisely.

## What I built

An assistant for Windows 11 that listens on standby, wakes up on a held key or a wake word, transcribes the sentence, understands it and runs an action: play a Spotify track, album or playlist, write in a Discord channel or move to a voice channel through a personal bot, dictate a note into a new dated file, or launch a Claude Code session in the background.

## Technical choices

- **Local by default.** Wake word (openWakeWord), end-of-speech detection (Silero), transcription (faster-whisper) and voice (Piper) all run on the machine. Only Spotify, Discord and Claude Code actions use the network, and only after a wake-up.
- **Understanding by rules, not by LLM.** The assistant does not converse: it maps the sentence to an action in a closed catalog. It is predictable, fast and offline. Open-ended exchanges go through Claude Code.
- **A closed catalog, by design.** No file deletion, no closing applications: those actions do not exist. A note never overwrites an existing note.
- **Caution about anti-cheat.** Key simulation is disabled by default, because sending keystrokes while a game is in the foreground can be seen as automation. A document explains the risk.
- **Numeric targets and a checkpoint.** Under 2% CPU on standby, under 300 MB of RAM, fewer than one false wake-up per hour. If openWakeWord cannot hold them, the plan calls for another engine, then a push-to-talk key.

## What I take from it

Setting the numbers to reach before coding the wake word forced me to measure, even on simple cases: on standby with a silent stream, the assistant holds 0.25% CPU and 213 MB of RAM, with no false wake-up, over 10 minutes. That is a start, not proof: the real test is a game with friends talking on Discord.
