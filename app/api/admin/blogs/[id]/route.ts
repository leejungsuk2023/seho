import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { canManageUsers } from "@/lib/auth/permissions"

const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "블로그 이름은 최소 1자 이상이어야 합니다." })
    .max(100, { message: "블로그 이름은 최대 100자까지 입력할 수 있습니다." })
    .optional(),
  description: z
    .string()
    .trim()
    .max(300, { message: "설명은 최대 300자까지 입력할 수 있습니다." })
    .optional(),
  coverImageUrl: urlNullableSchema(),
  logoImageUrl: urlNullableSchema(),
  thumbnailUrl: urlNullableSchema(),
  primaryColor: optionalString(32),
  headingFont: optionalString(64),
  bodyFont: optionalString(64),
  layoutStyle: optionalString(32),
  sidebarPosition: optionalString(32),
  visibility: z.boolean().optional(),
})

function optionalString(max: number) {
  return z
    .string()
    .trim()
    .max(max, { message: `최대 ${max}자까지 입력할 수 있습니다.` })
    .optional()
}

function urlNullableSchema() {
  return z
    .string()
    .trim()
    .url({ message: "올바른 URL을 입력해주세요." })
    .optional()
    .or(z.literal("").transform(() => null))
    .or(z.null())
}

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

  const data = parsed.data
  const { id } = await params

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      ...data,
      description: data.description ?? null,
      coverImageUrl:
        data.coverImageUrl === undefined ? undefined : data.coverImageUrl,
      logoImageUrl:
        data.logoImageUrl === undefined ? undefined : data.logoImageUrl,
      thumbnailUrl:
        data.thumbnailUrl === undefined ? undefined : data.thumbnailUrl,
      primaryColor:
        data.primaryColor === undefined ? undefined : data.primaryColor || null,
      headingFont:
        data.headingFont === undefined ? undefined : data.headingFont || null,
      bodyFont: data.bodyFont === undefined ? undefined : data.bodyFont || null,
      layoutStyle:
        data.layoutStyle === undefined ? undefined : data.layoutStyle || null,
      sidebarPosition:
        data.sidebarPosition === undefined
          ? undefined
          : data.sidebarPosition || null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      thumbnailUrl: true,
      coverImageUrl: true,
      logoImageUrl: true,
      primaryColor: true,
      visibility: true,
      headingFont: true,
      bodyFont: true,
      layoutStyle: true,
      sidebarPosition: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    message: "블로그 설정이 업데이트되었습니다.",
    blog: updated,
  })
}
