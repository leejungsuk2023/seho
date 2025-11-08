import Link from 'next/link'
import Image from 'next/image'

import type { BlogSummary } from '@/lib/blogs'
import { getBlogTheme } from '@/lib/constants/blogThemes'

interface BlogCardProps {
  blog: BlogSummary
}

export function BlogCard({ blog }: BlogCardProps) {
  const theme = getBlogTheme(blog.slug)

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="group flex flex-col items-center w-full" style={{ width: '320px' }}>
        {/* Card Container - Fixed Size */}
        <div className="relative overflow-hidden rounded-2xl bg-background-dark shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2" style={{ width: '320px', height: '400px' }}>
          {/* Image Section - Fixed aspect ratio */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={blog.coverImageUrl || theme.placeholder}
              alt={blog.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-overlay opacity-40 transition-opacity duration-500 group-hover:opacity-20" />
          </div>
        </div>

        {/* Content Below Card - Center Aligned */}
        <div className="mt-8 text-text space-y-5 text-center" style={{ width: '320px' }}>
          {/* Title */}
          <h3 className="text-3xl font-display font-bold uppercase tracking-wide text-text transition-all duration-300 group-hover:text-text/80">
            {theme.displayName}
          </h3>

          {/* Subtitle - Special styling */}
          <p className="text-sm leading-relaxed text-text/60 whitespace-pre-line italic font-serif">
            {theme.subtitle}
          </p>

          {/* Items List */}
          {theme.items.length > 0 && (
            <ul className="space-y-2.5 text-left inline-block">
              {theme.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text/70">
                  <span className="mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
  )
}
