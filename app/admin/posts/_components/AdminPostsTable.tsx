'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/common/Button'

type AdminPost = {
  id: string
  title: string
  slug: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  createdAt: Date | string
  publishedAt: Date | string | null
  blog: {
    slug: string
    name: string
  }
  author: {
    id: string
    nickname: string
  }
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type AdminPostFilters = {
  page: number
  status: string
  blog: string
  query: string
}

type BlogOption = {
  id: string
  slug: string
  name: string
}

export function AdminPostsTable({
  posts,
  pagination,
  blogs,
  initialFilters,
}: {
  posts: AdminPost[]
  pagination: Pagination
  blogs: BlogOption[]
  initialFilters: AdminPostFilters
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState(initialFilters)
  const [pendingPostId, setPendingPostId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const appliedFilters = useMemo(
    () => ({
      page: parseInt(searchParams.get('page') ?? '1', 10),
      status: searchParams.get('status') ?? '',
      blog: searchParams.get('blog') ?? '',
      query: searchParams.get('q') ?? '',
    }),
    [searchParams],
  )

  const updateSearchParams = (next: Partial<AdminPostFilters>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next.page !== undefined) params.set('page', String(next.page))
    if (next.status !== undefined)
      next.status ? params.set('status', next.status) : params.delete('status')
    if (next.blog !== undefined)
      next.blog ? params.set('blog', next.blog) : params.delete('blog')
    if (next.query !== undefined)
      next.query ? params.set('q', next.query) : params.delete('q')
    router.push(`/admin/posts?${params.toString()}`)
  }

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateSearchParams({
      page: 1,
      status: filters.status,
      blog: filters.blog,
      query: filters.query,
    })
  }

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      status: '',
      blog: '',
      query: '',
    })
    router.push('/admin/posts')
  }

  const handleStatusChange = (postId: string, nextStatus: 'PUBLISHED' | 'ARCHIVED') => {
    setPendingPostId(postId)
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus }),
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '포스트 상태 변경에 실패했습니다.')
        }
        router.refresh()
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '포스트 상태 변경 중 오류가 발생했습니다.',
        )
      } finally {
        setPendingPostId(null)
      }
    })
  }

  const handleDelete = (postId: string) => {
    if (!window.confirm('포스트를 영구 삭제하시겠습니까?')) return
    setPendingPostId(postId)
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '포스트 삭제에 실패했습니다.')
        }
        router.refresh()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '포스트 삭제 중 오류가 발생했습니다.',
        )
      } finally {
        setPendingPostId(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleFilterSubmit}
        className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-4"
      >
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">검색어</label>
          <input
            value={filters.query}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, query: event.target.value }))
            }
            placeholder="제목 또는 내용"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">상태</label>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value }))
            }
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">전체</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">블로그</label>
          <select
            value={filters.blog}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, blog: event.target.value }))
            }
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">전체</option>
            {blogs.map((blog) => (
              <option key={blog.id} value={blog.slug}>
                {blog.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" size="sm">
            필터 적용
          </Button>
          {(appliedFilters.query || appliedFilters.status || appliedFilters.blog) && (
            <Button type="button" size="sm" variant="outline" onClick={handleResetFilters}>
              초기화
            </Button>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">제목</th>
              <th className="px-4 py-3 font-medium">블로그</th>
              <th className="px-4 py-3 font-medium">작성자</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">작성일</th>
              <th className="px-4 py-3 font-medium text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  조건에 맞는 포스트가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const created = new Date(post.createdAt)
                const formatted = created.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <tr key={post.id} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/blogs/${post.blog.slug}/post/${post.slug}`}
                        className="font-medium text-primary hover:text-primary/80"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{post.blog.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{post.author.nickname}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : post.status === 'DRAFT'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatted}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {post.status === 'PUBLISHED' ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isPending && pendingPostId === post.id}
                            onClick={() => handleStatusChange(post.id, 'ARCHIVED')}
                          >
                            {isPending && pendingPostId === post.id ? '처리 중…' : '숨김'}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isPending && pendingPostId === post.id}
                            onClick={() => handleStatusChange(post.id, 'PUBLISHED')}
                          >
                            {isPending && pendingPostId === post.id ? '처리 중…' : '공개'}
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending && pendingPostId === post.id}
                          onClick={() => handleDelete(post.id)}
                        >
                          {isPending && pendingPostId === post.id ? '삭제 중…' : '삭제'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          총 {pagination.total}개 · 페이지 {pagination.page}/{pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <PaginationButton
            disabled={pagination.page <= 1}
            onClick={() =>
              updateSearchParams({
                page: Math.max(pagination.page - 1, 1),
              })
            }
          >
            이전
          </PaginationButton>
          <PaginationButton
            disabled={pagination.page >= pagination.totalPages}
            onClick={() =>
              updateSearchParams({
                page: Math.min(pagination.page + 1, pagination.totalPages),
              })
            }
          >
            다음
          </PaginationButton>
        </div>
      </div>
    </div>
  )
}

function PaginationButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border border-border px-3 py-1 text-sm transition ${
        disabled
          ? 'cursor-not-allowed text-muted-foreground'
          : 'hover:border-primary/60 hover:text-primary'
      }`}
    >
      {children}
    </button>
  )
}
