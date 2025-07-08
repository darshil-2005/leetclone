const { db } = require("@/../lib/db");
const { users } = require("@/../lib/schema");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const JWT_SECRET=process.env.JWT_SECRET;

export async function POST(req) {
    const body = await req.json();
    console.log(body)

    const { email, password } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!password || password.length < 8) {
        return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const result = await db
    .select()
    .from(users)
    .where(eq(email, users.email));

    const user=result[0];

    if (!user) {
        return Response.json({ error: 'Wrong email or password' }, { status: 401 });
    }


    const correct=await bcrypt.compare(password, user.password);

    if (!correct) {
        return Response.json({error:'Wrong email or password!!'}, {status: 401})
    }

    const token = jwt.sign(
        {userId: user.id, email: user.email},
        JWT_SECRET,
        { expiresIn: '7d'}
    );

    return new Response(JSON.stringify({message: "Login Succesful!!"}), {status: 200,
        headers: {
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=604800`,
            'Content-Type': 'application/json'
        }
    })
}
