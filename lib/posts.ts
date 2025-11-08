import { cache } from "react"
import type { UserRole } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type PostListOptions = {
  blogSlug: string
  page?: number
  pageSize?: number
  categorySlug?: string
  tagSlug?: string
  includeDrafts?: boolean
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 20

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

export const getPostListForBlog = cache(async (options: PostListOptions) => {
  const { page, pageSize } = sanitizePagination(options.page, options.pageSize)
  const where = {
    blog: {
      slug: options.blogSlug,
      visibility: true,
    },
    ...(options.includeDrafts
      ? {}
      : {
          status: "PUBLISHED" as const,
        }),
    ...(options.categorySlug
      ? {
          category: {
            slug: options.categorySlug,
          },
        }
      : {}),
    ...(options.tagSlug
      ? {
          tags: {
            some: {
              tag: {
                slug: options.tagSlug,
              },
            },
          },
        }
      : {}),
  }

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        createdAt: true,
        status: true,
        author: {
          select: {
            id: true,
            nickname: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
    posts: posts.map((post) => ({
      ...post,
      tags: post.tags.map((pair) => pair.tag),
    })),
  }
})

type PostDetailOptions = {
  blogSlug: string
  postSlug: string
  viewerRole?: UserRole
  viewerId?: string
}

export const getPostBySlug = cache(async (options: PostDetailOptions) => {
  const post = await prisma.post.findFirst({
    where: {
      slug: options.postSlug,
      blog: {
        slug: options.blogSlug,
        visibility: true,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      isFeatured: true,
      authorId: true,
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    } as const,
  })

  if (!post) {
    return null
  }

  const isViewerAuthor = options.viewerId === post.authorId
  const isPublished = post.status === "PUBLISHED"

  if (!isPublished && !(isViewerAuthor || options.viewerRole === "ADMIN")) {
    return null
  }

  const related = await prisma.post.findMany({
    where: {
      blog: {
        slug: options.blogSlug,
      },
      status: "PUBLISHED",
      id: {
        not: post.id,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },
  })

  return {
    ...post,
    tags: post.tags.map((pair) => pair.tag),
    relatedPosts: related,
  }
})

export const getLatestPosts = cache(async (limit = 12) => {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      blog: {
        visibility: true,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
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
      excerpt: true,
    },
  })

  return posts
})

type SearchOptions = {
  query: string
  blogSlug?: string
  page?: number
  pageSize?: number
}

export const searchPublishedPosts = cache(async (options: SearchOptions) => {
  const searchTerm = options.query.trim()
  if (searchTerm.length === 0) {
    return {
      pagination: {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
      posts: [],
    }
  }

  const { page, pageSize } = sanitizePagination(options.page, options.pageSize)
  const where = {
    status: "PUBLISHED" as const,
    blog: {
      visibility: true,
      ...(options.blogSlug ? { slug: options.blogSlug } : {}),
    },
    OR: [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { excerpt: { contains: searchTerm, mode: "insensitive" } },
      { content: { contains: searchTerm, mode: "insensitive" } },
    ],
  }

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
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
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
    posts: posts.map((post) => ({
      ...post,
      tags: post.tags.map((pair) => pair.tag),
    })),
  }
})
