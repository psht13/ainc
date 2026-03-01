import type { LlmClient, ChatRequest } from "../client";

function findLatestUserMessage(request: ChatRequest): string {
  const latestUserMessage = [...request.messages]
    .reverse()
    .find((message) => message.role === "user");

  return latestUserMessage?.content.trim() ?? "";
}

export function createMockLlmClient(): LlmClient {
  return {
    async generateReply(request) {
      const latestUserMessage = findLatestUserMessage(request);

      if (!latestUserMessage) {
        return "Mock tutor is ready. Send a learner message to continue.";
      }

      if (latestUserMessage.toLowerCase().includes("exercise")) {
        return "Mock mode: the exercise workflow is available. The UI can now render a placeholder task panel.";
      }

      return `Mock mode: received "${latestUserMessage}". Real LLM generation will be added behind the same interface later.`;
    }
  };
}

