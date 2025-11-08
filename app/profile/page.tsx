import Image from 'next/image'
import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      nickname: true,
      profileImageUrl: true,
      bio: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="flex items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.nickname}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                {user.nickname.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.nickname}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {user.role}
            </span>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">자기소개</h2>
          <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
            {user.bio && user.bio.trim().length > 0
              ? user.bio
              : '아직 자기소개가 작성되지 않았습니다.'}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">가입일</p>
            <p className="text-lg font-semibold">
              {new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(user.createdAt)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">최근 업데이트</p>
            <p className="text-lg font-semibold">
              {new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(user.updatedAt)}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
