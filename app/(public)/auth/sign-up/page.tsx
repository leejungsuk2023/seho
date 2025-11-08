'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/common/Button'

const signUpSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    .regex(/[A-Za-z]/, { message: '비밀번호에는 영문이 포함되어야 합니다.' })
    .regex(/\d/, { message: '비밀번호에는 숫자가 포함되어야 합니다.' }),
  nickname: z
    .string()
    .min(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
    .max(20, { message: '닉네임은 최대 20자까지 가능합니다.' }),
})

type SignUpValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
    },
  })

  const onSubmit = async (values: SignUpValues) => {
    setFormError(null)
    setFormSuccess(null)

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      setFormError(
        data?.details ??
          data?.message ??
          '회원가입 처리 중 오류가 발생했습니다.',
      )
      return
    }

    setFormSuccess('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
    reset()
    setTimeout(() => {
      router.push('/auth/sign-in')
    }, 1600)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">회원가입</h1>
          <p className="text-muted-foreground">
            이메일과 비밀번호로 새로운 계정을 만들어보세요.
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
                autoComplete="new-password"
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="영문, 숫자 조합 8자 이상"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="mb-2 block text-sm font-medium"
              >
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                autoComplete="nickname"
                className="w-full rounded-md border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="닉네임을 입력하세요"
                {...register('nickname')}
              />
              {errors.nickname && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            {formError && (
              <div className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="rounded-md border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                {formSuccess}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? '가입 처리 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link
              href="/auth/sign-in"
              className="font-medium text-primary hover:underline"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
