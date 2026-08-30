# TruthText AI — Mobile Interface Design

## Product direction

TruthText AI is a portrait-first, one-handed Android utility for analyzing writing signals and, when the user chooses, rewriting text through a provider API that the user controls. The app must never present a made-up certainty score. Detection results use transparent signal summaries, calibrated status labels, and an explicit **Not enough evidence** state for short or ambiguous text.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| **Analyze** | Main workspace with a large text editor, character/word count, paste/clear actions, analyze button, sample text shortcut, and the latest result summary. |
| **Result details** | Signal-by-signal explanation including burstiness, sentence rhythm, repetition, lexical variety, punctuation patterns, and stylistic consistency. Shows evidence coverage and limitations rather than fake probability. |
| **Humanize** | Text editor prefilled from the analyzed text, tone selector, rewrite instructions, provider status, and humanize action. If no provider is configured, opens the setup sheet. |
| **API setup** | Platform picker, endpoint/model fields where applicable, API key field, secure save action, connection/test status, and clear stored data action. Supports OpenAI-compatible, Anthropic, Google Gemini, and custom endpoint options. |
| **History** | Local-only list of prior analyses with date, text preview, status, and signal count. Allows reopening or deleting individual records and clearing all history. |
| **Settings** | Theme selector, detection methodology explainer, privacy/storage controls, provider management, and app version information. |

## Navigation

Use a compact three-tab navigation model: **Analyze**, **History**, and **Settings**. Result details and Humanize are pushed screens from Analyze or History. API setup is a modal-style pushed screen from Humanize or Settings. This keeps the core action reachable by thumb while preserving clear separation between analysis, saved work, and preferences.

## Key user flows

### Analyze text

1. User opens Analyze and taps the editor.
2. User pastes or types text; the count updates immediately.
3. User taps Analyze.
4. The app validates a minimum evidence threshold, runs the deterministic local signal engine, and presents either a transparent assessment or **Not enough evidence**.
5. User taps View details to inspect the signal cards and limitations.

### Humanize text

1. User taps Humanize from the Analyze result or opens Humanize from History.
2. User selects a tone such as Natural, Professional, Friendly, or Academic.
3. If a provider is configured, the app shows the provider name and proceeds after confirmation.
4. If no provider is configured, the app opens API setup, asks for platform and API key, stores the key using device-secure storage until the user clears it, and returns to Humanize.
5. The app sends only the user-selected text and rewrite instructions to the selected endpoint, then shows the rewritten result with copy and replace actions.

### Change theme

1. User opens Settings.
2. User selects System, Light, Dark, or Midnight.
3. The theme applies immediately and persists locally.

### Review previous work

1. User opens History.
2. User taps a record to reopen its result details or source text.
3. User can delete one record or clear all locally stored history after confirmation.

## Visual system

The visual language is a calm editorial dashboard: warm off-white surfaces, ink text, and an electric indigo accent for primary actions. Analysis states use semantic colors only for status communication: sage for human-like signals, amber for mixed/uncertain signals, and coral for stronger AI-like signals. The app avoids a circular percentage gauge; the main result uses a horizontal evidence meter with a labeled confidence band and an evidence count.

| Token | Light | Dark / Midnight |
|---|---|---|
| Background | `#F7F8FC` | `#0B1020` |
| Surface | `#FFFFFF` | `#151C31` |
| Elevated surface | `#F0F2FA` | `#1D2740` |
| Primary | `#5B5CE2` | `#8B8DF7` |
| Primary pressed | `#4748C7` | `#7072EA` |
| Foreground | `#171A2B` | `#F7F8FF` |
| Muted | `#6F748B` | `#A8B0C8` |
| Border | `#E2E5F0` | `#303B5C` |
| Sage | `#2D8A68` | `#66D2A5` |
| Amber | `#B97916` | `#F4C66B` |
| Coral | `#C9555A` | `#FF8B8E` |

## Component guidance

Use 16–24 px rounded cards, 48–52 px minimum touch targets, visible pressed states, and restrained 150–250 ms transitions. Text fields should be comfortable for long-form writing with a clear focus ring and a sticky bottom action bar. Use icons alongside labels for important actions, and never encode state by color alone: pair colors with labels and icons.

## Honest detection language

The result screen should say **Assessment: likely human-like signals**, **Assessment: mixed signals**, **Assessment: likely AI-like signals**, or **Not enough evidence**. It should display an evidence coverage label such as **6 of 7 signals available**, a short methodology note, and a limitation note explaining that no detector can reliably prove authorship from text alone. It must not show a fabricated probability or claim certainty.
