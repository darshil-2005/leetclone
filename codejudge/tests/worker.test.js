const test = require("node:test");
const assert = require("node:assert");
const {
  normalizeMemoryLimit,
  mapTerminationFlagToStatus,
  selectSubmissionResult,
} = require("../helper.js");

test("normalizeMemoryLimit helper tests", (t) => {
  assert.strictEqual(normalizeMemoryLimit(null), 256);
  assert.strictEqual(normalizeMemoryLimit("invalid"), 256);
  assert.strictEqual(normalizeMemoryLimit(-10), 256);
  assert.strictEqual(normalizeMemoryLimit(50), 64);
  assert.strictEqual(normalizeMemoryLimit(128), 128);
  assert.strictEqual(normalizeMemoryLimit(512.6), 512);
});

test("mapTerminationFlagToStatus mapper tests", (t) => {
  assert.strictEqual(mapTerminationFlagToStatus("accepted"), "Accepted");
  assert.strictEqual(mapTerminationFlagToStatus("wrongAnswer"), "Wrong Answer");
  assert.strictEqual(mapTerminationFlagToStatus("timeLimitExceeded"), "Time Limit Exceeded");
  assert.strictEqual(mapTerminationFlagToStatus("memoryLimitExceeded"), "Memory Limit Exceeded");
  assert.strictEqual(mapTerminationFlagToStatus("outputLimitExceeded"), "Output Limit Exceeded");
  assert.strictEqual(mapTerminationFlagToStatus("compilationError"), "Compilation Error");
  assert.strictEqual(mapTerminationFlagToStatus("someUnknownFlag"), "Runtime Error");
});

test("selectSubmissionResult behavior tests", (t) => {
  const successOutput = {
    summary: { durationMs: 120, testsPassed: 2, totalTests: 2 },
    results: [
      { terminationFlag: "accepted", stdout: "", stderr: "", durationMs: 50 },
      { terminationFlag: "accepted", stdout: "", stderr: "", durationMs: 70 },
    ],
  };
  const successRes = selectSubmissionResult(successOutput);
  assert.strictEqual(successRes.status, "Accepted");
  assert.strictEqual(successRes.result.testsPassed, 2);
  assert.strictEqual(successRes.result.durationMs, 120);

  const failureOutput = {
    summary: { durationMs: 80, testsPassed: 1, totalTests: 2 },
    results: [
      { terminationFlag: "accepted", stdout: "", stderr: "", durationMs: 50 },
      { terminationFlag: "wrongAnswer", stdout: "", stderr: "", durationMs: 30 },
    ],
  };
  const failureRes = selectSubmissionResult(failureOutput);
  assert.strictEqual(failureRes.status, "Wrong Answer");
  assert.strictEqual(failureRes.result.terminationFlag, "wrongAnswer");
  assert.strictEqual(failureRes.result.durationMs, 30);
});
