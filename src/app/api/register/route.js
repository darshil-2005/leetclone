const {db} = require('@/../lib/db.js');
const {users} = require('@/../lib/schema.js')
const bcrypt = require('bcryptjs');
const {eq} = require('drizzle-orm');

export async function POST(req) {
    const body = await req.json();
    const {email, password, name}=body;

    //? Format checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!password || password.length < 8) {
        return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (name && name.length > 25) {
        return Response.json({ error: 'Name is too long' }, { status: 400 });
    }

    const existingUsers = await db.select().from(users).where(eq(users.email, email));

    if (existingUsers.length > 0) {
        return Response.json({error: 'User already exists!!'}, {status: 409})
    }

    const hashedPassword=await bcrypt.hash(password, 10);

    await db.insert(users).values({
        email, 
        password: hashedPassword,
        name: name,
    })
    
    return Response.json({message: 'User registered succesfully!!'})
} 