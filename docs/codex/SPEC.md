# MVP Specification

Last updated: 2026-03-01

## Goal

Build an MVP of an intelligent educational system (AINS) that acts as a dialogue-based JavaScript tutor powered by a free local llama model. The system should help a learner understand concepts, answer quizzes, solve coding exercises, receive hints, and get code review feedback.

## Core constraints

- Only local llama-based inference is allowed.
- No paid APIs.
- User JavaScript must execute only on the client side in a browser `Web Worker`.
- No server-side `eval`, `Function`, `vm`, or equivalent execution path for learner code.
- The architecture must allow development without a real model through a `mock` LLM client.

## MVP modules

- `ChatOrchestrator`
  Decides how to process each user message and which tutor mode to invoke.

- `TutorPolicy`
  Applies tutoring rules: gradual hints, level-appropriate phrasing, concise explanations, safe behavior.

- `ExerciseGenerator`
  Produces JavaScript tasks, task descriptions, starter code, and test cases for the client runner.

- `ClientTestRunner`
  Runs learner code in a `Web Worker`, enforces timeout, captures output/errors, returns structured results.

- `FeedbackEvaluator`
  Uses test outcomes and task expectations to generate review comments, identify likely mistakes, and propose next practice.

- `LLM Client Abstraction`
  Provider-neutral interface with concrete adapters for `mock` and later `ollama`.

## Primary user flow

1. The learner opens the app and starts a conversation.
2. The learner asks for one of the five supported learning actions: explanation, quiz, exercise, hint, or review.
3. `ChatOrchestrator` classifies the intent and builds a task request.
4. `TutorPolicy` constrains how the response should be generated.
5. If the request is content-generation based, the LLM adapter produces tutoring content.
6. If the request is an exercise or review, the learner can submit code.
7. The browser runs the code in `ClientTestRunner` inside a `Web Worker`.
8. `FeedbackEvaluator` combines test results with the tutor context and returns structured feedback.
9. The learner continues the dialogue with follow-up questions.

## Mode-specific flows

### Explain

- Input: learner question about JavaScript.
- Output: clear explanation, examples, common pitfalls, optional follow-up check question.

### Quiz

- Input: topic or difficulty level.
- Output: short question set, answer validation, explanation of correct answer.

### Exercise

- Input: topic, difficulty, or explicit task request.
- Output: problem statement, constraints, starter prompt, hidden/public tests.

### Hint

- Input: current task state or learner code.
- Output: partial guidance, next step suggestion, no full direct solution unless explicitly allowed by policy.

### Review

- Input: learner code plus task context.
- Output: quality feedback, detected issues, likely bug categories, suggestions for refactor or correction.

## User stories

- As a learner, I can ask for a simple explanation of a JavaScript concept and get a concise answer.
- As a learner, I can request a short quiz on a topic and immediately check my understanding.
- As a learner, I can request a coding exercise and receive a task with runnable tests.
- As a learner, I can submit code and get client-side test results without unsafe server execution.
- As a learner, I can ask for a hint that helps me progress without exposing the full answer too early.
- As a learner, I can request a code review and receive targeted feedback based on my code and test outcomes.
- As a developer/researcher, I can run the UI with a `mock` LLM provider before the real local llama runtime is installed.

## Acceptance criteria for MVP

- The app supports all five modes: `Explain`, `Quiz`, `Exercise`, `Hint`, `Review`.
- A provider abstraction exists for LLM calls.
- The system can run in `mock` mode without any external model runtime.
- Switching to `ollama` only changes configuration and provider wiring, not the UI or tutoring module contracts.
- Learner code runs only in a browser `Web Worker` with a timeout and structured error/result reporting.
- No feature in the MVP requires authentication or cloud infrastructure.

## Out of scope for MVP

- Persistent learner profiles.
- Long-term adaptive curriculum.
- Real-time collaboration.
- Native mobile clients.
- Speech interfaces.
- Fine-tuning or model training pipelines.
