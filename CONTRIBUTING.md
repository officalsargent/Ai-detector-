# Contributing to TruthText AI

Thank you for helping improve TruthText AI. The project values transparent UX, reproducible behavior, privacy, and responsible claims about AI-writing detection.

## Development workflow

Create a focused branch, make the smallest coherent change, and explain the user-visible behavior in the pull request. Before opening a pull request, run `pnpm check`, `pnpm test`, and `pnpm lint`. If the change affects native configuration, also test the Android build on a machine with the Android SDK installed.

## Detection changes

New signals must be deterministic, documented in the result details view, and covered by tests. Avoid describing a heuristic as a probability, certainty, proof, or forensic conclusion. If a change affects the AI-like signal index, update the README methodology and include examples of ambiguous or insufficient evidence.

## Privacy and credentials

Never commit API keys, GitHub tokens, signing keys, private writing samples, `.env` files, or generated credentials. Humanization providers are user-selected and may have their own retention policies; document any new provider request format and avoid logging request bodies.

## Pull requests

A good pull request includes a short problem statement, implementation summary, testing performed, screenshots or a screen recording for interface changes, and a note about any limitations. Keep copy clear and avoid claims that the detector is universally accurate.
