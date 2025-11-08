import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const updateSchema = z.object({
  content: z
    .string()
    .min(1, { message: "댓글을 입력해주세요." })
    .max(500, { message: "댓글은 최대 500자까지 입력할 수 있습니다." }),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse("인증이 필요합니다.", { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)

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
      authorId: true,
      status: true,
    },
  })

  if (!existing || existing.status !== "VISIBLE") {
    return new NextResponse("댓글을 찾을 수 없습니다.", { status: 404 })
  }

  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return new NextResponse("댓글을 수정할 권한이 없습니다.", { status: 403 })
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: {
      content: parsed.data.content,
    },
    select: {
      id: true,
      content: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    message: "댓글이 수정되었습니다.",
    comment: updated,
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse("인증이 필요합니다.", { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
      authorId: true,
      status: true,
    },
  })

  if (!existing || existing.status !== "VISIBLE") {
    return new NextResponse("댓글을 찾을 수 없습니다.", { status: 404 })
  }

  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return new NextResponse("댓글을 삭제할 권한이 없습니다.", { status: 403 })
  }

  await prisma.comment.delete({
    where: { id },
  })

  return NextResponse.json({
    message: "댓글이 삭제되었습니다.",
  })
}
