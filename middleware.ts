import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedFromRequest } from '@/lib/auth';

// 認証が必要なパスのパターン
const ADMIN_PATHS = ['/admin', '/posts/new', '/settings'];
const ADMIN_API_METHODS: Record<string, string[]> = {
  '/api/posts': ['POST'],
  '/api/masks': ['POST'],
};

function isAdminApiRoute(pathname: string, method: string): boolean {
  // /api/posts/[id] のDELETEとPUT
  if (/^\/api\/posts\/\d+$/.test(pathname) && (method === 'DELETE' || method === 'PUT')) {
    return true;
  }
  // 他の管理API
  const allowed = ADMIN_API_METHODS[pathname];
  if (allowed && allowed.includes(method)) {
    return true;
  }
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // サイト全体のプライベートモード（既存機能を維持）
  if (process.env.PRIVATE_MODE === 'true') {
    const auth = req.headers.get('authorization');
    if (auth) {
      const [, base64] = auth.split(' ');
      const [, password] = atob(base64).split(':');
      if (password !== process.env.SITE_PASSWORD) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="loglist private"' },
        });
      }
    } else {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="loglist private"' },
      });
    }
  }

  // ログインページとログインAPIは常にアクセス可能
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // 管理系ページへのアクセスチェック
  const isAdminPage = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isAdminApi = isAdminApiRoute(pathname, method);

  // 編集ページのチェック (/posts/[id]/edit)
  const isEditPage = /^\/posts\/\d+\/edit$/.test(pathname);

  if (isAdminPage || isAdminApi || isEditPage) {
    if (!isAuthenticatedFromRequest(req)) {
      if (isAdminApi) {
        return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
      }
      // ページへのアクセスはログインページにリダイレクト
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
