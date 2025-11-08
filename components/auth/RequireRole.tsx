'use client'

import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import type { UserRole } from '@prisma/client'

import { canManageUsers, isAdmin, isWriter } from '@/lib/auth/permissions'

interface RequireRoleProps {
  roles: UserRole[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RequireRole({ roles, fallback = null, children }: RequireRoleProps) {
  const { data: session, status } = useSession()

  const allowed = useMemo(() => {
    if (status === 'loading') {
      return false
    }
    const user = session?.user ?? null
    if (!user) {
      return false
    }
    return roles.includes(user.role)
  }, [roles, session?.user, status])

  if (!allowed) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RequireWriterProps {
  blogSlug?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RequireWriter({ blogSlug = '', children, fallback = null }: RequireWriterProps) {
  const { data: session, status } = useSession()

  const allowed = useMemo(() => {
    if (status === 'loading') return false
    const user = session?.user ?? null
    if (!user) return false
    return blogSlug
      ? isWriter(user) // 현재는 블로그별 권한 차이가 없지만 확장 대비
      : isWriter(user)
  }, [blogSlug, session?.user, status])

  if (!allowed) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export const PermissionHelpers = {
  isAdmin,
  isWriter,
  canManageUsers,
}
