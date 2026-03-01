# STATE

Last updated: 2026-03-01

This file is the single source of truth for the repository state between prompts.

## Project title

Master's coursework (course project):
"Розробка архітектури АІНС на основі великих мовних моделей для реалізації діалогового агента з функціями репетитора".

## Current repository state

- A minimal Next.js App Router application now exists in the repository root.
- Stack: Next.js 15, React 19, TypeScript.
- The UI is a single-page split layout:
  - left: local-state chat UI with mock messages
  - right: `ExercisePanel` placeholder that becomes a mock task panel when the user asks for an exercise
- No authentication, no database, no persistent storage.
- No real LLM runtime integration yet; the repository runs in `mock` mode only.
- A provider abstraction exists in `lib/llm/client.ts`, backed by a `mock` provider implementation.
- A placeholder `/api/chat` route exists and returns deterministic mock responses.
- A browser worker contract exists in `workers/test-runner.worker.ts`, but real test execution is not implemented yet.

## MVP scope

The MVP remains a JavaScript programming tutor with these learner-facing modes:

- `Explain`: explain concepts, syntax, errors, and code behavior in simple tutor language.
- `Quiz`: generate short conceptual questions and validate answers.
- `Exercise`: generate coding tasks with tests and expected constraints.
- `Hint`: give partial guidance without revealing the full answer immediately.
- `Review`: review learner code and provide structured feedback.

## Non-goals

The MVP explicitly still does not include:

- Multi-language tutoring beyond JavaScript.
- Voice interface, speech-to-text, or text-to-speech.
- User accounts, cloud sync, or authentication.
- Paid model APIs or any third-party hosted inference dependency.
- Server-side execution of user JavaScript.
- Advanced analytics, plagiarism detection, or grading dashboards.
- Multi-user collaboration or teacher/admin panels.

## Module status

- `ChatOrchestrator`: planned, not implemented yet.
- `TutorPolicy`: planned, not implemented yet.
- `ExerciseGenerator`: planned, not implemented yet.
- `ClientTestRunner`: contract stub created in `workers/test-runner.worker.ts`; execution logic still pending.
- `FeedbackEvaluator`: planned, not implemented yet.
- `LLM Client Abstraction`: implemented at the minimum level with `mock` provider only.

## LLM runtime choice

### Recommended runtime

`Ollama` remains the default target runtime for real local LLM integration.

### Secondary option

`llama.cpp` with local HTTP server (`llama-server`) remains an acceptable fallback later.

### Environment check on 2026-03-01

- `ollama`: not installed in the current environment.
- `llama-server`: not installed in the current environment.
- `pnpm`: not installed in the current environment.
- `npm`: available.
- `node`: available (`v24.10.0`).

### Decision for the current codebase

- Canonical future integration path: `Ollama`.
- Immediate development mode: `mock`.
- All future LLM integration should continue using `lib/llm/client.ts` as the provider boundary.

## Env vars

The repository now includes `.env.local.example` with:

- `LLM_PROVIDER`
- `LLM_BASE_URL`
- `LLM_MODEL`
- `LLM_TEMPERATURE`
- `NEXT_PUBLIC_APP_NAME`

Default development assumption remains `LLM_PROVIDER=mock`.

## File tree

Current source tree after `PROMPT 1`:

```text
.
├── .env.local.example
├── .gitignore
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatShell.tsx
│   │   ├── Composer.tsx
│   │   └── MessageList.tsx
│   └── exercise/
│       └── ExercisePanel.tsx
├── docs/
│   └── codex/
│       ├── ARCHITECTURE.md
│       ├── SPEC.md
│       └── STATE.md
├── lib/
│   ├── llm/
│   │   ├── client.ts
│   │   └── providers/
│   │       └── mock.ts
│   └── types.ts
├── workers/
│   └── test-runner.worker.ts
├── next-env.d.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

Local generated artifacts also exist during development and are ignored by git:

- `node_modules/`
- `.next/`
- `.npm-cache/`
- `tsconfig.tsbuildinfo`

## Installed dependency versions

Installed and verified on 2026-03-01:

- `next@15.5.12`
- `react@19.2.4`
- `react-dom@19.2.4`
- `typescript@5.9.3`
- `@types/node@24.11.0`
- `@types/react@19.2.14`
- `@types/react-dom@19.2.3`

## Commands

Standard local commands:

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Type-check: `npm run typecheck`
- Production build: `npm run build`
- Start production server after build: `npm run start`

Environment-specific fallback if the user-level npm cache throws a permission error:

- `npm install --cache .npm-cache`

## Verification status

Verified on 2026-03-01:

- `npm run typecheck`: passed
- `npm run build`: passed
- `npm run dev`: started successfully

During verification, port `3000` was already occupied in this environment, so Next.js automatically bound to `http://localhost:3001`.

## What is ready

- Minimal runnable Next.js shell with App Router and TypeScript.
- Split demo layout with chat on the left and exercise panel on the right.
- Local React state for `messages` and current `exercise`.
- Shared domain types in `lib/types.ts`.
- Minimal mock LLM client and placeholder chat API route.
- Initial worker message contract for future client-side test execution.

## Next steps

- Wire the chat UI to call `/api/chat` instead of generating replies entirely on the client.
- Add the first explicit mode selector or intent routing (`Explain`, `Quiz`, `Exercise`, `Hint`, `Review`).
- Add a real exercise state model with editable learner code and visible test results.
- Implement actual browser-only execution in `workers/test-runner.worker.ts` with timeout handling.
- Add `ollama` provider implementation behind the existing LLM abstraction when the local runtime is installed.

## PROMPT 1 status

Completed:

1. Created the Next.js app shell and kept `docs/codex/*` intact.
2. Added `.env.local.example`.
3. Added `lib/llm/client.ts` and `lib/llm/providers/mock.ts`.
4. Added the first minimal chat page and placeholder `/api/chat` route.
5. Added the initial `Web Worker` skeleton.
6. Updated this file with the exact created files and runnable commands.

Still intentionally deferred:

- Real tutoring orchestration modules.
- Real browser test execution.
- Real local `Ollama` integration.
