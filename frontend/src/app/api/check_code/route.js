const { db, submit_testcases, submissionsQueue } = require("@judgecode/backend");
const { eq } = require("drizzle-orm");
const { v4: uuid4 } = require("uuid");
const jwt = require("jsonwebtoken");

function parseMaybeJson(value) {
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
    const cookieHeader = req.headers.get('cookie');

    if (!cookieHeader || !cookieHeader.includes('token=')) {
        return Response.json({ error: 'Not logged in' }, { status: 401 });
    }

    const token = cookieHeader
        .split(';')
        .find(c => c.trim().startsWith('token='))
        ?.split('=')[1];

    if (!token) {
        return Response.json({ error: 'No token found' }, { status: 401 });
    }

    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.userId;
    const body = await req.json();
    const { problemId, mode, language, testcases, code, time_limit, memory_limit }=body;
    const effectiveTimeLimit = Number(time_limit) || 2000;
    const effectiveMemoryLimit = Number(memory_limit) || 256;

    try {

        if (mode == 'run') {

            if ((testcases.length)<1) {
                return Response.json({error: 'Nothing to test!!'}, {status: 400})
            }

            let submissionId=uuid4();

            try {    
                await submissionsQueue.add('submission_queue', {userId, problemId, submissionId, language, code, testcases, time_limit: effectiveTimeLimit, memory_limit: effectiveMemoryLimit, mode});
                return Response.json({message: 'Submission added to queue!!', submissionId}, {status: 200});
            } catch (error) {
                return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });                
            }

        }
        else if (mode == 'submit') {
    
            const dbResponse=await db.select({
                input: submit_testcases.input,
                expectedOutput: submit_testcases.expectedOutput
                            }).from(submit_testcases).where(eq(submit_testcases.problemId, problemId));

            const normalizedTestcases = dbResponse.map((testcase) => ({
                input: parseMaybeJson(testcase.input),
                expectedOutput: parseMaybeJson(testcase.expectedOutput),
            }));
    
            if (!dbResponse || dbResponse.length==0) {
                return Response.json({error: 'Testcases not found for the problem!!'}, {status: 404})
            }
    
            let submissionId=uuid4();

            try {
                await submissionsQueue.add('submission_queue', {
                    userId,
                    problemId,
                    submissionId,
                    language,
                    code,
                    testcases: normalizedTestcases,
                    time_limit: effectiveTimeLimit,
                    memory_limit: effectiveMemoryLimit,
                    mode,
                });
                return Response.json({message: 'Submission added to queue!!', submissionId}, {status: 200});
            } catch (error) {
                return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });                
            }
        }

        return Response.json({ error: 'Invalid mode' }, { status: 400 });
        
    } catch (error) {
        return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });        
    }
}
