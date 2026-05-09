// middleware.js - DI COMMENT DULU UNTUK TESTING
import { NextResponse } from 'next/server';

export function middleware(request) {
  // COMMENT SEMUA ISI NYA DULU
  return NextResponse.next();
}

export const config = {
  matcher: [],
};