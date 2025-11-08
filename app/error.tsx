'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <AlertTriangle className="w-24 h-24 text-red-500 animate-float" />
            <div className="absolute -top-2 -right-2 bg-primary-orange rounded-full px-3 py-1 text-white text-sm font-bold animate-scale-in">
              500
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-text mb-4">
          문제가 발생했습니다
        </h1>

        <p className="text-text-muted mb-8 leading-relaxed">
          예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>

        {error.digest && (
          <p className="text-xs text-text-subtle mb-6 font-mono bg-gray-100 p-2 rounded">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-medium transition-all hover:bg-red-500 hover:text-white"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-text-muted">
            문제가 지속되면{' '}
            <a
              href="mailto:seho.platform@example.com"
              className="text-primary-purple hover:underline font-medium"
            >
              고객 지원팀
            </a>
            으로 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
