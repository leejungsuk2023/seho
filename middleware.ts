import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Check for next-auth session token
  // NextAuth v5 uses authjs.session-token in production (HTTPS)
  const token = request.cookies.get("authjs.session-token") ||
                request.cookies.get("__Secure-authjs.session-token") ||
                request.cookies.get("next-auth.session-token") ||
                request.cookies.get("__Secure-next-auth.session-token")

  if (!token) {
    const callback = encodeURIComponent(pathname + search)
    return NextResponse.redirect(
      new URL(`/auth/sign-in?callbackUrl=${callback}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/blogs/:slug/write",
    "/blogs/:slug/edit/:path*",
  ],
}
