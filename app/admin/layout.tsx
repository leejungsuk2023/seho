import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { canManageUsers } from '@/lib/auth/permissions'

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드' },
  { href: '/admin/users', label: '사용자' },
  { href: '/admin/posts', label: '포스트' },
  { href: '/admin/comments', label: '댓글' },
  { href: '/admin/blogs', label: '블로그' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground">
              시스템 운영을 위한 사용자와 컨텐츠를 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2 shadow-sm">
            <div className="text-sm">
              <p className="font-semibold">{session?.user?.name ?? '관리자'}</p>
              <p className="text-muted-foreground">role: {session?.user?.role}</p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              사이트 보기
            </Link>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="rounded-xl border border-border bg-background p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  )
}
