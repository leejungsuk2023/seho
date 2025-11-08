import Link from 'next/link'

import { getBlogsWithStats } from '@/lib/blogs'
import { searchPublishedPosts } from '@/lib/posts'
import { getBlogTheme } from '@/lib/constants/blogThemes'
import { PostCard } from '@/components/post/PostCard'

type SearchPageProps = {
  searchParams: {
    q?: string
    blog?: string
    page?: string
  }
}

export const revalidate = 30

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? ''
  const blogFilter = searchParams.blog?.trim() ?? ''
  const page = Number(searchParams.page ?? '1')

  const [blogs, searchResult] = await Promise.all([
    getBlogsWithStats(),
    query
      ? searchPublishedPosts({
          query,
          blogSlug: blogFilter || undefined,
          page,
        })
      : Promise.resolve({
          posts: [],
          pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
        }),
  ])

  const buildQuery = (params: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams()
    if (params.q) urlParams.set('q', params.q)
    if (params.blog) urlParams.set('blog', params.blog)
    if (params.page) urlParams.set('page', params.page)
    return urlParams.toString()
  }

  const showResults = query.length > 0

  return (
    <main className="py-16">
      <div className="flex flex-col gap-12">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
            원하는 이야기를 찾아보세요
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            키워드 하나만으로 세 공간의 글을 탐색할 수 있습니다. 블로그 필터를 적용해 더
            정교한 결과를 만들어 보세요.
          </p>
        </header>

        <form className="space-y-4 rounded-[2rem] border border-base-200 bg-surface p-8 shadow-card">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-2 text-left">
              <label htmlFor="search_query" className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
                검색어
              </label>
              <input
                id="search_query"
                name="q"
                defaultValue={query}
                placeholder="예: 재무, 브랜드, 일상..."
                className="w-full rounded-full border border-base-200 bg-white px-5 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-base-300"
              />
            </div>
            <div className="space-y-2 text-left">
              <label htmlFor="search_blog" className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">
                블로그
              </label>
              <select
                id="search_blog"
                name="blog"
                defaultValue={blogFilter}
                className="w-full rounded-full border border-base-200 bg-white px-5 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-base-300"
              >
                <option value="">전체</option>
                {blogs.map((blog) => (
                  <option key={blog.id} value={blog.slug}>
                    {blog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-text px-6 py-3 text-sm font-semibold text-text-inverted transition hover:bg-text/90"
            >
              검색
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </form>

        {!showResults ? (
          <div className="rounded-[2rem] border border-dashed border-base-200 bg-surface px-10 py-16 text-center text-sm text-text-muted">
            검색어를 입력하면 결과가 여기에 표시됩니다.
          </div>
        ) : searchResult.posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-base-200 bg-surface px-10 py-16 text-center">
            <h2 className="text-xl font-semibold text-text">검색 결과가 없습니다.</h2>
            <p className="mt-2 text-text-muted">
              다른 키워드로 다시 검색하거나 블로그 필터를 조정해보세요.
            </p>
          </div>
        ) : (
          <section className="space-y-6">
            <p className="text-sm text-text-muted">
              총 {searchResult.pagination.total.toLocaleString()}개의 결과
            </p>
            <div className="grid gap-6">
              {searchResult.posts.map((post: any) => {
                const blog = post.blog as { slug: string; name: string }
                const theme = getBlogTheme(blog.slug)
                return (
                  <PostCard
                    key={post.id}
                    blogSlug={blog.slug}
                    blogName={theme.displayName}
                    accentColor={theme.accent}
                    accentSoftColor={theme.accentSoft}
                    post={{
                      id: post.id,
                      title: post.title,
                      slug: post.slug,
                      excerpt: post.excerpt,
                      publishedAt: post.publishedAt,
                      createdAt: post.createdAt,
                      status: 'PUBLISHED',
                      author: post.author,
                      category: post.category,
                      tags: post.tags,
                    }}
                  />
                )
              })}
            </div>
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                페이지 {searchResult.pagination.page} / {searchResult.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <PaginationButton
                  href={`/search?${buildQuery({
                    q: query,
                    blog: blogFilter || undefined,
                    page: String(Math.max(searchResult.pagination.page - 1, 1)),
                  })}`}
                  disabled={searchResult.pagination.page <= 1}
                >
                  이전
                </PaginationButton>
                <PaginationButton
                  href={`/search?${buildQuery({
                    q: query,
                    blog: blogFilter || undefined,
                    page: String(
                      Math.min(
                        searchResult.pagination.page + 1,
                        searchResult.pagination.totalPages,
                      ),
                    ),
                  })}`}
                  disabled={searchResult.pagination.page >= searchResult.pagination.totalPages}
                >
                  다음
                </PaginationButton>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
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
