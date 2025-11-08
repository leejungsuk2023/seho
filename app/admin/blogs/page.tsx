import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { canManageUsers } from '@/lib/auth/permissions'
import { getBlogsForAdmin } from '@/lib/blogs'

import { BlogSettingsManager } from './_components/BlogSettingsManager'

export default async function AdminBlogsPage() {
  const session = await auth()

  if (!canManageUsers(session?.user ?? null)) {
    redirect('/')
  }

  const blogs = await getBlogsForAdmin()

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">블로그 관리</h2>
        <p className="text-sm text-muted-foreground">
          각 블로그의 디자인 요소와 카테고리를 관리하세요.
        </p>
      </header>

      <BlogSettingsManager blogs={blogs} />
    </div>
  )
}
