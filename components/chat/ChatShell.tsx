"use client";

import { useState, useTransition } from "react";
import type { Exercise, Message } from "../../lib/types";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { ExercisePanel } from "../exercise/ExercisePanel";

function createMessage(role: Message["role"], content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString()
  };
}

function buildMockExercise(topicHint: string): Exercise {
  const normalizedHint = topicHint.trim() || "arrays";

  return {
    id: crypto.randomUUID(),
    mode: "exercise",
    title: "Create a Small Utility",
    prompt: `Write a JavaScript function named \`sumPositive\` that returns the sum of positive numbers in an array. Inspired by: "${normalizedHint}".`,
    difficulty: "easy",
    starterCode:
      "function sumPositive(numbers) {\n  // return the sum of positive values only\n}\n",
    testCases: [
      {
        id: crypto.randomUUID(),
        title: "ignores negative values",
        input: "[2, -3, 5, 1]",
        expectedOutput: "8"
      },
      {
        id: crypto.randomUUID(),
        title: "returns zero for empty input",
        input: "[]",
        expectedOutput: "0"
      }
    ],
    latestRun: null
  };
}

function buildAssistantReply(input: string): string {
  if (input.toLowerCase().includes("exercise")) {
    return "I prepared a starter exercise. The right panel now shows the task, starter code, and test intentions.";
  }

  return "This is a local mock tutor reply. Ask for an exercise, a quiz, or a JavaScript explanation to extend the flow.";
}

const initialMessages: Message[] = [
  {
    id: "welcome-assistant",
    role: "assistant",
    content:
      "Welcome. This is the MVP split layout: chat on the left, exercise workspace on the right.",
    createdAt: "2026-03-01T09:00:00.000Z"
  },
  {
    id: "welcome-user",
    role: "user",
    content: "Can you give me a JavaScript exercise?",
    createdAt: "2026-03-01T09:01:00.000Z"
  },
  {
    id: "exercise-hint",
    role: "assistant",
    content:
      "Type a new message with the word \"exercise\" to populate the placeholder panel with a mock task.",
    createdAt: "2026-03-01T09:02:00.000Z"
  }
];

export function ChatShell() {
  const [messages, setMessages] = useState<Message[]>(() => initialMessages);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isResponding, startTransition] = useTransition();

  function handleSend(content: string) {
    const nextInput = content.trim();

    if (!nextInput) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage("user", nextInput)
    ]);

    startTransition(() => {
      if (nextInput.toLowerCase().includes("exercise")) {
        setCurrentExercise(buildMockExercise(nextInput));
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", buildAssistantReply(nextInput))
      ]);
    });
  }

  return (
    <div className="split-layout">
      <section className="panel-card chat-card" aria-label="Tutor chat">
        <header className="section-header">
          <div>
            <p className="eyebrow">AINS Tutor</p>
            <h1 className="title">Local mock chat demo</h1>
            <p className="subtitle">
              Minimal App Router scaffold for the thesis MVP. The conversation is
              local state only for now.
            </p>
          </div>
          <span className="status-pill">mock mode</span>
        </header>
        <MessageList messages={messages} />
        <Composer onSend={handleSend} isBusy={isResponding} />
      </section>
      <ExercisePanel exercise={currentExercise} />
    </div>
  );
}

