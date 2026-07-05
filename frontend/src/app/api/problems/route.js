const { db, problems } = require("@judgecode/backend");

export async function GET(req) {
  try {
    const list = await db
      .select({
        id: problems.id,
        title: problems.title,
        difficulty: problems.difficulty,
        timelimit: problems.timelimit,
        memorylimit: problems.memorylimit,
      })
      .from(problems);

    return Response.json({ problems: list }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to fetch problems" },
      { status: 500 }
    );
  }
}
