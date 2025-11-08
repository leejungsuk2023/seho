'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'

type Comment = {
  id: string
  content: string
  authorId: string
  author: {
    id: string
    nickname: string
    profileImageUrl: string | null
  }
  createdAt: string
  updatedAt: string
}

type Viewer = {
  id: string
  role: 'ADMIN' | 'WRITER' | 'USER'
  name: string
} | null

type CommentsSectionProps = {
  postId: string
  initialComments: Comment[]
  viewer: Viewer
}

export function CommentsSection({ postId, initialComments, viewer }: CommentsSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isLoggedIn = !!viewer

  const sortedComments = useMemo(
    () =>
      [...comments].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [comments],
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!isLoggedIn) {
      setError('로그인이 필요합니다.')
      return
    }

    if (content.trim().length === 0) {
      setError('댓글을 입력해주세요.')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId,
            content: content.trim(),
          }),
        })
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message ?? '댓글 작성에 실패했습니다.')
        }

        setComments((prev) => [
          ...prev,
          {
            ...data.comment,
            createdAt: data.comment.createdAt,
            updatedAt: data.comment.updatedAt,
          },
        ])
        setContent('')
      } catch (err) {
        setError(err instanceof Error ? err.message : '댓글 작성 중 오류가 발생했습니다.')
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/comments/${id}`, {
          method: 'DELETE',
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '댓글 삭제에 실패했습니다.')
        }
        setComments((prev) => prev.filter((comment) => comment.id !== id))
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.')
      }
    })
  }

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingId) return
    if (editingContent.trim().length === 0) {
      setError('댓글을 입력해주세요.')
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/comments/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: editingContent.trim(),
          }),
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '댓글 수정에 실패했습니다.')
        }

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingId
              ? { ...comment, content: editingContent.trim(), updatedAt: new Date().toISOString() }
              : comment,
          ),
        )
        setEditingId(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '댓글 수정 중 오류가 발생했습니다.')
      }
    })
  }

  return (
    <section className="space-y-6 rounded-lg border border-border bg-card p-6">
      <header>
        <h2 className="text-xl font-semibold">
          댓글{' '}
          <span className="text-sm font-medium text-muted-foreground">
            {sortedComments.length}
          </span>
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            isLoggedIn ? '댓글을 남겨보세요 (최대 500자)' : '로그인 후 댓글을 작성할 수 있습니다.'
          }
          maxLength={500}
          rows={3}
          disabled={!isLoggedIn || isPending}
          className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{content.length} / 500</span>
          <Button type="submit" size="sm" disabled={!isLoggedIn || isPending}>
            {isPending ? '등록 중…' : '댓글 등록'}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <p className="text-sm text-muted-foreground">첫 번째 댓글을 남겨보세요.</p>
        ) : (
          sortedComments.map((comment) => {
            const isAuthor = viewer?.id === comment.authorId
            const canModerate = viewer?.role === 'ADMIN'
            const isEditing = editingId === comment.id
            return (
              <div
                key={comment.id}
                className="rounded-lg border border-border/60 bg-background px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-foreground">{comment.author.nickname}</div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(comment.updatedAt ?? comment.createdAt)}
                  </span>
                </div>
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="mt-3 space-y-2">
                    <textarea
                      value={editingContent}
                      onChange={(event) => setEditingContent(event.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={isPending}>
                        {isPending ? '저장 중…' : '저장'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        취소
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="mt-2 text-foreground">{comment.content}</p>
                )}
                {(isAuthor || canModerate) && !isEditing && (
                  <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                    {isAuthor && (
                      <button
                        type="button"
                        className="font-medium hover:text-primary"
                        onClick={() => {
                          setEditingId(comment.id)
                          setEditingContent(comment.content)
                        }}
                        disabled={isPending}
                      >
                        수정
                      </button>
                    )}
                    <button
                      type="button"
                      className="font-medium hover:text-red-500"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isPending}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

function formatRelativeTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '방금 전'
  if (diff < hour) return `${Math.floor(diff / minute)}분 전`
  if (diff < day) return `${Math.floor(diff / hour)}시간 전`
  if (diff < day * 7) return `${Math.floor(diff / day)}일 전`
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
