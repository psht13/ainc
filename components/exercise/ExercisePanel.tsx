import type { Exercise } from "../../lib/types";

type ExercisePanelProps = {
  exercise: Exercise | null;
};

export function ExercisePanel({ exercise }: ExercisePanelProps) {
  return (
    <aside className="panel-card exercise-card" aria-label="Exercise panel">
      <header className="section-header" style={{ padding: 0 }}>
        <div>
          <p className="eyebrow">Exercise Panel</p>
          <h2 className="title" style={{ fontSize: "1.6rem" }}>
            {exercise ? exercise.title : "No exercise yet"}
          </h2>
          <p className="subtitle" style={{ marginTop: "6px" }}>
            {exercise
              ? "This placeholder panel will later hold task state, code editing, and test execution."
              : "Request an exercise in chat to replace this placeholder with a mock assignment."}
          </p>
        </div>
      </header>

      {exercise ? (
        <div className="exercise-state">
          <div className="exercise-tag-row">
            <span className="exercise-tag">{exercise.mode}</span>
            <span className="exercise-tag">{exercise.difficulty}</span>
            <span className="exercise-tag">
              {exercise.testCases.length} test
              {exercise.testCases.length === 1 ? "" : "s"}
            </span>
          </div>

          <p className="exercise-panel-copy">{exercise.prompt}</p>

          {exercise.starterCode ? (
            <div>
              <p className="eyebrow">Starter Code</p>
              <pre className="message-card">
                <code>{exercise.starterCode}</code>
              </pre>
            </div>
          ) : null}

          <div>
            <p className="eyebrow">Test Intentions</p>
            <ol className="test-list">
              {exercise.testCases.map((testCase) => (
                <li key={testCase.id} className="exercise-panel-copy">
                  {testCase.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="exercise-placeholder">
          <p className="exercise-panel-copy">No exercise yet</p>
        </div>
      )}
    </aside>
  );
}

