import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { canEditPost } from '@/lib/auth/permissions'

import { PostEditor } from '../../write/_components/PostEditor'

type EditPageProps = {
  params: {
    slug: string
    postId: string
  }
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { slug, postId } = await params
  const session = await auth()

  if (!session?.user) {
    notFound()
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      authorId: true,
      blog: {
        select: {
          id: true,
          slug: true,
          name: true,
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
            orderBy: {
              name: 'asc',
            },
          },
        },
      },
      categoryId: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!post || post.blog.slug !== slug) {
    notFound()
  }

  if (!canEditPost(session.user, post.authorId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <header>
          <p className="text-sm text-muted-foreground">
            포스트 수정 · {post.blog.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold">포스트 수정</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            기존 내용을 편집하고 저장하면 최신 내용으로 반영됩니다.
          </p>
        </header>

        <PostEditor
          mode="edit"
          blogSlug={post.blog.slug}
          categories={post.blog.categories}
          defaultAuthorName={session.user.name ?? session.user.id}
          initialPost={{
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
            categoryId: post.categoryId,
            tags: post.tags.map((tag) => tag.tag.name),
          }}
        />
      </div>
    </div>
  )
}
