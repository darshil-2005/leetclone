const { db, submissions } = require("@judgecode/backend");
const { eq, and } = require("drizzle-orm");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const problemIdStr = searchParams.get("problemId");
  if (!problemIdStr) {
    return Response.json({ error: "Missing problemId" }, { status: 400 });
  }

  const problemId = parseInt(problemIdStr);
  if (isNaN(problemId)) {
    return Response.json({ error: "Invalid problemId" }, { status: 400 });
  }

  try {
    const list = await db
      .select({
        submissionId: submissions.submissionId,
        userId: submissions.userId,
        problemId: submissions.problemId,
        language: submissions.language,
        code: submissions.code,
        status: submissions.status,
        result: submissions.result,
      })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, user.userId),
          eq(submissions.problemId, problemId)
        )
      );

    // Sort by submissionId or custom order in JS since there's no timestamp
    list.reverse();

    return Response.json({ submissions: list }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
