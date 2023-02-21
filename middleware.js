import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export default async function middlware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests if the following is true...
  // 1. If its a request for next-auth session & provider fetching
  // 2. If the token exists

  if (pathname.startsWith('/_next')) return NextResponse.next();

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  //  Redirect them to login if they don't have token and are requesting a protected route
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}
