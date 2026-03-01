# STATE

Last updated: 2026-03-01

This file is the single source of truth for the repository state between prompts.

## Project title

Master's coursework (course project):
"Розробка архітектури АІНС на основі великих мовних моделей для реалізації діалогового агента з функціями репетитора".

## Current repository state

- Repository is intentionally empty except for documentation.
- No Next.js application has been created yet.
- No product code has been added yet.
- This step creates only architecture/spec/state markdown files.

## MVP scope

The MVP is a JavaScript programming tutor with these learner-facing modes:

- `Explain`: explain concepts, syntax, errors, and code behavior in simple tutor language.
- `Quiz`: generate short conceptual questions and validate answers.
- `Exercise`: generate coding tasks with tests and expected constraints.
- `Hint`: give partial guidance without revealing the full answer immediately.
- `Review`: review learner code and provide structured feedback.

## Non-goals

The MVP explicitly does not include:

- Multi-language tutoring beyond JavaScript.
- Voice interface, speech-to-text, or text-to-speech.
- User accounts, cloud sync, or authentication.
- Paid model APIs or any third-party hosted inference dependency.
- Server-side execution of user JavaScript.
- Advanced analytics, plagiarism detection, or grading dashboards.
- Multi-user collaboration or teacher/admin panels.

## Module list

- `ChatOrchestrator`: routes each user turn into the correct tutoring mode and composes final responses.
- `TutorPolicy`: enforces pedagogical rules (difficulty, tone, no direct answer leakage when a hint is requested).
- `ExerciseGenerator`: creates coding exercises, acceptance criteria, and test cases.
- `ClientTestRunner`: runs learner JavaScript only in a browser `Web Worker` with timeout and isolated messaging.
- `FeedbackEvaluator`: compares learner output/test results with exercise expectations and produces review feedback.

## LLM runtime choice

### Recommended runtime

`Ollama` is the default target runtime for the real local LLM integration.

### Why Ollama

- It provides a stable local HTTP API, which matches the planned app architecture well.
- It is simpler to install and operate for local thesis/demo environments than manually managing `llama.cpp` server binaries.
- Model pull/run workflow is straightforward for local development and repeatable on macOS.
- It is easier to swap models while keeping the same client abstraction.

### Secondary option

`llama.cpp` with local HTTP server (`llama-server`) remains a valid fallback provider if lower-level control or lighter runtime is needed later.

### Environment check on 2026-03-01

- `ollama`: not installed in the current environment (`command -v ollama` returned nothing).
- `llama-server`: not installed in the current environment (`command -v llama-server` returned nothing).
- `brew`: available.
- `curl`: available.
- `python3`: available.
- `npx`: available.

### Decision for this repository state

- Canonical integration path: `Ollama`.
- Immediate development mode: `mock` provider, because no local llama runtime is installed right now.
- Future code must be written against an abstraction in `lib/llm/client.ts`, so switching from `mock` to `ollama` later is only a configuration change plus one adapter implementation.

## LLM integration shape (planned, no code yet)

Planned interface location:

- `lib/llm/client.ts`

Planned responsibilities:

- Expose a provider-agnostic interface for chat/text generation.
- Hide provider-specific HTTP details (`ollama`, later optionally `llama.cpp`).
- Allow a `mock` implementation for UI and orchestration development when a real local LLM is unavailable.

Planned provider set:

- `mock`
- `ollama`
- optional later: `llama-cpp`

## Env vars

These values will be configured in `.env.local` once product code is created:

- `LLM_PROVIDER`: `mock` for UI-only development now; `ollama` after local runtime is installed.
- `LLM_BASE_URL`: default planned value for Ollama is `http://127.0.0.1:11434`.
- `LLM_MODEL`: local model identifier, defined by the installed runtime.
- `LLM_TEMPERATURE`: numeric generation temperature as a string, e.g. `0.2`.

Optional future app vars (not required yet, but likely useful):

- `NEXT_PUBLIC_APP_NAME`: UI label for the tutor.
- `NEXT_PUBLIC_DEFAULT_TIMEOUT_MS`: default client test runner timeout.

## File tree

Planned repository structure after `PROMPT 1+`:

```text
.
├── docs/
│   └── codex/
│       ├── ARCHITECTURE.md
│       ├── SPEC.md
│       └── STATE.md
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── chat/
│   ├── exercise/
│   └── review/
├── lib/
│   ├── llm/
│   │   ├── client.ts
│   │   ├── providers/
│   │   │   ├── mock.ts
│   │   │   └── ollama.ts
│   ├── tutor/
│   │   ├── chat-orchestrator.ts
│   │   ├── tutor-policy.ts
│   │   ├── exercise-generator.ts
│   │   └── feedback-evaluator.ts
│   └── utils/
├── workers/
│   └── test-runner.worker.ts
├── public/
├── tests/
│   ├── unit/
│   └── integration/
├── .env.local.example
├── package.json
└── tsconfig.json
```

## Commands

Planned commands for the next implementation step (not executed in this prompt):

- Safe scaffold command if the repo must stay non-empty:
  `npx create-next-app@latest temp-app --ts --app --src-dir --eslint --tailwind --use-npm --import-alias "@/*"`
- After scaffold, move the generated app shell into the repository root while keeping `docs/`.
- Start local dev server:
  `npm run dev`

Planned local llama setup commands (not executed in this prompt):

- Install Ollama on this machine:
  `brew install ollama`
- Start the local runtime:
  `ollama serve`
- Pull a local llama model:
  `ollama pull llama3.2:3b`

If Ollama is not installed by `PROMPT 1`, continue with:

- `.env.local` configured to `LLM_PROVIDER=mock`
- UI/orchestration development against the mock adapter

## TODO next steps

- Scaffold the Next.js app shell without deleting `docs/`.
- Add `.env.local.example` with `LLM_*` variables.
- Create the provider abstraction in `lib/llm/client.ts` plus a `mock` adapter first.
- Build the initial tutor chat UI and wire it to a placeholder chat route.
- Implement browser-only `Web Worker` execution with a hard timeout.
- Add the first exercise/test contract for JavaScript tasks.

## PROMPT 1 checklist

For `PROMPT 1`, the next chat should perform these steps:

1. Create the Next.js app shell and keep `docs/codex/*` intact.
2. Add `.env.local.example` with `LLM_PROVIDER`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_TEMPERATURE`.
3. Create `lib/llm/client.ts` interface plus `mock` provider implementation only.
4. Add the first minimal chat page and a placeholder API route that uses the mock provider.
5. Add the initial `Web Worker` skeleton for client-side code execution with timeout contract only.
6. Update this file (`docs/codex/STATE.md`) with the exact created files and current runnable commands.
