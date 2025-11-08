import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'

import { auth } from '@/auth'
import { Providers } from './providers'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '세호 (SEHO) - 3개의 블로그 공간',
  description: '3개의 특별한 공간에서 이야기를 나누다',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ko" className={`${inter.variable} ${notoSans.variable}`}>
      <body className="min-h-screen bg-white text-text antialiased">
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
