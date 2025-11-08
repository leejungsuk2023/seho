import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"
import { generateCategorySlug } from "@/lib/posts/helpers"

const searchSchema = z.object({
  blogId: z.string().min(1, { message: "blogId는 필수입니다." }),
})

const createSchema = z.object({
  blogId: z.string().min(1, { message: "blogId는 필수입니다." }),
  name: z
    .string()
    .trim()
    .min(1, { message: "카테고리 이름을 입력해주세요." })
    .max(40, { message: "카테고리 이름은 최대 40자까지 입력할 수 있습니다." }),
})

export async function GET(request: Request) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const query = Object.fromEntries(new URL(request.url).searchParams)
  const parsed = searchSchema.safeParse(query)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "쿼리 파라미터를 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const categories = await prisma.category.findMany({
    where: { blogId: parsed.data.blogId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      blogId: true,
    },
  })

  return NextResponse.json({ data: categories })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = createSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "입력 값을 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { blogId, name } = parsed.data

  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { id: true },
  })

  if (!blog) {
    return NextResponse.json(
      {
        message: "블로그를 찾을 수 없습니다.",
      },
      { status: 404 },
    )
  }

  let baseSlug = generateCategorySlug(name)
  if (!baseSlug) {
    baseSlug = `category-${Date.now()}`
  }
  let slug = baseSlug
  let suffix = 1
  while (
    await prisma.category.findUnique({
      where: {
        blogId_slug: {
          blogId,
          slug,
        },
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix++}`
  }

  const created = await prisma.category.create({
    data: {
      blogId,
      name,
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      blogId: true,
    },
  })

  return NextResponse.json(
    {
      message: "카테고리가 생성되었습니다.",
      category: created,
    },
    { status: 201 },
  )
}
