import { NextResponse } from 'next/server'
import { token } from '@/lib/auth'

export function proxy(request) {
  if (request.cookies.get('sesion')?.value === token()) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = { matcher: '/((?!login|_next|favicon.ico).*)' }
