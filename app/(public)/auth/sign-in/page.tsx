'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/common/Button'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: '유효한 이메일을 입력해주세요.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
})

type SignInValues = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl =
    searchParams.get('callbackUrl') && searchParams.get('callbackUrl') !== '%2F'
      ? decodeURIComponent(searchParams.get('callbackUrl')!)
      : '/'

  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: SignInValues) => {
    setFormError(null)

    const result = await signIn('credentials', {
      ...values,
      redirect: false,
    })

    if (result?.error) {
      setFormError('이메일 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">로그인</h1>
          <p className="text-muted-foreground">
            세호에 오신 것을 환영합니다
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="name@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                아직 계정이 없으신가요?
              </span>
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary hover:underline"
              >
                회원가입
              </Link>
            </div>

            {formError && (
              <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
