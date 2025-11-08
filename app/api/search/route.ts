import { NextResponse } from "next/server"
import { z } from "zod"

import { searchPublishedPosts } from "@/lib/posts"

const querySchema = z.object({
  q: z.string().trim().min(1, { message: "검색어를 입력해주세요." }),
  blog: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(20).optional(),
})

export async function GET(request: Request) {
  const query = Object.fromEntries(new URL(request.url).searchParams)
  const parsed = querySchema.safeParse(query)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "검색어를 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { q, blog, page, pageSize } = parsed.data
  const result = await searchPublishedPosts({
    query: q,
    blogSlug: blog,
    page,
    pageSize,
  })

  return NextResponse.json({
    query: q,
    blog,
    ...result,
  })
}
