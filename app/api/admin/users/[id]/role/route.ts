import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers, isAdmin } from "@/lib/auth/permissions"

const bodySchema = z.object({
  role: z.nativeEnum(UserRole, {
    message: "지원하지 않는 역할입니다.",
  }),
  reason: z
    .string()
    .max(200, { message: "변경 사유는 200자 이하여야 합니다." })
    .optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  const actingUser = session?.user

  if (!canManageUsers(actingUser)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  // canManageUsers passed, so actingUser is not null
  if (!actingUser) {
    return new NextResponse("인증이 필요합니다.", { status: 401 })
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

  const { role, reason } = parsed.data
  const { id } = await params

  if (actingUser.id === id && role !== actingUser.role) {
    return NextResponse.json(
      {
        message: "자기 자신의 역할을 변경할 수 없습니다.",
      },
      { status: 400 },
    )
  }

  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
    },
  })

  if (!targetUser) {
    return new NextResponse("사용자를 찾을 수 없습니다.", { status: 404 })
  }

  if (targetUser.role === role) {
    return NextResponse.json(
      {
        message: "이미 동일한 역할입니다.",
      },
      { status: 400 },
    )
  }

  if (isAdmin(targetUser) && !isAdmin(actingUser)) {
    return NextResponse.json(
      {
        message: "ADMIN 역할은 ADMIN만 변경할 수 있습니다.",
      },
      { status: 403 },
    )
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      role,
      roleChanges: {
        create: {
          role,
          changedById: actingUser.id,
          reason,
        },
      },
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    message: "역할이 변경되었습니다.",
    user: updated,
  })
}
