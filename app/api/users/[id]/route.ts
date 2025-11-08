import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"

const updateSchema = z
  .object({
    nickname: z
      .string()
      .min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
      .max(20, { message: "닉네임은 최대 20자까지 가능합니다." })
      .optional(),
    profileImageUrl: z
      .string()
      .url({ message: "올바른 URL 형식이 아닙니다." })
      .optional()
      .or(z.literal("").transform(() => null))
      .or(z.null())
      .optional(),
    bio: z
      .string()
      .max(280, { message: "자기소개는 최대 280자까지 가능합니다." })
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "변경할 값을 최소 한 가지 이상 입력해주세요.",
    },
  )

const userSelect = {
  id: true,
  email: true,
  nickname: true,
  profileImageUrl: true,
  bio: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Parameters<typeof prisma.user.findUnique>[0]["select"]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse("인증이 필요합니다.", { status: 401 })
  }

  const { id } = await params
  if (session.user.id !== id && !canManageUsers(session.user)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  })

  if (!user) {
    return new NextResponse("사용자를 찾을 수 없습니다.", { status: 404 })
  }

  return NextResponse.json(user)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!session?.user) {
    return new NextResponse("인증이 필요합니다.", { status: 401 })
  }

  const { id } = await params
  if (session.user.id !== id && !canManageUsers(session.user)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
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

  const { nickname, profileImageUrl, bio } = parsed.data

  if (nickname) {
    const duplicateNickname = await prisma.user.findFirst({
      where: {
        nickname,
        NOT: { id },
      },
      select: { id: true },
    })

    if (duplicateNickname) {
      return NextResponse.json(
        {
          message: "닉네임이 이미 사용 중입니다.",
        },
        { status: 409 },
      )
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      nickname: nickname ?? undefined,
      profileImageUrl:
        profileImageUrl === undefined ? undefined : profileImageUrl,
      bio: bio ?? undefined,
    },
    select: userSelect,
  })

  return NextResponse.json(updated)
}
