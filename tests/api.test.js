const test = require('node:test');
const assert = require('node:assert');
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test('API Core Endpoints', async (t) => {
  let cookie = "";

  await t.test('GET /api/problems - Should fetch problems list', async () => {
    const res = await axios.get(`${BASE_URL}/api/problems`, { validateStatus: () => true });
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.problems));
  });

  await t.test('Auth Flow - Register and Login', async () => {
    const email = `testapi-${Date.now()}@example.com`;
    const password = "password123";
    
    const regRes = await axios.post(`${BASE_URL}/api/register`, { 
      email, 
      password, 
      name: "Test API User" 
    }, { validateStatus: () => true });
    
    assert.ok(regRes.status === 201 || regRes.status === 200, 'Registration should succeed');

    const loginRes = await axios.post(`${BASE_URL}/api/login`, { 
      email, 
      password 
    }, { validateStatus: () => true });
    
    assert.strictEqual(loginRes.status, 200);
    const setCookieHeader = loginRes.headers['set-cookie'];
    assert.ok(setCookieHeader);
    cookie = setCookieHeader[0].split(';')[0];
  });

  await t.test('GET /api/submissions - Should fetch submissions securely', async () => {
    const res = await axios.get(`${BASE_URL}/api/submissions?problemId=1`, {
      headers: { "Cookie": cookie },
      validateStatus: () => true
    });
    
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.submissions !== undefined);
  });
});
