const test = require('node:test');
const assert = require('node:assert');
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test('End-to-End Problem Creation and Grading Flow', async (t) => {
  const timestamp = Date.now();
  const email = `author-${timestamp}@example.com`;
  const password = "password123";
  let cookie = "";
  let problemId = null;
  let submissionId = null;

  await t.test('1. Register Author User', async () => {
    const regRes = await axios.post(`${BASE_URL}/api/register`, { 
      name: "E2E Author", 
      email, 
      password 
    }, { validateStatus: () => true });
    assert.strictEqual(regRes.status, 200, `Expected 200 OK, got ${regRes.status}`);
  });

  await t.test('2. Login to get session cookie', async () => {
    const loginRes = await axios.post(`${BASE_URL}/api/login`, { 
      email, 
      password 
    }, { validateStatus: () => true });
    assert.strictEqual(loginRes.status, 200, `Expected 200 OK, got ${loginRes.status}`);
    const setCookieHeader = loginRes.headers['set-cookie'];
    assert.ok(setCookieHeader, 'Set-Cookie header should be present');
    cookie = setCookieHeader[0].split(';')[0];
  });

  await t.test('3. Create Custom Problem', async () => {
    const problemPayload = {
      title: `E2E Custom Challenge ${timestamp}`,
      difficulty: "easy",
      description: "Return the sum of two numbers.",
      examples: [{ id: 1, input: "5 10", output: "15" }],
      constraints: "1 <= a, b <= 1000",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\nfunction solve() {\n  const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);\n  console.log(input[0] + input[1]);\n}\nsolve();"
      }),
      run_testcases: [{ input: "5 10", expectedOutput: "15" }],
      grading_testcases: [
        { input: "5 10", expectedOutput: "15" },
        { input: "20 30", expectedOutput: "50" }
      ],
      timelimit: 3000,
      memorylimit: 256
    };

    const createRes = await axios.post(`${BASE_URL}/api/create_problem`, problemPayload, {
      headers: { "Cookie": cookie },
      validateStatus: () => true
    });
    
    assert.strictEqual(createRes.status, 200, `Expected 200 OK, got ${createRes.status}`);
    problemId = createRes.data.problemId;
    assert.ok(problemId, 'Problem ID should be returned');
  });

  await t.test('4. Submit JavaScript Solution', async () => {
    const submitPayload = {
      problemId,
      language: "javascript",
      code: "const fs = require('fs');\nfunction solve() {\n  const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);\n  console.log(input[0] + input[1]);\n}\nsolve();",
      mode: "submit"
    };

    const submitRes = await axios.post(`${BASE_URL}/api/check_code`, submitPayload, {
      headers: { "Cookie": cookie },
      validateStatus: () => true
    });

    assert.strictEqual(submitRes.status, 200, `Expected 200 OK, got ${submitRes.status}`);
    submissionId = submitRes.data.submissionId;
    assert.ok(submissionId, 'Submission ID should be returned');
  });

  await t.test('5. Poll for Execution Result', async () => {
    let resultObj = null;
    let attempts = 0;
    while (attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const getRes = await axios.get(`${BASE_URL}/api/submission/${submissionId}`, {
        headers: { "Cookie": cookie },
        validateStatus: () => true
      });
      
      const getData = getRes.data;
      if (getData?.result && getData.result.status !== "pending") {
        resultObj = getData.result;
        break;
      }
      attempts++;
    }

    assert.ok(resultObj, 'Execution result should be retrieved before timeout');
    assert.strictEqual(resultObj.status, 'accepted', `Expected accepted status, got ${resultObj.status}`);
  });
});
