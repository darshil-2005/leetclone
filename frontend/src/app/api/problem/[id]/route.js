const { db, problems } = require("@judgecode/backend");
const {eq} = require('drizzle-orm');


export async function GET(req, {params}) {

    const problemId=(await params).id;

    if (isNaN(problemId)) {
        return Response.json({ error: 'Invalid problem ID' }, { status: 400 });
    }

    const result = await db.select().from(problems).where(eq(problems.id, problemId));

    if (!result) {
        return Response.json({error: 'Problem does not exist!!'}, {status: 404});
    }

    const problem=result[0];

    if (!problem) {
        return Response.json({error: 'Problem does not exist!!'}, {status: 404});
    }

    return Response.json({message: 'Success!!', problem: problem}, {status:200})
}