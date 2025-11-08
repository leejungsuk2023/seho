import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"
import { generateCategorySlug } from "@/lib/posts/helpers"

const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "카테고리 이름을 입력해주세요." })
    .max(40, { message: "카테고리 이름은 최대 40자까지 입력할 수 있습니다." }),
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
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      blogId: true,
    },
  })

  if (!category) {
    return new NextResponse("카테고리를 찾을 수 없습니다.", { status: 404 })
  }

  const baseSlug = generateCategorySlug(parsed.data.name) || `category-${Date.now()}`
  let slug = baseSlug
  let suffix = 1
  while (
    await prisma.category.findUnique({
      where: {
        blogId_slug: {
          blogId: category.blogId,
          slug,
        },
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix++}`
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      blogId: true,
    },
  })

  return NextResponse.json({
    message: "카테고리가 수정되었습니다.",
    category: updated,
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!category) {
    return new NextResponse("카테고리를 찾을 수 없습니다.", { status: 404 })
  }

  // TODO: 향후 포스트가 카테고리에 연결되어 있을 때 정책 결정 (현재는 허용)
  await prisma.category.delete({
    where: { id },
  })

  return NextResponse.json({
    message: "카테고리가 삭제되었습니다.",
  })
}
