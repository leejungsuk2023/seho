import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { getBlogBySlug } from '@/lib/blogs'
import { getBlogTheme } from '@/lib/constants/blogThemes'
import { getPostListForBlog } from '@/lib/posts'
import { PostCard } from '@/components/post/PostCard'
import { cn } from '@/lib/utils/cn'
import { canWriteToBlog } from '@/lib/auth/permissions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type BlogPageProps = {
  params: { slug: string }
  searchParams: {
    page?: string
    category?: string
    tag?: string
  }
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const theme = getBlogTheme(blog.slug)
  const session = await auth()
  const canWrite = canWriteToBlog(session?.user ?? null, blog.slug)

  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page ?? '1')
  const category = resolvedSearchParams.category ?? undefined
  const { posts, pagination } = await getPostListForBlog({
    blogSlug: blog.slug,
    page,
    categorySlug: category,
  })

  const buildQuery = (query: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    if (query.category) params.set('category', query.category)
    if (query.page) params.set('page', query.page)
    return params.toString()
  }

  return (
    <main className="space-y-16 pb-24">
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background: blog.coverImageUrl
                ? `url(${blog.coverImageUrl}) center/cover`
                : theme.gradient,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/0" />
        </div>
        <div className="pt-24 pb-20">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 text-white md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 p-2 backdrop-blur">
                <Image
                  src={
                    blog.logoImageUrl ??
                    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={`${blog.name} 로고`}
                  fill
                  className="rounded-2xl object-cover"
                  sizes="96px"
                />
              </div>
              <div className="space-y-4">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  {theme.displayName}
                </span>
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  {blog.name}
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                  {blog.description ?? theme.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm text-white/70 md:items-end">
              {canWrite && (
                <Link
                  href={`/blogs/${blog.slug}/write`}
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-gray-900 shadow-lg ring-2 ring-white/20 transition-all hover:scale-105 hover:shadow-2xl hover:ring-white/40"
                >
                  <svg
                    className="h-5 w-5 transition-transform group-hover:rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-gray-900">글쓰기</span>
                </Link>
              )}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium">
                총 포스트 {pagination.total.toLocaleString()}개
              </div>
              <div className="text-xs uppercase tracking-[0.2em]">
                {theme.tagline}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="space-y-8">
          <div className="space-y-8">
            <nav className="flex flex-wrap items-center gap-2">
              <CategoryChip
                href={`/blogs/${blog.slug}`}
                active={!category}
                accent={theme.accent}
                accentSoft={theme.accentSoft}
              >
                전체
              </CategoryChip>
              {blog.categories.map((item) => (
                <CategoryChip
                  key={item.id}
                  href={`/blogs/${blog.slug}?${buildQuery({
                    category: item.slug,
                  })}`}
                  active={category === item.slug}
                  accent={theme.accent}
                  accentSoft={theme.accentSoft}
                >
                  #{item.name}
                </CategoryChip>
              ))}
            </nav>

            {posts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-base-200 bg-surface px-10 py-16 text-center text-text-muted">
                아직 게시된 포스트가 없습니다. 새로운 글이 발행되면 가장 먼저 이곳에서 확인하실 수 있어요.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    blogSlug={blog.slug}
                    blogName={theme.displayName}
                    accentColor={theme.accent}
                    accentSoftColor={theme.accentSoft}
                    post={{
                      ...post,
                      publishedAt: post.publishedAt ?? post.createdAt,
                    }}
                    showStatus={false}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                페이지 {pagination.page} / {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <PaginationButton
                  href={`/blogs/${blog.slug}?${buildQuery({
                    ...resolvedSearchParams,
                    page: String(Math.max(pagination.page - 1, 1)),
                  })}`}
                  disabled={pagination.page <= 1}
                >
                  이전
                </PaginationButton>
                <PaginationButton
                  href={`/blogs/${blog.slug}?${buildQuery({
                    ...resolvedSearchParams,
                    page: String(Math.min(pagination.page + 1, pagination.totalPages)),
                  })}`}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  다음
                </PaginationButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function CategoryChip({
  href,
  active,
  accent,
  accentSoft,
  children,
}: {
  href: string
  active?: boolean
  accent: string
  accentSoft: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition',
        active
          ? 'text-text-inverted'
          : 'text-text-muted hover:text-text',
      )}
      style={
        active
          ? { backgroundColor: accent }
          : { backgroundColor: accentSoft }
      }
    >
      {children}
    </Link>
  )
}

function PaginationButton({
  href,
  disabled,
  children,
}: {
  href: string
  disabled?: boolean
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-full border border-base-200 px-4 py-2 text-xs text-text-muted">
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className="rounded-full border border-base-200 px-4 py-2 text-xs font-semibold text-text-muted transition hover:border-text hover:text-text"
    >
      {children}
    </Link>
  )
}
