import { NextResponse } from "next/server"
import { z } from "zod"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getCommentsForPost } from "@/lib/comments"

const getSchema = z.object({
  postId: z.string().min(1, { message: "postId는 필수입니다." }),
})

const createSchema = z.object({
  postId: z.string().min(1, { message: "postId는 필수입니다." }),
  content: z
    .string()
    .min(1, { message: "댓글을 입력해주세요." })
    .max(500, { message: "댓글은 최대 500자까지 입력할 수 있습니다." }),
  parentId: z.string().optional().nullable(),
})

export async function GET(request: Request) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams)
  const parsed = getSchema.safeParse(searchParams)

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "쿼리 파라미터를 확인해주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const comments = await getCommentsForPost(parsed.data.postId)

  return NextResponse.json({
    data: comments,
  })
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

  const { postId, content, parentId } = parsed.data

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, status: true },
  })

  if (!post || post.status !== "PUBLISHED") {
    return NextResponse.json(
      {
        message: "댓글을 작성할 수 없는 포스트입니다.",
      },
      { status: 400 },
    )
  }

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { id: true, postId: true, status: true },
    })

    if (!parent || parent.postId !== postId || parent.status !== "VISIBLE") {
      return NextResponse.json(
        { message: "유효하지 않은 부모 댓글입니다." },
        { status: 400 },
      )
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      content,
      parentId: parentId ?? null,
      authorId: session.user.id,
      status: "VISIBLE",
    },
    select: {
      id: true,
      content: true,
      postId: true,
      parentId: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
    },
  })

  return NextResponse.json(
    {
      message: "댓글이 작성되었습니다.",
      comment,
    },
    { status: 201 },
  )
}
