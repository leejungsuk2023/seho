import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'
import Link from 'next/link'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { canManageUsers } from '@/lib/auth/permissions'
import { Button } from '@/components/common/Button'
import UsersTable from './_components/UsersTable'

const PAGE_SIZE = 10

type SearchParams = {
  page?: string
  role?: string
  q?: string
}

function buildQuery(params: SearchParams & { page?: number }) {
  const urlSearch = new URLSearchParams()
  if (params.q) urlSearch.set('q', params.q)
  if (params.role) urlSearch.set('role', params.role)
  if (params.page && params.page > 0) urlSearch.set('page', String(params.page))
  return urlSearch.toString()
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    redirect('/')
  }

  const page = Math.max(Number(searchParams.page ?? '1'), 1)
  const roleFilter = searchParams.role && Object.values(UserRole).includes(searchParams.role as UserRole)
    ? (searchParams.role as UserRole)
    : undefined
  const query = searchParams.q?.trim() ?? undefined

  const where = {
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(query
      ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' as const } },
            { nickname: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
  ])

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1)

  const rows = users.map((user) => ({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    postCount: user._count.posts,
    commentCount: user._count.comments,
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">사용자 관리</h2>
          <p className="text-sm text-muted-foreground">
            사용자 역할을 조정하고 검색/필터로 원하는 사용자를 찾으세요.
          </p>
        </div>
        <Link
          href="/admin/users?role=WRITER"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          WRITER만 보기
        </Link>
      </div>

      <form className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4 lg:flex-row lg:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="q" className="text-sm font-medium">
            검색어
          </label>
          <input
            id="q"
            name="q"
            defaultValue={query ?? ''}
            placeholder="이메일 또는 닉네임"
            className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="role" className="text-sm font-medium">
            역할
          </label>
          <select
            id="role"
            name="role"
            defaultValue={roleFilter ?? ''}
            className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">전체</option>
            <option value="ADMIN">ADMIN</option>
            <option value="WRITER">WRITER</option>
            <option value="USER">USER</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" className="w-full lg:w-auto">
            필터 적용
          </Button>
          {(query || roleFilter) && (
            <Link
              href="/admin/users"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              초기화
            </Link>
          )}
        </div>
      </form>

      <UsersTable
        initialUsers={rows}
        pagination={{
          page,
          totalPages,
          total,
        }}
        filters={{
          q: query,
          role: roleFilter,
        }}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          총 {total}명 · 페이지 {page}/{totalPages}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/users?${buildQuery({ ...searchParams, page: page - 1 })}`}
            className={`rounded-md border px-3 py-1 ${
              page <= 1
                ? 'pointer-events-none border-border text-muted-foreground'
                : 'border-border hover:border-primary/60 hover:text-primary'
            }`}
          >
            이전
          </Link>
          <Link
            href={`/admin/users?${buildQuery({ ...searchParams, page: page + 1 })}`}
            className={`rounded-md border px-3 py-1 ${
              page >= totalPages
                ? 'pointer-events-none border-border text-muted-foreground'
                : 'border-border hover:border-primary/60 hover:text-primary'
            }`}
          >
            다음
          </Link>
        </div>
      </div>
    </div>
  )
}
