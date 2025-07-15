const { Worker } = require("bullmq");
const { exec, execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const connection = { host: "127.0.0.1", port: 6379 };

require("dotenv").config({path: '../.env.local'});

const workerQueue = new Worker(
  "submission_queue",
  async (job) => {
    
      fs.writeFileSync(
        "./submissions/input.json",
        JSON.stringify(job.data)
      );
      execSync(`docker start worker`);
      execSync(
        `docker cp ./submissions/input.json worker:/app/input/input.json`
      );
      execSync(`docker exec worker node dockerRunner.js`);
      execSync(
        `docker cp worker2:/app/output/output.json ./submissions/output.json`
      );

      const output = fs.readFileSync("./submissions/output.json");
      const {results} = JSON.parse(output);
      fs.unlinkSync(`./submissions/input.json`);
      fs.unlinkSync(`./submissions/output.json`);

      let status = "Accepted";
      let ress=null;

      for (let result of results) {

        if (result.terminationFlag == "timeLimitExceeded") {
          status = "Time Limit Exceeded";
          ress=result;            
          break;
        } else if (result.terminationFlag == "memoryLimitExceeded") {
          status = "Memory Limit Exceeded";
          ress=result;
          break;
        } else if (result.terminationFlag == "runtimeError") {
          status = "Runtime Error";
          ress=result;
          break;
        } else if (result.terminationFlag == "wrongAnswer") {
          status = "Wrong Answer";
          ress=result;
          break;
        }
      }

    
    ress=JSON.stringify(ress);

    console.log({
        submissionId: job.data.submissionId,
        userId: job.data.userId,
        problemId: job.data.problemId,
        code: job.data.code,
        status: status.toLowerCase(),
        result: ress,
    })

    const response = await axios.post(`${process.env.BASE_URL}/api/log_submission`, {
        submissionId: job.data.submissionId,
        userId: job.data.userId,
        problemId: job.data.problemId,
        code: job.data.code,
        status: status.toLowerCase(),
        result: ress,
    })
        
  },
  { connection, concurrency: 1,  settings: {
    retryProcessDelay: 1000
  },
  limiter: {
    max: 5, duration: 1000
  } }
);
