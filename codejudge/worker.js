const { Worker } = require("bullmq");
const { execFileSync } = require("child_process");
const axios = require("axios");

require("dotenv").config({ path: require("path").join(__dirname, "../.env.local") });

const connection = { 
  host: process.env.REDIS_HOST || "127.0.0.1", 
  port: parseInt(process.env.REDIS_PORT || "6379") 
};
const RUNNER_IMAGE = process.env.RUNNER_IMAGE || "judgecode-runner";
const { normalizeMemoryLimit, selectSubmissionResult } = require("./helper.js");

function runInDocker(payload, memoryLimitMb) {
  const dockerArgs = [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--cpus",
    "1",
    "--pids-limit",
    "128",
    "--memory",
    `${memoryLimitMb}m`,
    "--memory-swap",
    `${memoryLimitMb}m`,
    RUNNER_IMAGE,
  ];

  return execFileSync("docker", dockerArgs, {
    input: JSON.stringify(payload),
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });
}

const workerQueue = new Worker(
  "submission_queue",
  async (job) => {
    const memoryLimitMb = normalizeMemoryLimit(job.data.memory_limit);

    try {
      const output = runInDocker(job.data, memoryLimitMb);
      const runnerOutput = JSON.parse(output);
      const { status, result } = selectSubmissionResult(runnerOutput);

      await axios.post(`${process.env.BASE_URL}/api/log_submission`, {
        submissionId: job.data.submissionId,
        userId: job.data.userId,
        problemId: job.data.problemId,
        code: job.data.code,
        status: status.toLowerCase(),
        result: JSON.stringify(result),
        language: job.data.language,
      });
    } catch (error) {
      const fallbackResult = {
        terminationFlag: "runtimeError",
        stdout: "",
        stderr: error.stderr ? String(error.stderr) : error.message || "Unknown runner failure",
        output: "",
        durationMs: 0,
      };

      await axios.post(`${process.env.BASE_URL}/api/log_submission`, {
        submissionId: job.data.submissionId,
        userId: job.data.userId,
        problemId: job.data.problemId,
        code: job.data.code,
        status: "runtime error",
        result: JSON.stringify(fallbackResult),
        language: job.data.language,
      });
    }
  },
  {
    connection,
    concurrency: 1,
    settings: {
      retryProcessDelay: 1000,
    },
    limiter: {
      max: 5,
      duration: 1000,
    },
  }
);

module.exports = { workerQueue };
