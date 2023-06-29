import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { supabase } from '../supabase';
import jwtDecode from 'jwt-decode';

export default async function middleware(req) {
  const res = NextResponse.next();
  const token = req.cookies.get('access_token')?.value;

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
