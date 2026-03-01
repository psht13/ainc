/// <reference lib="webworker" />

import type { TestCase, TestRunResult } from "../lib/types";

type RunTestsRequest = {
  type: "RUN_TESTS";
  payload: {
    code: string;
    testCases: TestCase[];
    timeoutMs: number;
  };
};

type WorkerResponse = {
  type: "TEST_RESULT";
  payload: TestRunResult;
};

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<RunTestsRequest>) => {
  if (event.data?.type !== "RUN_TESTS") {
    return;
  }

  const result: TestRunResult = {
    status: "error",
    passedCount: 0,
    totalCount: event.data.payload.testCases.length,
    error: "Client test execution is not implemented yet.",
    details: event.data.payload.testCases.map((testCase) => ({
      testCaseId: testCase.id,
      passed: false,
      message: "Pending worker implementation"
    }))
  };

  const response: WorkerResponse = {
    type: "TEST_RESULT",
    payload: result
  };

  workerScope.postMessage(response);
};

export {};
