import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { canManageUsers } from '@/lib/auth/permissions'
import { getAdminPostList } from '@/lib/admin/stats'
import { getBlogsWithStats } from '@/lib/blogs'

import { AdminPostsTable } from './_components/AdminPostsTable'

type SearchParams = {
  page?: string
  status?: string
  blog?: string
  q?: string
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    redirect('/')
  }

  const page = Math.max(Number(searchParams.page ?? '1'), 1)
  const status = searchParams.status
  const blog = searchParams.blog
  const query = searchParams.q?.trim()

  const [blogs, posts] = await Promise.all([
    getBlogsWithStats(),
    getAdminPostList({
      page,
      status: status === 'PUBLISHED' || status === 'DRAFT' || status === 'ARCHIVED'
        ? status
        : undefined,
      blogSlug: blog || undefined,
      query: query?.length ? query : undefined,
    }),
  ])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">포스트 관리</h2>
        <p className="text-sm text-muted-foreground">
          모든 블로그의 포스트를 검색하고 숨김/복구/삭제할 수 있습니다.
        </p>
      </header>

      <AdminPostsTable
        posts={posts.posts}
        pagination={posts.pagination}
        blogs={blogs}
        initialFilters={{
          page,
          status: status ?? '',
          blog: blog ?? '',
          query: query ?? '',
        }}
      />
    </div>
  )
}
