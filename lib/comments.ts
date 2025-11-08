import { cache } from "react"

import { prisma } from "@/lib/prisma"

export type CommentWithAuthor = {
  id: string
  content: string
  authorId: string
  postId: string
  parentId: string | null
  status: "VISIBLE" | "HIDDEN"
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    nickname: string
    profileImageUrl: string | null
  }
}

export const getCommentsForPost = cache(async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      status: "VISIBLE",
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      content: true,
      authorId: true,
      postId: true,
      parentId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
    },
  })

  return comments
})

export const countCommentsForPost = cache(async (postId: string) => {
  return prisma.comment.count({
    where: {
      postId,
      status: "VISIBLE",
    },
  })
})
