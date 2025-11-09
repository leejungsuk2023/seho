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
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              관리자 대시보드
            </h1>
            <p className="mt-1 text-muted-foreground">
              시스템 운영을 위한 사용자와 컨텐츠를 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3 shadow-sm">
            <div className="text-sm">
              <p className="font-semibold">{session?.user?.name ?? '관리자'}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">role:</span> {session?.user?.role}
              </p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              사이트 보기
            </Link>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center rounded-lg border border-border/40 bg-background/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-blue-600/50 hover:text-blue-600 hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-8 shadow-lg">
          {children}
        </main>
      </div>
    </div>
  )
}
