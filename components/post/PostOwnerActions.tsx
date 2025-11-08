'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'

type PostOwnerActionsProps = {
  postId: string
  editHref: string
  redirectAfterDelete: string
}

export function PostOwnerActions({
  postId,
  editHref,
  redirectAfterDelete,
}: PostOwnerActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    if (!window.confirm('정말 이 포스트를 삭제할까요? 삭제 후에는 복구할 수 없습니다.')) {
      return
    }

    startTransition(async () => {
      setError(null)
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '삭제 중 오류가 발생했습니다.')
        }
        router.push(redirectAfterDelete)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
      }
    })
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Link
          href={editHref}
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          포스트 수정
        </Link>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? '삭제 중…' : '포스트 삭제'}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
