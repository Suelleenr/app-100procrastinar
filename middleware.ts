import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/verify', '/auth/callback'];
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // Se não está autenticado e tentando acessar rota protegida
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Se está autenticado e tentando acessar rotas de auth
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
