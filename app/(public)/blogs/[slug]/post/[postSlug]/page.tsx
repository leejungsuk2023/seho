import Link from 'next/link'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { getPostBySlug } from '@/lib/posts'
import { getBlogTheme } from '@/lib/constants/blogThemes'
import { MarkdownRenderer } from '@/components/post/MarkdownRenderer'
import { PostOwnerActions } from '@/components/post/PostOwnerActions'
import { canEditPost } from '@/lib/auth/permissions'
import { getCommentsForPost } from '@/lib/comments'
import { CommentsSection } from '@/components/comment/CommentsSection'

type PostDetailPageProps = {
  params: {
    slug: string
    postSlug: string
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug, postSlug } = await params
  const session = await auth()
  const post = await getPostBySlug({
    blogSlug: slug,
    postSlug: postSlug,
    viewerRole: session?.user?.role,
    viewerId: session?.user?.id,
  })

  if (!post) {
    notFound()
  }

  const theme = getBlogTheme(slug)
  const canEdit = session?.user && canEditPost(session.user, post.authorId ?? '')

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '발행 대기'

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const comments = await getCommentsForPost(post.id)

  return (
    <main className="pb-24">
      {/* Header */}
      <header className="border-b border-base-200">
        <div className="px-6 py-8 md:px-10">
          {/* Breadcrumb */}
          <Link
            href={`/blogs/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {theme.displayName}
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight mb-4">
            {post.title}
          </h1>

          {/* Date Info */}
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{publishedDate}</span>
            </div>
            {updatedDate && updatedDate !== publishedDate && (
              <>
                <span>•</span>
                <span>수정: {updatedDate}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="px-6 py-12 md:px-10">
        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content} accentColor={theme.accent} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-base-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-sm px-3 py-1.5 bg-base-100 text-text-muted rounded hover:bg-base-200 transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="mt-8 pt-8 border-t border-base-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
              <span className="text-lg font-semibold text-text-muted">
                {post.author.nickname.substring(0, 1).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-semibold text-text">{post.author.nickname}</div>
              <div className="text-sm text-text-muted">작성자</div>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="mt-8">
            <PostOwnerActions
              postId={post.id}
              editHref={`/blogs/${slug}/edit/${post.id}`}
              redirectAfterDelete={`/blogs/${slug}`}
            />
          </div>
        )}

        {/* Comments */}
        <div className="mt-12">
          <CommentsSection
            postId={post.id}
            initialComments={comments.map((comment) => ({
              ...comment,
              createdAt: comment.createdAt.toISOString(),
              updatedAt: comment.updatedAt.toISOString(),
            }))}
            viewer={
              session?.user
                ? {
                    id: session.user.id,
                    role: session.user.role,
                    name: session.user.name ?? session.user.id,
                  }
                : null
            }
          />
        </div>

        {/* Related Posts */}
        {post.relatedPosts.length > 0 && (
          <section className="mt-12 p-8 rounded-lg border border-base-200 bg-base-50">
            <h2 className="text-xl font-bold text-text mb-4">관련 글</h2>
            <div className="space-y-3">
              {post.relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blogs/${slug}/post/${related.slug}`}
                  className="block p-4 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="font-semibold text-text hover:text-primary-purple transition-colors">
                    {related.title}
                  </div>
                  <div className="text-sm text-text-muted mt-1">
                    {related.publishedAt
                      ? new Date(related.publishedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}
