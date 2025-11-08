import { NextResponse } from "next/server"
import { CommentStatus } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"

const bodySchema = z.object({
  status: z.nativeEnum(CommentStatus, {
    message: "지원하지 않는 상태입니다.",
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
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
    },
  })

  if (!existing) {
    return new NextResponse("댓글을 찾을 수 없습니다.", { status: 404 })
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: {
      status: parsed.data.status,
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    message: "댓글 상태가 변경되었습니다.",
    comment: updated,
  })
}
