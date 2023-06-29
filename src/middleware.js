import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { supabase } from '../supabase';
import jwtDecode from 'jwt-decode';

export default async function middleware(req) {
  const res = NextResponse.next();

  // console.log(req.cookies);

  // const supabase = createMiddlewareClient({ req, res });

  const token = req.cookies.get('access_token')?.value;
  // console.log(`token: ${token}`);

  if (!token) {
    return NextResponse.redirect('http://localhost:3000/');
  }

  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    return NextResponse.redirect('http://localhost:3000/');
  }

  return res;
}

export const config = {
  matcher: ['/dashboard'],
};
