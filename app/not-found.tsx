import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-purple/10 to-primary-pink/10 px-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <FileQuestion className="w-24 h-24 text-primary-purple animate-float" />
            <div className="absolute -top-2 -right-2 bg-primary-pink rounded-full px-3 py-1 text-white text-sm font-bold animate-scale-in">
              404
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-text mb-4">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="text-text-muted mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인해 주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-purple-pink text-white rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-purple text-primary-purple rounded-lg font-medium transition-all hover:bg-primary-purple hover:text-white"
          >
            <Search className="w-4 h-4" />
            검색하기
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-text-muted mb-3">바로가기</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/blogs/studio-cpa"
              className="px-4 py-2 text-sm bg-white rounded-full border border-gray-200 text-text-muted hover:border-primary-purple hover:text-primary-purple transition-colors"
            >
              Studio CPA
            </Link>
            <Link
              href="/blogs/swing-company"
              className="px-4 py-2 text-sm bg-white rounded-full border border-gray-200 text-text-muted hover:border-primary-pink hover:text-primary-pink transition-colors"
            >
              Swing Company
            </Link>
            <Link
              href="/blogs/serein-cafe"
              className="px-4 py-2 text-sm bg-white rounded-full border border-gray-200 text-text-muted hover:border-primary-blue hover:text-primary-blue transition-colors"
            >
              Serein Cafe
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
