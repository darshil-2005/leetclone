const { db, problems, submit_testcases, users } = require('@judgecode/backend');
const { gt } = require('drizzle-orm');

async function cleanDb() {
  try {
    console.log("Deleting submit testcases for problems with ID > 10...");
    await db.delete(submit_testcases).where(gt(submit_testcases.problemId, 10));
    
    console.log("Deleting problems with ID > 10...");
    await db.delete(problems).where(gt(problems.id, 10));

    console.log("Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
}

cleanDb();
