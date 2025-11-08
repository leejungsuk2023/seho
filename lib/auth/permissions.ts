import type { UserRole } from "@prisma/client"

type PermissionUser = {
  id: string
  role: UserRole
}

export const ADMIN_ROLES: UserRole[] = ["ADMIN"]
export const WRITER_ROLES: UserRole[] = ["ADMIN", "WRITER"]
export const USER_ROLES: UserRole[] = ["ADMIN", "WRITER", "USER"]

export function isAdmin(user: PermissionUser | null | undefined) {
  return !!user && user.role === "ADMIN"
}

export function isWriter(user: PermissionUser | null | undefined) {
  return !!user && WRITER_ROLES.includes(user.role)
}

export function canManageUsers(user: PermissionUser | null | undefined) {
  return isAdmin(user)
}

export function canWriteToBlog(
  user: PermissionUser | null | undefined,
  _blogSlug: string,
) {
  // 현재 모든 블로그는 동일한 권한 체계를 사용.
  // 추후 블로그별 세부 권한이 생기면 blogSlug 기반 분기 추가.
  return isWriter(user)
}

export function canEditPost(
  user: PermissionUser | null | undefined,
  authorId: string,
) {
  if (!user) return false
  if (isAdmin(user)) return true
  if (isWriter(user) && user.id === authorId) return true
  return false
}

export function canModerateComments(user: PermissionUser | null | undefined) {
  return isAdmin(user)
}
