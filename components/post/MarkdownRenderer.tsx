'use client'

import type { CSSProperties } from 'react'
import dynamic from 'next/dynamic'

import '@uiw/react-markdown-preview/markdown.css'

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  {
    ssr: false,
  },
)

export function MarkdownRenderer({
  content,
  accentColor = '#3b82f6',
}: {
  content: string
  accentColor?: string
}) {
  return (
    <div
      className="w-full mx-auto prose prose-zinc max-w-none leading-relaxed bg-white text-text md:prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-text prose-p:leading-relaxed prose-p:text-text prose-blockquote:border-l-4 prose-blockquote:bg-white prose-blockquote:px-6 prose-blockquote:py-4 prose-code:rounded-md prose-code:bg-base-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-text prose-strong:text-text prose-a:text-text"
      style={
        {
          '--tw-prose-bullets': accentColor,
          '--tw-prose-quotes': accentColor,
          '--tw-prose-body': '#1a1a1a',
          '--tw-prose-headings': '#1a1a1a',
          '--tw-prose-links': '#1a1a1a',
          '--tw-prose-bold': '#1a1a1a',
          '--tw-prose-code': '#1a1a1a',
        } as CSSProperties
      }
    >
      <MarkdownPreview
        source={content}
        style={{
          backgroundColor: 'white',
          color: '#1a1a1a',
          margin: '0 auto',
          width: '100%',
          textAlign: 'left',
        }}
      />
    </div>
  )
}
