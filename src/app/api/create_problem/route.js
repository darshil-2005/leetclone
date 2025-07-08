const {db} = require('@/../lib/db')
const {problems} = require('@/../lib/schema')
const jwt = require('jsonwebtoken');

const JWT_SECRET=process.env.JWT_SECRET;

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

    const {title, description, examples, constraints, difficulty, author} = body;

    if (title.length>100){
        return Response.json({error:'Title cannot be longer that 100 characters.'}, {status: 400})
    }

    const allowedDifficulty=["easy", "medium", "hard", "don't bother"];

    if (!allowedDifficulty.includes(difficulty.toLowerCase())){
        return Response.json({error: 'This difficulty not allowed!!'}, {status: 400});
    } 

    if (!description || !examples || !constraints) {
        return Response.json({error:'Invalid Data!!'}, {status: 400})
    }

    await db.insert(problems).values({
        title,
        description,
        examples,
        constraints,
        difficulty: difficulty.toLowerCase(),
        authorId: user.userId,
    })

    return Response.json({ message: 'Problem created successfully' });
}