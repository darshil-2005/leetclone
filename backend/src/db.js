const path = require("path");
// Load environment variables from .env.local if not already defined (useful for scripts)
require("dotenv").config({ path: path.join(__dirname, "../../.env.local") });

const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { users, problems, submissions } = require("./schema.js");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

module.exports = { db, users, problems, submissions };
