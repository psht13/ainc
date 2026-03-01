import type { Message } from "../types";
import { createMockLlmClient } from "./providers/mock";

export type ChatRequest = {
  messages: Pick<Message, "content" | "role">[];
};

export type LlmClient = {
  generateReply: (request: ChatRequest) => Promise<string>;
};

export type LlmProvider = "mock" | "ollama";

export function createLlmClient(provider?: string): LlmClient {
  const resolvedProvider = (provider ?? process.env.LLM_PROVIDER ?? "mock").toLowerCase();

  if (resolvedProvider === "mock") {
    return createMockLlmClient();
  }

  return createMockLlmClient();
}

