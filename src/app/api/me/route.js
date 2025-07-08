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

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return Response.json({ user: decoded });
  } catch (err) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
