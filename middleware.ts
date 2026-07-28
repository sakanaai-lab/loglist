import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedFromRequest } from '@/lib/auth';

const ADMIN_PATHS = ['/admin', '/posts/new', '/settings'];
const ADMIN_API_METHODS: Record<string, string[]> = {
  '/api/posts': ['POST'],
  // マスクの from_text は「隠したい元テキスト」そのものなので、
  // 参照(GET)も管理者限定にする
  '/api/masks': ['GET', 'POST'],
};

function isAdminApiRoute(pathname: string, method: string): boolean {
  if (/^\/api\/posts\/\d+$/.test(pathname) && (method === 'DELETE' || method === 'PUT')) {
    return true;
  }
  const allowed = ADMIN_API_METHODS[pathname];
  return !!(allowed && allowed.includes(method));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const isAdminPage = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAdminApi = isAdminApiRoute(pathname, method);
  const isEditPage = /^\/posts\/\d+\/edit$/.test(pathname);

  if (isAdminPage || isAdminApi || isEditPage) {
    if (!isAuthenticatedFromRequest(req)) {
      if (isAdminApi) {
        return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
