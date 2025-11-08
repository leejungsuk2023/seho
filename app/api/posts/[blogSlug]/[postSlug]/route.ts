import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { getPostBySlug } from "@/lib/posts"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ blogSlug: string; postSlug: string }> },
) {
  const session = await auth()
  const { blogSlug, postSlug } = await params
  const post = await getPostBySlug({
    blogSlug,
    postSlug,
    viewerRole: session?.user?.role,
    viewerId: session?.user?.id,
  })

  if (!post) {
    return new NextResponse("포스트를 찾을 수 없습니다.", { status: 404 })
  }

  return NextResponse.json(post)
}
