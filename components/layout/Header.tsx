import Link from 'next/link'

import { auth } from '@/auth'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { MobileMenu } from '@/components/layout/MobileMenu'

export async function Header() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur-md shadow-sm animate-fade-in">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-display font-bold tracking-tight text-background-dark transition-all duration-300 group-hover:scale-105">
            Ch0435
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-text-muted md:flex">
          <HeaderLink href="/blogs/studio-cpa">
            Studio CPA
          </HeaderLink>
          <HeaderLink href="/blogs/swing-company">
            Swing Company
          </HeaderLink>
          <HeaderLink href="/blogs/serein-cafe">
            Serein Cafe
          </HeaderLink>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-text-muted transition-colors hover:text-text md:inline"
              >
                {user.name ?? '프로필'}
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="hidden border-b-2 border-transparent px-2 py-1 text-sm font-semibold uppercase tracking-wider text-text transition-all hover:border-border-orange md:inline"
                >
                  Admin
                </Link>
              )}
              <div className="hidden md:block">
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="hidden md:inline text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                로그인
              </Link>
              <Link
                href="/auth/sign-up"
                className="hidden border border-background-dark px-5 py-2 text-sm font-medium text-background-dark transition-all hover:bg-background-dark hover:text-white md:inline"
              >
                회원가입
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <MobileMenu user={user ?? null} />
        </div>
      </div>
    </header>
  )
}

function HeaderLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-1 transition-all duration-300 hover:text-text group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-purple-pink transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}
