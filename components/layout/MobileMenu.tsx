'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Menu, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface MobileMenuProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  } | null
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-text-muted hover:text-text transition-colors"
        aria-label="메뉴 열기"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden animate-slide-in-right overflow-y-auto">
            <nav className="flex flex-col p-6 gap-4">
              {/* Blog Links */}
              <div className="border-b border-border pb-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  블로그
                </p>
                <MobileLink href="/blogs/studio-cpa" onClick={closeMenu}>
                  Studio CPA
                </MobileLink>
                <MobileLink href="/blogs/swing-company" onClick={closeMenu}>
                  Swing Company
                </MobileLink>
                <MobileLink href="/blogs/serein-cafe" onClick={closeMenu}>
                  Serein Cafe
                </MobileLink>
              </div>

              {/* User Section */}
              <div className="border-b border-border pb-4">
                {user ? (
                  <>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                      계정
                    </p>
                    <MobileLink href="/profile" onClick={closeMenu}>
                      {user.name ?? '프로필'}
                    </MobileLink>
                    {user.role === 'ADMIN' && (
                      <MobileLink href="/admin" onClick={closeMenu}>
                        관리자
                      </MobileLink>
                    )}
                    <button
                      onClick={() => {
                        closeMenu()
                        signOut({ callbackUrl: '/' })
                      }}
                      className="flex items-center gap-2 w-full py-2.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                      계정
                    </p>
                    <MobileLink href="/auth/sign-in" onClick={closeMenu}>
                      로그인
                    </MobileLink>
                    <MobileLink href="/auth/sign-up" onClick={closeMenu}>
                      회원가입
                    </MobileLink>
                  </>
                )}
              </div>

              {/* Search */}
              <div>
                <MobileLink href="/search" onClick={closeMenu}>
                  검색
                </MobileLink>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2.5 text-sm font-medium text-text hover:text-primary-purple transition-colors"
    >
      {children}
    </Link>
  )
}
