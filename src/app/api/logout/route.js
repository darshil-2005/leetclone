export async function POST() {
    return new Response(JSON.stringify({ message: 'Logged out' }), {
      status: 200,
      headers: {
        'Set-Cookie': 'token=deleted; Path=/; Max-Age=0; HttpOnly',
        'Content-Type': 'application/json'
      }
    });
  }