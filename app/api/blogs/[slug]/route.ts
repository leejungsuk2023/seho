import { NextResponse } from "next/server"

import { getBlogBySlug } from "@/lib/blogs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return new NextResponse("블로그를 찾을 수 없습니다.", { status: 404 })
  }

  return NextResponse.json(blog)
}
