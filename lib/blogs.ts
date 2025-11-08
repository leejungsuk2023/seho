import { cache } from "react"

import { prisma } from "@/lib/prisma"

export type BlogSummary = {
  id: string
  slug: string
  name: string
  description: string | null
  primaryColor: string | null
  coverImageUrl: string | null
  logoImageUrl: string | null
  postCount: number
}

export const getBlogsWithStats = cache(async (): Promise<BlogSummary[]> => {
  const blogs = await prisma.blog.findMany({
    where: { visibility: true },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      primaryColor: true,
      coverImageUrl: true,
      logoImageUrl: true,
      _count: {
        select: {
          posts: {
            where: {
              status: "PUBLISHED",
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return blogs.map<BlogSummary>((blog) => ({
    ...blog,
    postCount: blog._count.posts,
  }))
})

export const getBlogBySlug = cache(async (slug: string) => {
  return prisma.blog.findUnique({
    where: {
      slug,
      visibility: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      primaryColor: true,
      coverImageUrl: true,
      logoImageUrl: true,
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  })
})

export const getBlogsForAdmin = cache(async () => {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      slug: true,
      name: true,
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
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  })

  return blogs
})
