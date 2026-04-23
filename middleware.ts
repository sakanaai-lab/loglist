import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth) {
    const [, base64] = auth.split(' ');
    const [, password] = atob(base64).split(':');
    if (password === process.env.ADMIN_PASSWORD) return NextResponse.next();
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="loglist admin"' },
  });
}

export const config = {
  matcher: ['/admin', '/admin/(.*)', '/settings', '/settings/(.*)'],
};
