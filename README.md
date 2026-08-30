# TruthText AI

TruthText AI is an open-source Android writing utility for transparent AI-writing signal analysis and optional provider-powered rewriting. It is designed to be honest about uncertainty: the app does not claim that any detector can prove authorship, and it never presents a percentage as a verified probability.

## What the app does

The **Analyze** workspace accepts pasted or typed text, counts words and characters, and evaluates observable writing signals such as lexical variety, sentence rhythm, repeated openings, punctuation texture, long-sentence patterns, paragraph structure, and sample depth. Results are expressed as an assessment—**Likely human-like signals**, **Mixed signals**, **Likely AI-like signals**, or **Not enough evidence**—alongside a transparent AI-like signal index and evidence coverage.

The **AI-like signal index** is a heuristic summary of the local signal engine. It is not a probability, authorship proof, or forensic score. Editing, translation, genre, language, and sample length can all affect detector behavior. Do not use TruthText AI as the sole basis for academic, employment, disciplinary, or other high-impact decisions.

The **Humanize** workspace is optional. Users select a provider, endpoint, model, and API key themselves. The key is stored with Expo SecureStore on Android until the user chooses **Clear stored data**. The app sends text only when the user explicitly starts a rewrite request.

## Screens and interaction

| Screen | Purpose |
|---|---|
| Analyze | Paste text, run local analysis, inspect the assessment, and open details or Humanize. |
| Result details | Review every signal, its observed value, and its explanation. |
| Humanize | Choose a tone and rewrite text through the configured provider. |
| History | Reopen or review locally saved analysis records. |
| Settings | Change System, Light, Dark, or Midnight themes and clear stored data. |

## Technology

TruthText AI uses Expo SDK 54, React Native, Expo Router, TypeScript, NativeWind-compatible project tooling, AsyncStorage for non-sensitive preferences and history, and Expo SecureStore for API keys. The local detector is deterministic TypeScript code in `lib/truthtext-core.ts`, so it works offline for analysis and does not require a server account.

## Local development

Install Node.js 22 or a compatible current LTS release, pnpm, and the Android toolchain if you want to build locally. Then run:

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

The web preview is useful for interface review. For native testing, open the project with Expo tooling on an Android device or emulator.

## Provider configuration

Humanization is not offline because it requires a language model. The app supports OpenAI-compatible endpoints, Anthropic Messages, Google Gemini, and Custom endpoints. Open the Humanize screen, choose a platform, provide the endpoint and model where needed, paste your own API key, and save it. The app uses the provider's documented request format and keeps the key in device secure storage.

For production use, consider routing provider calls through a trusted backend so API keys never leave a managed server boundary. The current client-side BYOK design is intended for personal use and explicitly makes the user responsible for provider costs, permissions, and key rotation.

## Privacy and data storage

Analysis can run locally without sending text anywhere. Local history and theme preferences are stored on the device. Provider keys are stored using Android Keystore-backed Expo SecureStore. When Humanize is used, the selected text and rewrite prompt are sent to the provider selected by the user. Provider retention and training policies are outside this project and must be reviewed by the user.

Use **Settings → Clear stored data** to remove the saved API key, provider preference, and local history. Uninstalling the Android app also removes its local app storage.

## Testing

The test suite covers short-text inconclusive behavior, signal coverage, prompt construction, and optional GitHub credential validation. The GitHub test is skipped automatically when `GITHUB_TOKEN` is not present, so normal open-source contributors do not need a GitHub token.

```bash
pnpm check
pnpm test
pnpm lint
```

## Android APK build

The repository includes the generated native Android project. With Android SDK and Java 21 available, use:

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

The release APK is written to `android/app/build/outputs/apk/release/app-release.apk`. If building through a managed CI or repository workflow, use the same Expo/Gradle versions declared by the project and do not commit signing keys.

## Project structure

| Path | Description |
|---|---|
| `app/(tabs)/index.tsx` | Main mobile experience and navigation states. |
| `lib/truthtext-core.ts` | Local detector, signal model, AI-like index, provider defaults, and prompt helper. |
| `tests/truthtext-core.test.ts` | Deterministic detector tests. |
| `tests/github-auth.test.ts` | Optional GitHub credential validation test. |
| `design.md` | Product-specific mobile interface plan. |
| `todo.md` | Implementation history and remaining work. |

## Limitations and responsible use

No text-only detector is universally accurate. A model can produce human-like text and a person can write text with patterns that resemble generated output. The app therefore reports signals and coverage, not certainty. A higher or lower AI-like index should be treated as a prompt for review, never as a verdict.

## Contributing

Please read `CONTRIBUTING.md`, run the checks above, and describe the user-visible behavior of your change. New detection signals should include an explanation, a limitation note, and deterministic tests. Do not submit credentials, private text samples, generated APK signing material, or provider secrets.

## License

This project is released under the MIT License. See `LICENSE`.
