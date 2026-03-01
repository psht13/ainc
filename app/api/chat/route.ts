import { createLlmClient } from "../../../lib/llm/client";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | {
        messages?: { content?: string; role?: string }[];
      }
    | null;

  const messages = Array.isArray(payload?.messages)
    ? payload.messages
        .filter(
          (message): message is { content: string; role: "assistant" | "system" | "user" } =>
            typeof message?.content === "string" &&
            (message?.role === "assistant" ||
              message?.role === "system" ||
              message?.role === "user")
        )
        .map((message) => ({
          content: message.content,
          role: message.role
        }))
    : [];

  const client = createLlmClient();
  const reply = await client.generateReply({ messages });

  return Response.json({
    provider: process.env.LLM_PROVIDER ?? "mock",
    reply
  });
}

