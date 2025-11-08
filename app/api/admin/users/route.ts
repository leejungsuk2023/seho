import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  role: z.nativeEnum(UserRole).optional(),
  q: z.string().trim().optional(),
})

export async function GET(request: Request) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams))

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "쿼리 파라미터를 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { page, limit, role, q } = parsed.data

  const where = {
    ...(role ? { role } : {}),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { nickname: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    }),
  ])

  return NextResponse.json({
    data: users.map((user) => ({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postCount: user._count.posts,
      commentCount: user._count.comments,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
