const { db, users, submissions, problems } = require('@judgecode/backend');
const { eq, desc } = require('drizzle-orm');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
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

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const userId = decoded.userId;

  try {
    // 1. Fetch User Info
    const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userRows.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userRows[0];

    // 2. Fetch Authored Problems
    const authoredProblems = await db.select({
      id: problems.id,
      title: problems.title,
      difficulty: problems.difficulty
    })
    .from(problems)
    .where(eq(problems.authorId, userId));

    // 3. Fetch Submissions
    const allSubmissions = await db.select({
      submissionId: submissions.submissionId,
      problemId: submissions.problemId,
      language: submissions.language,
      status: submissions.status,
      result: submissions.result,
      title: problems.title
    })
    .from(submissions)
    .leftJoin(problems, eq(submissions.problemId, problems.id))
    .where(eq(submissions.userId, userId));

    // Calculate Statistics
    const totalSubmissions = allSubmissions.length;
    const acceptedSubmissions = allSubmissions.filter(sub => sub.status === 'accepted').length;
    const acceptanceRate = totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0;
    
    // Sort submissions (assuming later array indices are more recent, or we can just reverse since we don't have a created_at timestamp right now)
    // Actually, submissions are appended to the table, so reversing gives roughly the most recent.
    const recentSubmissions = allSubmissions.reverse().slice(0, 10);

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate,
        authoredCount: authoredProblems.length
      },
      recentSubmissions,
      authoredProblems
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
