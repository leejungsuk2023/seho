import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { canManageUsers } from "@/lib/auth/permissions"
import { getAdminStats, getRecentComments, getRecentPosts } from "@/lib/admin/stats"

export async function GET() {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    return new NextResponse("접근 권한이 없습니다.", { status: 403 })
  }

  const [stats, recentPosts, recentComments] = await Promise.all([
    getAdminStats(),
    getRecentPosts(),
    getRecentComments(),
  ])

  return NextResponse.json({
    stats,
    recentPosts,
    recentComments,
  })
}
