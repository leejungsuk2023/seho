import { NextResponse } from "next/server"
import { PostStatus } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/auth"
import { canManageUsers } from "@/lib/auth/permissions"
import { getAdminPostList } from "@/lib/admin/stats"

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).optional(),
  blog: z.string().trim().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  q: z.string().trim().optional(),
})

export async function GET(request: Request) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const query = Object.fromEntries(new URL(request.url).searchParams)
  const parsed = querySchema.safeParse(query)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "쿼리 파라미터를 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { page, pageSize, blog, status, q } = parsed.data
  const result = await getAdminPostList({
    page,
    pageSize,
    blogSlug: blog,
    status,
    query: q,
  })

  return NextResponse.json(result)
}
