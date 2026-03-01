import type { Message } from "../../lib/types";

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <article
          key={message.id}
          className="message-card"
          data-role={message.role}
          aria-label={`${message.role} message`}
        >
          <span className="message-meta">
            {message.role === "assistant" ? "Tutor" : "Learner"}
          </span>
          <p className="message-copy">{message.content}</p>
        </article>
      ))}
    </div>
  );
}

