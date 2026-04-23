import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (process.env.PRIVATE_MODE !== 'true') return NextResponse.next();

  const auth = req.headers.get('authorization');
  if (auth) {
    const [, base64] = auth.split(' ');
    const [, password] = atob(base64).split(':');
    if (password === process.env.SITE_PASSWORD) return NextResponse.next();
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="loglist private"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
