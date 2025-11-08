'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/common/Button'

type AdminComment = {
  id: string
  content: string
  status: 'VISIBLE' | 'HIDDEN'
  createdAt: Date | string
  author: {
    id: string
    nickname: string
  }
  post: {
    id: string
    title: string
    slug: string
    blog: {
      slug: string
    }
  }
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type CommentFilters = {
  page: number
  status: string
  query: string
}

export function AdminCommentsTable({
  comments,
  pagination,
  initialFilters,
}: {
  comments: AdminComment[]
  pagination: Pagination
  initialFilters: CommentFilters
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState(initialFilters)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const updateSearchParams = (next: Partial<CommentFilters>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next.page !== undefined) params.set('page', String(next.page))
    if (next.status !== undefined)
      next.status ? params.set('status', next.status) : params.delete('status')
    if (next.query !== undefined)
      next.query ? params.set('q', next.query) : params.delete('q')
    router.push(`/admin/comments?${params.toString()}`)
  }

  const handleFilterSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateSearchParams({
      page: 1,
      status: filters.status,
      query: filters.query,
    })
  }

  const handleReset = () => {
    setFilters({
      page: 1,
      status: '',
      query: '',
    })
    router.push('/admin/comments')
  }

  const handleStatusChange = (commentId: string, status: 'VISIBLE' | 'HIDDEN') => {
    setPendingId(commentId)
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/comments/${commentId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '댓글 상태 변경에 실패했습니다.')
        }
        router.refresh()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '댓글 상태 변경 중 오류가 발생했습니다.',
        )
      } finally {
        setPendingId(null)
      }
    })
  }

  const handleDelete = (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    setPendingId(commentId)
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '댓글 삭제에 실패했습니다.')
        }
        router.refresh()
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.',
        )
      } finally {
        setPendingId(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-end"
      >
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium">검색어</label>
          <input
            value={filters.query}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, query: event.target.value }))
            }
            placeholder="댓글 내용"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="w-full space-y-2 md:w-48">
          <label className="text-xs font-medium">상태</label>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value }))
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">전체</option>
            <option value="VISIBLE">VISIBLE</option>
            <option value="HIDDEN">HIDDEN</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm">
            필터 적용
          </Button>
          {(initialFilters.query || initialFilters.status) && (
            <Button type="button" size="sm" variant="outline" onClick={handleReset}>
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
              <th className="px-4 py-3 font-medium">내용</th>
              <th className="px-4 py-3 font-medium">작성자</th>
              <th className="px-4 py-3 font-medium">포스트</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">작성일</th>
              <th className="px-4 py-3 font-medium text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  조건에 맞는 댓글이 없습니다.
                </td>
              </tr>
            ) : (
              comments.map((comment) => {
                const createdAt = new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <tr key={comment.id} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 text-sm text-foreground">{comment.content}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {comment.author.nickname}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link
                        href={`/blogs/${comment.post.blog.slug}/post/${comment.post.slug}`}
                        className="font-medium text-primary hover:text-primary/80"
                      >
                        {comment.post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          comment.status === 'VISIBLE'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {comment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending && pendingId === comment.id}
                          onClick={() =>
                            handleStatusChange(
                              comment.id,
                              comment.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE',
                            )
                          }
                        >
                          {isPending && pendingId === comment.id
                            ? '처리 중…'
                            : comment.status === 'VISIBLE'
                            ? '숨김'
                            : '공개'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isPending && pendingId === comment.id}
                          onClick={() => handleDelete(comment.id)}
                        >
                          {isPending && pendingId === comment.id ? '삭제 중…' : '삭제'}
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
