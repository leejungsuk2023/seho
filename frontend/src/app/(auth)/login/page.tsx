'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useLogin } from '@/lib/hooks/useAuth';
import type { AxiosError } from 'axios';

/**
 * 로그인 Form 스키마
 */
const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * 로그인 페이지
 * PRD.md 3.1.1 회원가입/로그인
 */
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginMutate, isPending, error } = useLogin();

  const onSubmit = (data: LoginForm) => {
    loginMutate(data);
  };

  const errorMessage = (error as AxiosError | undefined)?.response?.data as any;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-primary mb-2">세호 (SEHO)</h1>
            <p className="text-text-light">취향 공동체를 위한 복합 문화 플랫폼</p>
          </div>
          <CardTitle>로그인</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이메일 */}
            <Input
              label="이메일"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* 비밀번호 */}
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* 비밀번호 찾기 */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-text-light hover:text-primary"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {errorMessage?.message || '로그인에 실패했습니다.'}
                </p>
              </div>
            )}

            {/* 제출 버튼 */}
            <Button type="submit" className="w-full" isLoading={isPending}>
              로그인
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-light">
              아직 계정이 없으신가요?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </p>
          </div>

          {/* 소셜 로그인 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-light">또는</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google로 계속하기
              </Button>

              <Button variant="outline" className="w-full" disabled>
                <div className="w-5 h-5 mr-2 bg-yellow-400 rounded"></div>
                Kakao로 계속하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

