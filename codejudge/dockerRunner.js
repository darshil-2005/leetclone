const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("node:child_process");

const DEFAULT_TIME_LIMIT = 2000;
const DEFAULT_MEMORY_LIMIT_MB = 256;
const MAX_STDOUT_BUFFER = 64 * 1024;

function normalizeLimit(value, fallback) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }
  return Math.floor(parsedValue);
}

function runSingleTestCase({
  language,
  tempDir,
  execCmd,
  execArgs,
  input,
  expectedOutput,
  timeLimitMs,
  memoryLimitMb,
}) {
  const startedAt = Date.now();
  
  const spawnEnv = { ...process.env };
  if (language === "javascript" || language === "js" || language === "javascript/node") {
    spawnEnv.NODE_OPTIONS = `${process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : ""}--max-old-space-size=${memoryLimitMb}`;
  }

  const child = spawnSync(execCmd, execArgs, {
    cwd: tempDir,
    input: input,
    timeout: timeLimitMs,
    killSignal: "SIGKILL",
    encoding: "utf8",
    maxBuffer: MAX_STDOUT_BUFFER,
    env: spawnEnv,
  });

  const durationMs = Date.now() - startedAt;
  const stderr = child.stderr || "";
  const stdout = child.stdout || "";

  if (child.error && child.error.code === "ENOBUFS") {
    return {
      input,
      expectedOutput,
      output: stdout,
      stdout,
      stderr,
      terminationFlag: "outputLimitExceeded",
      durationMs,
    };
  }

  const timedOut = child.error && child.error.code === "ETIMEDOUT";
  if (timedOut) {
    return {
      input,
      expectedOutput,
      output: stdout,
      stdout,
      stderr,
      terminationFlag: "timeLimitExceeded",
      durationMs,
    };
  }

  if (child.status !== 0 || child.signal !== null) {
    // If process exited with 137 or was killed with SIGKILL (without ETIMEDOUT), it exceeded memory limit
    const isOom = child.status === 137 || child.signal === "SIGKILL";
    return {
      input,
      expectedOutput,
      output: stdout,
      stdout,
      stderr,
      terminationFlag: isOom ? "memoryLimitExceeded" : "runtimeError",
      durationMs,
    };
  }

  const actualClean = stdout.trim().replace(/\r\n/g, "\n");
  const expectedClean = expectedOutput.trim().replace(/\r\n/g, "\n");

  if (actualClean !== expectedClean) {
    return {
      input,
      expectedOutput,
      output: stdout,
      stdout,
      stderr,
      terminationFlag: "wrongAnswer",
      durationMs,
    };
  }

  return {
    input,
    expectedOutput,
    output: stdout,
    stdout,
    stderr,
    terminationFlag: "accepted",
    durationMs,
  };
}

function summarizeResults(results) {
  const firstFailureIndex = results.findIndex((result) => result.terminationFlag !== "accepted");
  const durationMs = results.reduce((total, result) => total + (result.durationMs || 0), 0);

  return {
    durationMs,
    testsPassed: firstFailureIndex === -1 ? results.length : firstFailureIndex,
    totalTests: results.length,
    firstFailureIndex: firstFailureIndex === -1 ? null : firstFailureIndex,
  };
}

function evaluateSubmission(input) {
  const lang = (input.language || "javascript").toLowerCase();
  const timeLimitMs = normalizeLimit(input.time_limit, DEFAULT_TIME_LIMIT);
  const memoryLimitMb = normalizeLimit(input.memory_limit, DEFAULT_MEMORY_LIMIT_MB);
  const testcases = Array.isArray(input.testcases) ? input.testcases : [];
  
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "judgecode-runner-"));

  try {
    let sourceFileName = "";
    let execCmd = "";
    let execArgs = [];

    if (lang === "javascript" || lang === "js") {
      sourceFileName = "solution.js";
      execCmd = "node";
      execArgs = ["solution.js"];
    } else if (lang === "python" || lang === "py" || lang === "python3") {
      sourceFileName = "solution.py";
      execCmd = "python3";
      execArgs = ["solution.py"];
    } else if (lang === "cpp" || lang === "c++" || lang === "c_cpp") {
      sourceFileName = "solution.cpp";
      execCmd = "./solution";
      execArgs = [];
    } else {
      throw new Error(`Unsupported language: ${input.language}`);
    }

    const sourcePath = path.join(tempDir, sourceFileName);
    fs.writeFileSync(sourcePath, input.code || "", "utf8");

    // Compilation step for C++
    if (lang === "cpp" || lang === "c++" || lang === "c_cpp") {
      const compileProcess = spawnSync("g++", ["-O3", "solution.cpp", "-o", "solution"], {
        cwd: tempDir,
        timeout: 10000,
        killSignal: "SIGKILL",
        encoding: "utf8",
      });

      if (compileProcess.status !== 0) {
        const compileErrorMsg = compileProcess.stderr || compileProcess.stdout || "Compilation failed";
        const results = testcases.map((tc) => ({
          input: tc.input || "",
          expectedOutput: tc.expectedOutput || "",
          output: "",
          stdout: "",
          stderr: compileErrorMsg,
          terminationFlag: "compilationError",
          durationMs: 0,
        }));

        // If no test cases are provided, create at least one placeholder result
        if (results.length === 0) {
          results.push({
            input: "",
            expectedOutput: "",
            output: "",
            stdout: "",
            stderr: compileErrorMsg,
            terminationFlag: "compilationError",
            durationMs: 0,
          });
        }

        return {
          results,
          summary: summarizeResults(results),
        };
      }
    }

    const results = [];

    for (const testcase of testcases) {
      const tcInput = typeof testcase.input === "string" ? testcase.input : JSON.stringify(testcase.input);
      const tcExpected = typeof testcase.expectedOutput === "string" ? testcase.expectedOutput : JSON.stringify(testcase.expectedOutput);

      const result = runSingleTestCase({
        language: lang,
        tempDir,
        execCmd,
        execArgs,
        input: tcInput,
        expectedOutput: tcExpected,
        timeLimitMs,
        memoryLimitMb,
      });

      results.push(result);

      if (result.terminationFlag !== "accepted" && input.mode === "submit") {
        return {
          results,
          summary: summarizeResults(results),
        };
      }
    }

    return {
      results,
      summary: summarizeResults(results),
    };
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function readInput() {
  if (!process.stdin.isTTY) {
    const rawInput = fs.readFileSync(0, "utf8").trim();
    if (rawInput) {
      return JSON.parse(rawInput);
    }
  }

  const fallbackPath = path.join(__dirname, "input", "input.json");
  if (fs.existsSync(fallbackPath)) {
    return JSON.parse(fs.readFileSync(fallbackPath, "utf8"));
  }

  throw new Error("No submission input provided");
}

async function main() {
  const input = readInput();
  const output = evaluateSubmission(input);

  process.stdout.write(JSON.stringify(output));
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(error.stack || error.message || String(error));
    process.exit(1);
  });
}

module.exports = {
  evaluateSubmission,
  normalizeLimit,
  runSingleTestCase,
  summarizeResults,
};
