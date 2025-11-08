import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { canManageUsers, isWriter } from "@/lib/auth/permissions"

const BLOG_WRITE_REGEX = /^\/blogs\/[^/]+\/write$/
const BLOG_EDIT_REGEX = /^\/blogs\/[^/]+\/edit\/.+$/

export default auth((request) => {
  const { nextUrl, auth: session } = request
  const pathname = nextUrl.pathname
  const isAuthenticated = !!session?.user

  if (!isAuthenticated) {
    const callback = encodeURIComponent(pathname + nextUrl.search)
    return NextResponse.redirect(
      new URL(`/auth/sign-in?callbackUrl=${callback}`, nextUrl),
    )
  }

  const user = session?.user ?? null

  if (pathname.startsWith("/admin") && !canManageUsers(user)) {
    const from = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/forbidden?from=${from}`, nextUrl))
  }

  if (
    (BLOG_WRITE_REGEX.test(pathname) || BLOG_EDIT_REGEX.test(pathname)) &&
    !isWriter(user)
  ) {
    const from = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/forbidden?from=${from}`, nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/blogs/:slug/write",
    "/blogs/:slug/edit/:path*",
  ],
}
