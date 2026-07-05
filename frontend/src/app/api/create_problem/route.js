const { db, problems, submit_testcases } = require("@judgecode/backend");
const jwt = require('jsonwebtoken');

const JWT_SECRET=process.env.JWT_SECRET;

function parseMaybeJson(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function POST(req) {

    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];
  
    if (!token) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }
  
    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();

  const {
    title,
    description,
    examples,
    constraints,
    difficulty,
    defaultCode = "",
    run_testcases = [],
    grading_testcases = [],
    timelimit = 2000,
    memorylimit = 256,
  } = body;

  if (!title || title.length > 100){
        return Response.json({error:'Title cannot be longer that 100 characters.'}, {status: 400})
    }

    const allowedDifficulty=["easy", "medium", "hard", "don't bother"];

    if (!allowedDifficulty.includes(difficulty.toLowerCase())){
        return Response.json({error: 'This difficulty not allowed!!'}, {status: 400});
    } 

    if (!description || !examples || !constraints) {
        return Response.json({error:'Invalid Data!!'}, {status: 400})
    }

    try {
        const inserted = await db.insert(problems).values({
            title,
            description,
            defaultCode,
            examples: parseMaybeJson(examples, examples),
            run_testcases: parseMaybeJson(run_testcases, []),
            constraints,
            difficulty: difficulty.toLowerCase(),
            authorId: user.userId,
            timelimit,
            memorylimit,
        }).returning({ id: problems.id });

        const problemId = inserted[0].id;

        if (grading_testcases && grading_testcases.length > 0) {
            const parsedGrading = parseMaybeJson(grading_testcases, []);
            const valuesToInsert = parsedGrading.map(tc => ({
                problemId,
                input: typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input),
                expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : JSON.stringify(tc.expectedOutput)
            }));
            await db.insert(submit_testcases).values(valuesToInsert);
        }

        return Response.json({ message: 'Problem created successfully', problemId });
    } catch (error) {
        console.error("Database insert error:", error);
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}