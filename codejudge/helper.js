const DEFAULT_MEMORY_LIMIT_MB = 256;

function normalizeMemoryLimit(value) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return DEFAULT_MEMORY_LIMIT_MB;
  }

  return Math.max(64, Math.floor(parsedValue));
}

function mapTerminationFlagToStatus(terminationFlag) {
  switch (terminationFlag) {
    case "accepted":
      return "Accepted";
    case "wrongAnswer":
      return "Wrong Answer";
    case "timeLimitExceeded":
      return "Time Limit Exceeded";
    case "memoryLimitExceeded":
      return "Memory Limit Exceeded";
    case "outputLimitExceeded":
      return "Output Limit Exceeded";
    case "compilationError":
      return "Compilation Error";
    default:
      return "Runtime Error";
  }
}

function selectSubmissionResult(runnerOutput) {
  const results = Array.isArray(runnerOutput.results) ? runnerOutput.results : [];
  const failingResult = results.find((result) => result.terminationFlag !== "accepted");

  if (failingResult) {
    return {
      status: mapTerminationFlagToStatus(failingResult.terminationFlag),
      result: failingResult,
    };
  }

  return {
    status: "Accepted",
    result: {
      terminationFlag: "accepted",
      stdout: "",
      stderr: "",
      output: "",
      durationMs: runnerOutput.summary?.durationMs || 0,
      testsPassed: runnerOutput.summary?.testsPassed ?? results.length,
      totalTests: runnerOutput.summary?.totalTests ?? results.length,
      results,
    },
  };
}

module.exports = {
  normalizeMemoryLimit,
  mapTerminationFlagToStatus,
  selectSubmissionResult,
};
