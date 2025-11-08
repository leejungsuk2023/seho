'use client'

import { useTransition } from 'react'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/common/Button'

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: '/' })
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="whitespace-nowrap"
    >
      {isPending ? '로그아웃 중...' : '로그아웃'}
    </Button>
  )
}
