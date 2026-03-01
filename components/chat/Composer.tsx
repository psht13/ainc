"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

type ComposerProps = {
  isBusy: boolean;
  onSend: (value: string) => void;
};

export function Composer({ isBusy, onSend }: ComposerProps) {
  const [draft, setDraft] = useState("");

  function submit() {
    const nextDraft = draft.trim();

    if (!nextDraft) {
      return;
    }

    onSend(nextDraft);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="composer-shell">
      <form className="composer-form" onSubmit={handleSubmit}>
        <div>
          <textarea
            className="composer-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for an explanation, quiz, hint, review, or type “exercise”."
            aria-label="Message composer"
          />
          <p className="composer-hint">Press Enter to send. Shift+Enter adds a line.</p>
        </div>
        <button className="composer-button" type="submit" disabled={isBusy}>
          {isBusy ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}

