'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { ToastProvider } from '@/components/common/ToastProvider'

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      {children}
      <ToastProvider />
    </SessionProvider>
  )
}
