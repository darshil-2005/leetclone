const { db, submissions } = require("@judgecode/backend");

export async function POST(req) {

    const body = await req.json();
    const { submissionId, userId, problemId, code, status, result, language } = body;

    try {
        await db.insert(submissions).values({
            submissionId,
            userId,
            problemId,
            code,
            status,
            result,
            language,
        });

        return Response.json({ message: 'Submission logged!!' }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }

}



