const { spawn } = require("node:child_process");
const fs = require("fs");
// const isEqual = require("lodash.isequal");
const { isDeepStrictEqual } = require('node:util');


function uuid() {
  
  let s='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 32; i++) {
    id += s[Math.floor(Math.random() * 62)];
  }
  return id;
}

async function testCaseCheck(
  args,
  time_limit,
  memory_limit,
  expectedOutput,
  tempfile
) {

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let terminationFlag = "";
    let returnResult;
    let wasKilled = false;

    const child = spawn("node", [tempfile], {
      timeout: time_limit,
      killSignal: "SIGKILL",
      env: {
        PATH: process.env.PATH,
        INPUT: JSON.stringify(args),
        EXPECTED_OUTPUT: JSON.stringify(expectedOutput),
        TIME_LIMIT: time_limit,
        MEMORY_LIMIT: memory_limit,
      },
    });

    const timeOut = setTimeout(() => {
      child.kill("SIGKILL");
      wasKilled = true;
      terminationFlag="timeLimitExceeded";
    }, time_limit);

    child.stdout.on("data", (data) => {
      stdout += data;
      if (stdout.length > 5000) {
        child.kill("SIGKILL");
        wasKilled = true;
        terminationFlag="outputLimitExceeded";
        return resolve({
          input: args,
          expectedOutput,
          result: "",
          terminationFlag: "outputLimitExceeded",
          stdOut: stdout,
          stdErr: stderr,
        });
      }
    });

    child.stderr.on("data", (data) => {stderr += data});

    child.on("close", (code, signal) => {

      clearTimeout(timeOut);

      if (signal && wasKilled) {

        returnResult = {
          input: args,
          expectedOutput,
          result: "",
          terminationFlag,
          stdOut: stdout,
          stdErr: stderr,
        };
        return resolve(returnResult);
      } 

      //*Look into if we need to handle the case signal and not wasKilled

      let output = stdout.split("___RESULT__STARTS___\n")[0];

      

      if (code == 0) {
        terminationFlag = "accepted";
        
        let resultSection = stdout
          .split("___RESULT__STARTS___\n")[1]
          .split("\n___RESULT__ENDS___")[0];

        if (resultSection.length > 0) {

          let result;

          try {
            result = JSON.parse(resultSection);
          } catch (error) {
            return resolve({
              input: args,
              expectedOutput,
              result,
              output: resultSection,
              terminationFlag: 'wrongAnswer',
              stdOut: output,
              stdErr: stderr,
            })            
          }
          if (!isDeepStrictEqual(result, expectedOutput)) {
            terminationFlag = "wrongAnswer";
          }
          returnResult = {
            input: args,
            expectedOutput,
            result,
            output: resultSection,
            terminationFlag,
            stdOut: output,
            stdErr: stderr,
          };
          return resolve(returnResult);
        }
      } else {
        terminationFlag = "runtimeError";
        returnResult = {
          input: args,
          expectedOutput,
          result: "",
          terminationFlag,
          stdOut: stdout,
          stdErr: stderr,
        };
        return resolve(returnResult);
      }
    });

    child.on("error", (err) => {
      return reject(err);
    });
  });
}

async function dockerRunner(
  code,
  testcases,
  params_types,
  return_type,
  function_name,
  time_limit,
  memory_limit,
  mode
) {
  let results = [];

  let caseRunnerCode = `${code};

    let a=JSON.parse(process.env.INPUT);
    let result=${function_name}(...a);

    console.log('___RESULT__STARTS___');
    console.log(JSON.stringify(result));
    console.log('___RESULT__ENDS___');

    `;

  const tempfile = `./submissions/temp.js`;
  fs.writeFileSync(tempfile, caseRunnerCode);


  params_types = params_types.split(",").map((d) => d.trim());
  return_type = return_type;

  for (let i = 0; i < testcases.length; i++) {
    let inputs = testcases[i].input;
    let expectedOut = testcases[i].expectedOutput;
    let args = [];

    for (let j = 0; j < inputs.length; j++) {
      if (
        params_types[j] == "number" ||
        params_types[j] == "number[]" ||
        params_types[j] == "string" ||
        params_types[j] == "boolean"
      ) {
        args.push(inputs[j]);
      }
    }

    let result = await testCaseCheck(
      args,
      time_limit,
      memory_limit,
      expectedOut,
      tempfile
    );
    results.push(result);
    if (result.terminationFlag != "accepted" && mode == "submit") {
      fs.unlinkSync(tempfile);
      return {results};
    }
  }

  fs.unlinkSync(tempfile);
  return {results};
}

async function main() {

  let data=fs.readFileSync("./input/input.json");
  let input=JSON.parse(data);
  let output=await dockerRunner(input.code, input.testcases, input.params_types, input.return_type, input.function_name, input.time_limit, input.memory_limit, input.mode);
  fs.writeFileSync("./output/output.json", JSON.stringify(output));

}
main();

module.exports = { dockerRunner };
