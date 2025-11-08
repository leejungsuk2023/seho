import Link from 'next/link'
import Image from 'next/image'

type PostCardProps = {
  blogSlug: string
  blogName?: string
  accentColor?: string
  accentSoftColor?: string
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content?: string
    publishedAt: Date | string | null
    createdAt: Date | string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    author: {
      id: string
      nickname: string
    }
    category: {
      id: string
      name: string
      slug: string
    } | null
    tags: {
      id: string
      name: string
      slug: string
    }[]
  }
  showStatus?: boolean
}

function formatDate(value: Date | string | null) {
  if (!value) return '발행 예정'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Extract first image from markdown content
function extractFirstImage(content?: string): string | null {
  if (!content) return null

  // Match markdown image syntax: ![alt](url)
  const mdImageMatch = content.match(/!\[.*?\]\((.*?)\)/)
  if (mdImageMatch && mdImageMatch[1]) {
    return mdImageMatch[1]
  }

  // Match HTML img tag: <img src="url"
  const htmlImageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
  if (htmlImageMatch && htmlImageMatch[1]) {
    return htmlImageMatch[1]
  }

  return null
}

export function PostCard({
  blogSlug,
  blogName,
  post,
  showStatus = false,
  accentColor = '#3b82f6',
  accentSoftColor = '#dbeafe',
}: PostCardProps) {
  const href = `/blogs/${blogSlug}/post/${post.slug}`
  const publishedLabel =
    post.status === 'PUBLISHED' ? '발행 완료' : post.status === 'DRAFT' ? '임시 저장' : '보관됨'

  const thumbnailImage = extractFirstImage(post.content)

  return (
    <article className="group relative overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-lg animate-fade-in-up">
      {/* Thumbnail Image */}
      <Link href={href} className="block">
        <div className="relative w-full h-48 overflow-hidden bg-base-100">
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
              <span className="text-4xl font-display font-bold text-text/10 tracking-wider">
                {post.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Date and Category */}
        <div className="flex items-center gap-2 mb-3 text-xs text-text-muted">
          <time className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          {post.category && (
            <>
              <span>•</span>
              <span className="font-medium">{post.category.name}</span>
            </>
          )}
          {showStatus && (
            <>
              <span>•</span>
              <span
                className="px-2 py-0.5 text-xs font-semibold rounded"
                style={{ backgroundColor: accentSoftColor, color: accentColor }}
              >
                {publishedLabel}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={href} className="block mb-3">
          <h3 className="text-xl font-bold text-text leading-tight transition-colors duration-300 group-hover:text-primary-purple line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm leading-relaxed text-text-muted line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 bg-base-100 text-text-muted rounded hover:bg-base-200 transition-colors"
              >
                #{tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-text-muted">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text transition-all duration-300 hover:gap-3"
        >
          <span>글보기</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
