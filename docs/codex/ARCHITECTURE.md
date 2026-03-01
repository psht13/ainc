# Architecture

Last updated: 2026-03-01

## Architectural intent

The system is designed as a local-first tutoring web application. The learner interacts through a chat-style UI. Tutoring content is generated through a provider-agnostic LLM layer. Learner code is never executed on the server; it is executed only in a browser `Web Worker` under strict timeout control.

## High-level modules

### UI layer

- Chat interface for learner messages and tutor responses.
- Panels for exercises, code input, test results, and review feedback.
- Mode indicators (`Explain`, `Quiz`, `Exercise`, `Hint`, `Review`).

### Application orchestration layer

- `ChatOrchestrator` receives a normalized user turn.
- It identifies the active learning intent or mode.
- It coordinates calls to `TutorPolicy`, `ExerciseGenerator`, `FeedbackEvaluator`, and the LLM client.

### Tutor logic layer

- `TutorPolicy` defines response style and pedagogical constraints.
- `ExerciseGenerator` creates structured exercise payloads.
- `FeedbackEvaluator` transforms code/test outcomes into educational feedback.

### LLM integration layer

- `lib/llm/client.ts` defines the provider-agnostic contract.
- Concrete providers are swappable adapters.
- Initial runtime modes:
  - `mock`: deterministic placeholder responses for UI development.
  - `ollama`: real local HTTP integration once installed.
- Optional later mode:
  - `llama-cpp`: alternate local HTTP-compatible adapter.

### Safe execution layer

- `ClientTestRunner` lives in the browser.
- It sends learner code and test definitions to a dedicated `Web Worker`.
- The worker executes within a time budget and returns:
  - pass/fail status
  - assertion details
  - runtime errors
  - timeout status

## Why the LLM choice is `Ollama`

`Ollama` is the preferred runtime because it offers the lowest operational friction for local development and thesis demonstration:

- local model management is simple;
- local HTTP access fits a clean adapter pattern;
- the app can treat it as a replaceable infrastructure dependency rather than embedding model runtime details into feature code.

At the time of initialization (2026-03-01), neither `ollama` nor `llama-server` is installed in the environment, so the architecture starts with a `mock` provider while preserving the `Ollama` target path.

## Planned data flows

### 1. Explain / Quiz flow

1. Learner sends a chat message.
2. UI posts the request to the application layer.
3. `ChatOrchestrator` determines that the request is `Explain` or `Quiz`.
4. `TutorPolicy` provides generation constraints.
5. The LLM client generates the instructional response.
6. UI renders the tutor output and follow-up actions.

### 2. Exercise flow

1. Learner requests a JavaScript exercise.
2. `ChatOrchestrator` delegates to `ExerciseGenerator`.
3. `ExerciseGenerator` uses policy constraints and LLM support to create:
   - task text
   - difficulty metadata
   - starter code (optional)
   - tests/specification
4. UI presents the exercise and code input area.

### 3. Hint flow

1. Learner asks for help while solving an exercise.
2. `ChatOrchestrator` provides current task context and learner progress.
3. `TutorPolicy` restricts answer leakage.
4. The LLM client generates a partial hint, not a full solution by default.
5. UI displays the hint and keeps the exercise active.

### 4. Review flow

1. Learner submits code for evaluation.
2. UI sends the code and test package to `ClientTestRunner`.
3. `ClientTestRunner` executes the code in a `Web Worker`.
4. Structured test results are returned to the app.
5. `FeedbackEvaluator` combines:
   - task context
   - learner code
   - test results
6. The LLM client (or a deterministic evaluator path, if implemented later) generates review text.
7. UI renders both raw test outcomes and tutor feedback.

## Execution safety model

- No learner code is executed in any server runtime.
- No Node.js `vm`, server-side `eval`, or route-handler code execution of learner submissions is allowed.
- All execution happens in the browser worker context.
- Timeouts are mandatory to prevent infinite loops from blocking the UI.
- Worker communication must be structured and serializable.

## Recommended implementation boundaries

- UI components should not know which LLM provider is active.
- Provider-specific URLs and model names must be environment-driven.
- Tutor modules should consume a typed LLM interface, not call provider HTTP endpoints directly.
- Test execution logic should be isolated from tutoring logic so it can be validated independently.

## Failure and fallback strategy

### If local llama is unavailable

- Set `LLM_PROVIDER=mock`.
- Keep all UI flows operational using deterministic mock responses.
- Continue implementing orchestration, state management, and safe code execution.

### When local llama becomes available

1. Install and run `Ollama`.
2. Set:
   - `LLM_PROVIDER=ollama`
   - `LLM_BASE_URL=http://127.0.0.1:11434`
   - `LLM_MODEL=<local-model-name>`
   - `LLM_TEMPERATURE=<value>`
3. Implement or enable the `ollama` adapter behind the same `lib/llm/client.ts` contract.
4. Keep the rest of the application unchanged.

## Initial operational assumptions

- Development starts with documentation only.
- The first runnable implementation step will scaffold a Next.js app shell.
- The first LLM-connected UX should use the `mock` provider so the app remains testable before installing a real local model runtime.
