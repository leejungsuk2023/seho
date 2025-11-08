import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { getBlogBySlug } from '@/lib/blogs'
import { canWriteToBlog } from '@/lib/auth/permissions'

import { PostEditor } from './_components/PostEditor'

type WritePageProps = {
  params: { slug: string }
}

export default async function BlogWritePage({ params }: WritePageProps) {
  const { slug } = await params
  const session = await auth()

  if (!session?.user) {
    notFound()
  }

  if (!canWriteToBlog(session.user, slug)) {
    notFound()
  }

  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <header>
          <p className="text-sm text-muted-foreground">포스트 작성 · {blog.name}</p>
          <h1 className="mt-2 text-3xl font-bold">새 포스트 작성</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            WRITER 이상의 권한을 가진 사용자는 포스트를 작성하고 발행할 수 있습니다.
          </p>
        </header>

        <PostEditor
          blogSlug={blog.slug}
          categories={blog.categories}
          defaultAuthorName={session.user.name ?? session.user.id}
        />
      </div>
    </div>
  )
}
