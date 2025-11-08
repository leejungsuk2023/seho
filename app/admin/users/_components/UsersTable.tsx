'use client'

import { useMemo, useState } from 'react'
import type { UserRole } from '@prisma/client'

import { Button } from '@/components/common/Button'

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'ADMIN',
  WRITER: 'WRITER',
  USER: 'USER',
}

type UserRow = {
  id: string
  email: string
  nickname: string
  role: UserRole
  createdAt: string
  updatedAt: string
  postCount: number
  commentCount: number
}

type Pagination = {
  page: number
  totalPages: number
  total: number
}

type Filters = {
  q?: string
  role?: UserRole
}

type Feedback =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null

export default function UsersTable({
  initialUsers,
  pagination,
  filters,
}: {
  initialUsers: UserRow[]
  pagination: Pagination
  filters: Filters
}) {
  const [rows, setRows] = useState<UserRow[]>(initialUsers)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.role) params.set('role', filters.role)
    params.set('page', String(pagination.page))
    return params.toString()
  }, [filters.q, filters.role, pagination.page])

  const handleRoleChange = async (userId: string, nextRole: UserRole) => {
    setPendingUserId(userId)
    setFeedback(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: nextRole }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.message ?? '역할 변경 중 오류가 발생했습니다.')
      }

      setRows((prev) =>
        prev.map((row) =>
          row.id === userId
            ? {
                ...row,
                role: nextRole,
                updatedAt: new Date().toISOString(),
              }
            : row,
        ),
      )

      setFeedback({
        type: 'success',
        message: data?.message ?? '역할이 변경되었습니다.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : '역할 변경 중 오류가 발생했습니다.',
      })
    } finally {
      setPendingUserId(null)
    }
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700'
              : 'border-red-500/50 bg-red-500/10 text-red-600'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3">닉네임</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">역할</th>
              <th className="px-4 py-3">포스트</th>
              <th className="px-4 py-3">댓글</th>
              <th className="px-4 py-3">가입일</th>
              <th className="px-4 py-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={7}>
                  검색 조건에 맞는 사용자가 없습니다.
                </td>
              </tr>
            )}
            {rows.map((user) => {
              const createdAt = new Date(user.createdAt)
              const formattedDate = createdAt.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })

              return (
                <tr key={user.id} className="border-b border-border/60">
                  <td className="px-4 py-3 font-medium">{user.nickname}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-xs font-medium">
                      {ROLE_LABELS[user.role]}
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.postCount}</td>
                  <td className="px-4 py-3">{user.commentCount}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RoleAction
                      userId={user.id}
                      currentRole={user.role}
                      disabled={pendingUserId === user.id}
                      onChange={handleRoleChange}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end text-xs text-muted-foreground">
        <span>쿼리: {queryString || '없음'}</span>
      </div>
    </div>
  )
}

function RoleAction({
  userId,
  currentRole,
  disabled,
  onChange,
}: {
  userId: string
  currentRole: UserRole
  disabled: boolean
  onChange: (userId: string, role: UserRole) => void
}) {
  const [nextRole, setNextRole] = useState<UserRole>(currentRole)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (nextRole === currentRole) {
      return
    }
    await onChange(userId, nextRole)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-end gap-2"
    >
      <select
        className="rounded-md border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={nextRole}
        onChange={(event) => setNextRole(event.target.value as UserRole)}
        disabled={disabled}
      >
        <option value="ADMIN">ADMIN</option>
        <option value="WRITER">WRITER</option>
        <option value="USER">USER</option>
      </select>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={disabled || nextRole === currentRole}
      >
        {disabled ? '변경 중...' : '변경'}
      </Button>
    </form>
  )
}
