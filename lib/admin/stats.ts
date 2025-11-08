import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export type AdminStats = {
  totalUsers: number
  publishedPosts: number
  commentsLast24h: number
  hiddenPosts: number
  hiddenComments: number
  hiddenItems: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const [totalUsers, publishedPosts, commentsLast24h, hiddenPosts, hiddenComments] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      prisma.comment.count({
        where: {
          status: "VISIBLE",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.post.count({
        where: {
          status: {
            not: "PUBLISHED",
          },
        },
      }),
      prisma.comment.count({
        where: {
          status: "HIDDEN",
        },
      }),
    ])

  return {
    totalUsers,
    publishedPosts,
    commentsLast24h,
    hiddenPosts,
    hiddenComments,
    hiddenItems: hiddenPosts + hiddenComments,
  }
}

export async function getRecentPosts(limit = 10) {
  return prisma.post.findMany({
    take: limit,
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      blog: {
        select: {
          slug: true,
          name: true,
        },
      },
      author: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  })
}

export async function getRecentComments(limit = 10) {
  return prisma.comment.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      content: true,
      status: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          nickname: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
          blog: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  })
}

type PostListOptions = {
  page?: number
  pageSize?: number
  blogSlug?: string
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED"
  query?: string
}

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 50

function sanitizePagination(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const normalizedPageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.min(Math.floor(pageSize), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE

  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
  }
}

export async function getAdminPostList(options: PostListOptions) {
  const { page, pageSize } = sanitizePagination(options.page, options.pageSize)

  const where: Prisma.PostWhereInput = {
    ...(options.blogSlug
      ? {
          blog: {
            slug: options.blogSlug,
          },
        }
      : {}),
    ...(options.status ? { status: options.status } : {}),
    ...(options.query
      ? {
          OR: [
            { title: { contains: options.query, mode: "insensitive" } },
            { content: { contains: options.query, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        publishedAt: true,
        blog: {
          select: {
            slug: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
  ])

  return {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
    posts,
  }
}

type CommentListOptions = {
  page?: number
  pageSize?: number
  status?: "VISIBLE" | "HIDDEN"
  query?: string
}

export async function getAdminCommentList(options: CommentListOptions) {
  const { page, pageSize } = sanitizePagination(options.page, options.pageSize)

  const where: Prisma.CommentWhereInput = {
    ...(options.status ? { status: options.status } : {}),
    ...(options.query
      ? {
          content: {
            contains: options.query,
            mode: "insensitive",
          },
        }
      : {}),
  }

  const [total, comments] = await prisma.$transaction([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        content: true,
        status: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            blog: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    }),
  ])

  return {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
    comments,
  }
}
