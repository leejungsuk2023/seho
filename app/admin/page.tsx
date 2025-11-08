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
    },
    {
      label: '발행된 포스트',
      value: stats.publishedPosts,
      description: '현재 공개된 포스트 수',
    },
    {
      label: '최근 24시간 댓글',
      value: stats.commentsLast24h,
      description: '지난 24시간 동안 생성된 댓글',
    },
    {
      label: '숨김/보류 항목',
      value: stats.hiddenItems,
      description: `숨김 포스트 ${stats.hiddenPosts} / 숨김 댓글 ${stats.hiddenComments}`,
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
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-sm font-medium text-muted-foreground">
                {item.label}
              </h3>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">최신 포스트</h3>
            <Link
              href="/admin/posts"
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              전체 보기
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                아직 포스트가 없습니다.
              </p>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-md border border-border/60 bg-background px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {post.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.blog.name}</span>
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

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">최신 댓글</h3>
            <Link
              href="/admin/comments"
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              전체 보기
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentComments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                아직 댓글이 없습니다.
              </p>
            ) : (
              recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-md border border-border/60 bg-background px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {comment.author.nickname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.status}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-muted-foreground">
                    {comment.content}
                  </p>
                  <Link
                    href={`/blogs/${comment.post.blog.slug}/post/${comment.post.slug}`}
                    className="mt-2 inline-flex text-xs font-medium text-primary hover:text-primary/80"
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
