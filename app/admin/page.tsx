import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { canManageUsers } from '@/lib/auth/permissions'
import {
  getAdminStats,
  getRecentComments,
  getRecentPosts,
} from '@/lib/admin/stats'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    redirect('/forbidden?from=/admin')
  }

  const [stats, recentPosts, recentComments] = await Promise.all([
    getAdminStats(),
    getRecentPosts(),
    getRecentComments(),
  ])

  const KPI = [
    {
      label: '전체 사용자',
      value: stats.totalUsers,
      description: '가입된 사용자 수',
      gradient: 'from-blue-500/10 to-blue-600/5',
      textColor: 'text-blue-600',
    },
    {
      label: '발행된 포스트',
      value: stats.publishedPosts,
      description: '현재 공개된 포스트 수',
      gradient: 'from-green-500/10 to-green-600/5',
      textColor: 'text-green-600',
    },
    {
      label: '최근 24시간 댓글',
      value: stats.commentsLast24h,
      description: '지난 24시간 동안 생성된 댓글',
      gradient: 'from-purple-500/10 to-purple-600/5',
      textColor: 'text-purple-600',
    },
    {
      label: '숨김/보류 항목',
      value: stats.hiddenItems,
      description: `숨김 포스트 ${stats.hiddenPosts} / 숨김 댓글 ${stats.hiddenComments}`,
      gradient: 'from-orange-500/10 to-orange-600/5',
      textColor: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold">대시보드</h2>
        <p className="text-sm text-muted-foreground">
          주요 지표와 최근 활동을 한눈에 확인하세요.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KPI.map((item) => (
            <div
              key={item.label}
              className={`group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br ${item.gradient} p-6 shadow-sm transition-all hover:shadow-md hover:border-border`}
            >
              <div className="relative">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </h3>
                <p className={`mt-3 text-4xl font-bold ${item.textColor} transition-transform group-hover:scale-105`}>
                  {item.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h3 className="text-lg font-semibold">최신 포스트</h3>
            <Link
              href="/admin/posts"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentPosts.length === 0 ? (
              <div className="rounded-lg bg-muted/30 px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  아직 포스트가 없습니다.
                </p>
              </div>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="group rounded-lg border border-border/40 bg-gradient-to-br from-background to-muted/20 px-4 py-3 text-sm transition-all hover:border-border hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-foreground line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </span>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      post.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : post.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{post.blog.name}</span>
                    <span>·</span>
                    <span>{post.author.nickname}</span>
                    <span>·</span>
                    <span>
                      {(post.publishedAt ?? post.createdAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h3 className="text-lg font-semibold">최신 댓글</h3>
            <Link
              href="/admin/comments"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentComments.length === 0 ? (
              <div className="rounded-lg bg-muted/30 px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  아직 댓글이 없습니다.
                </p>
              </div>
            ) : (
              recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="group rounded-lg border border-border/40 bg-gradient-to-br from-background to-muted/20 px-4 py-3 text-sm transition-all hover:border-border hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">
                      {comment.author.nickname}
                    </span>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      comment.status === 'VISIBLE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-muted-foreground">
                    {comment.content}
                  </p>
                  <Link
                    href={`/blogs/${comment.post.blog.slug}/post/${comment.post.slug}`}
                    className="mt-2 inline-flex text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    포스트로 이동 →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
