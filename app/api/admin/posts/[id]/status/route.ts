import { NextResponse } from "next/server"
import { PostStatus } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"

const bodySchema = z.object({
  status: z.nativeEnum(PostStatus, {
    errorMap: () => ({ message: "지원하지 않는 상태입니다." }),
  }),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "입력 값을 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { id } = await params
  const existing = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      publishedAt: true,
    },
  })

  if (!existing) {
    return new NextResponse("포스트를 찾을 수 없습니다.", { status: 404 })
  }

  let publishedAtUpdate: Date | null | undefined
  if (parsed.data.status === "PUBLISHED") {
    publishedAtUpdate =
      existing.status === "PUBLISHED"
        ? existing.publishedAt ?? new Date()
        : new Date()
  } else if (existing.status === "PUBLISHED") {
    publishedAtUpdate = null
  }

  const updated = await prisma.post.update({
    where: { id },
    data: {
      status: parsed.data.status,
      publishedAt: publishedAtUpdate,
    },
    select: {
      id: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    message: "포스트 상태가 변경되었습니다.",
    post: updated,
  })
}
