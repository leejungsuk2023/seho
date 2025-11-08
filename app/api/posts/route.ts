import { NextResponse } from "next/server"
import { PostStatus } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getPostListForBlog } from "@/lib/posts"
import { canWriteToBlog } from "@/lib/auth/permissions"
import { createExcerpt, generatePostSlug, generateTagSlug } from "@/lib/posts/helpers"

const querySchema = z.object({
  blogSlug: z.string().min(1, { message: "blogSlug는 필수입니다." }),
  category: z.string().nullish(),
  tag: z.string().nullish(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(20).optional(),
  includeDrafts: z.coerce.boolean().optional(),
})

const createSchema = z.object({
  blogSlug: z.string().min(1, { message: "blogSlug는 필수입니다." }),
  title: z.string().min(2, { message: "제목은 최소 2자 이상이어야 합니다." }),
  content: z.string().min(1, { message: "본문을 입력해주세요." }),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  categoryId: z.string().trim().optional().or(z.literal('').transform(() => undefined)),
  tagNames: z
    .array(z.string().trim().min(1))
    .max(10, { message: "태그는 최대 10개까지 추가할 수 있습니다." })
    .optional(),
})

export async function GET(request: Request) {
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

  const { blogSlug, category, tag, page, pageSize, includeDrafts } = parsed.data

  const result = await getPostListForBlog({
    blogSlug,
    categorySlug: category ?? undefined,
    tagSlug: tag ?? undefined,
    page,
    pageSize,
    includeDrafts: includeDrafts ?? false,
  })

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("인증이 필요합니다.", { status: 401 })
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

  const { blogSlug, title, content, status, categoryId, tagNames } = parsed.data

  if (!canWriteToBlog(session.user, blogSlug)) {
    return new NextResponse("해당 블로그에 글을 작성할 권한이 없습니다.", {
      status: 403,
    })
  }

  const blog = await prisma.blog.findUnique({
    where: { slug: blogSlug },
    select: { id: true },
  })

  if (!blog) {
    return new NextResponse("블로그를 찾을 수 없습니다.", { status: 404 })
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { blogId: true },
    })
    if (!category || category.blogId !== blog.id) {
      return NextResponse.json(
        { message: "유효하지 않은 카테고리입니다." },
        { status: 400 },
      )
    }
  }

  const baseSlug = generatePostSlug(title)
  let slug = baseSlug
  let suffix = 1
  // Ensure slug uniqueness per blog
  while (
    await prisma.post.findFirst({
      where: {
        blogId: blog.id,
        slug,
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix++}`
  }

  const excerpt = createExcerpt(content)
  const publishedAt = status === PostStatus.PUBLISHED ? new Date() : null

  const normalizedTags =
    tagNames
      ?.map((name) => ({
        name,
        slug: generateTagSlug(name),
      }))
      .filter((tag) => tag.slug.length > 0) ?? []

  const post = await prisma.post.create({
    data: {
      blogId: blog.id,
      authorId: session.user.id,
      title,
      slug,
      content,
      excerpt,
      status,
      categoryId: categoryId ?? undefined,
      publishedAt,
      tags:
        normalizedTags.length > 0
          ? {
              create: normalizedTags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { slug: tag.slug },
                    create: {
                      name: tag.name,
                      slug: tag.slug,
                    },
                  },
                },
              })),
            }
          : undefined,
    },
    select: {
      id: true,
      slug: true,
      status: true,
    },
  })

  return NextResponse.json(
    {
      message: "포스트가 작성되었습니다.",
      post,
    },
    { status: 201 },
  )
}
