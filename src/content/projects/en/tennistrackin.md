---
title: TennisTrackin
tagline: "Tennis match statistics from a plain video: detection, tracking, events, stats."
status: wip
featured: true
order: 5
year: "2026"
stack: [Python, YOLO (Ultralytics), PyTorch, OpenCV, pandas, pytest]
links:
  repo: https://github.com/SDMM27/TennisTrackin
role: "Design, computer vision, evaluation"
highlights:
  - "Step 0 delivered: player and ball detection and tracking"
  - "6 documented architecture decisions (ADRs)"
  - "Every step measured against the TenniSet dataset"
  - "About 10 frames/s on CPU at 640 px"
goal: "Analyze a match video after the fact (fixed camera, baseline view) to produce statistics — serves, forehands, backhands, rally length, hitting zones, score — as an honest MVP where every step is measured."
currentStage: "Step 0 is delivered — video ingestion, player and ball detection and tracking with YOLO, validated data contracts. First measurements show the ball is correctly detected on fewer than 2% of frames with a generic detector, so ball tracking is the next job."
next:
  - "Build a reference set on amateur videos, with ground truth for the ball"
  - "Train a reliable ball tracker (fine-tuning), with gap interpolation"
  - "Calibrate the court (homography) to get a top-down view"
  - "Detect and classify shots, then count points"
---

## The problem

Detailed tennis statistics are reserved for professional matches equipped with sensors. For an amateur player, filming a match with a phone placed behind the court is within everyone's reach, but there is no simple tool to turn that video into numbers.

## What I built

An installable Python package, `tennisvision`, with a command line: `analyze` produces an annotated video, a tracks file (`tracks.csv`) and a summary (`summary.json`); `clip` extracts a rally; `validate` checks outputs against data contracts; `models` manages the weights cache. Outputs use relative paths, and processing works offline once models are downloaded.

## Technical choices

- **Decide in writing.** Six ADRs fix the v1 scope, offline server-side processing, the limits of a single camera, and licenses. I am not aiming for real time or centimeter-level line calling.
- **Measure against a reference.** Each step of the roadmap has a number computed against the annotations of the TenniSet dataset: ball detection, stability of player identities, hit timing.
- **Data contracts.** The files produced are schema-validated, so a downstream step never receives a format that has drifted.
- **Tests without a model.** A fake tracker lets me test the pipeline without downloading weights or running YOLO.

## What I take from it

The first measurement was humbling: on the test point, the real ball is detected on fewer than 2% of frames with a generic YOLO, and the flattering "raw" rate at higher resolution came almost entirely from a stationary camera wheel mistaken for a ball. Without ground truth, a good number can be a false positive. Hence the decision to build the reference set before optimizing anything.
