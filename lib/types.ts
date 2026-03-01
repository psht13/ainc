export type MessageRole = "assistant" | "system" | "user";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type TestCase = {
  id: string;
  title: string;
  input?: string;
  expectedOutput?: string;
};

export type TestResultDetail = {
  testCaseId: string;
  passed: boolean;
  message: string;
};

export type TestRunStatus = "error" | "failed" | "idle" | "passed" | "timeout";

export type TestRunResult = {
  status: TestRunStatus;
  passedCount: number;
  totalCount: number;
  output?: string;
  error?: string;
  details: TestResultDetail[];
};

export type Exercise = {
  id: string;
  mode: "exercise";
  title: string;
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  starterCode?: string;
  testCases: TestCase[];
  latestRun: TestRunResult | null;
};

