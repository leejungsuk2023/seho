import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { canManageUsers } from '@/lib/auth/permissions'
import { getAdminCommentList } from '@/lib/admin/stats'

import { AdminCommentsTable } from './_components/AdminCommentsTable'

type SearchParams = {
  page?: string
  status?: string
  q?: string
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    redirect('/')
  }

  const page = Math.max(Number(searchParams.page ?? '1'), 1)
  const status = searchParams.status === 'VISIBLE' || searchParams.status === 'HIDDEN'
    ? searchParams.status
    : undefined
  const query = searchParams.q?.trim()

  const comments = await getAdminCommentList({
    page,
    status,
    query: query?.length ? query : undefined,
  })

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">댓글 관리</h2>
        <p className="text-sm text-muted-foreground">
          모든 댓글을 검색하고 숨김/복구/삭제할 수 있습니다.
        </p>
      </header>

      <AdminCommentsTable
        comments={comments.comments}
        pagination={comments.pagination}
        initialFilters={{
          page,
          status: status ?? '',
          query: query ?? '',
        }}
      />
    </div>
  )
}
