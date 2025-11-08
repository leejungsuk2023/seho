import { auth } from "@/auth"

export default auth((request) => {
  const { nextUrl, auth: session } = request
  const pathname = nextUrl.pathname

  if (!session?.user) {
    const callback = encodeURIComponent(pathname + nextUrl.search)
    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${callback}`, nextUrl),
    )
  }
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/blogs/:slug/write",
    "/blogs/:slug/edit/:path*",
  ],
}
