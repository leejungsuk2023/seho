'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldX, ArrowLeft, Home, Mail } from 'lucide-react'

export default function ForbiddenPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <ShieldX className="w-24 h-24 text-red-500 animate-float" />
            <div className="absolute -top-2 -right-2 bg-red-600 rounded-full px-3 py-1 text-white text-sm font-bold animate-scale-in">
              403
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-text mb-4">
          접근 권한이 없습니다
        </h1>

        <p className="text-text-muted mb-6 leading-relaxed">
          요청하신 페이지에 접근할 수 있는 권한이 없습니다.
          <br />
          관리자에게 권한을 요청하거나 다른 페이지로 이동해 주세요.
        </p>

        {from && (
          <p className="text-xs text-text-subtle mb-6 font-mono bg-gray-100 p-2 rounded">
            요청 경로: {decodeURIComponent(from)}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-500 text-red-500 rounded-lg font-medium transition-all hover:bg-red-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            이전 페이지로
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
          >
            <Home className="w-4 h-4" />
            홈으로 이동
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-text-muted flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            권한이 필요하신가요?{' '}
            <a
              href="mailto:seho.platform@example.com"
              className="text-primary-purple hover:underline font-medium"
            >
              관리자에게 문의
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
