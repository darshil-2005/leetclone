import { db, submissions } from "@judgecode/backend";
import { eq } from "drizzle-orm";

export async function GET(req, {params}) {

  let submissionId = (await params).submissionId;

  // const submissionId=params.submissionId;

  try {
    const result = await db.select().from(submissions).where(eq(submissions.submissionId, submissionId));
    return Response.json({result: result[0]}, {status: 200});

  } catch(err) {

    return Response.json({"message": 'Some error happened while fetching submission!!', err})
  }
}