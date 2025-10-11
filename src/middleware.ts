import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware disabled - No backend authentication
export async function middleware(request: NextRequest) {
  // No auth checks - frontend only mode
  return NextResponse.next()
}

// Middleware disabled - no routes to protect
export const config = {
  matcher: [],
}
