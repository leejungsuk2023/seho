import Image from 'next/image'
import Link from 'next/link'

import { BlogCard } from '@/components/blog/BlogCard'
import { getBlogsWithStats } from '@/lib/blogs'
import { Button } from '@/components/common/Button'

export const revalidate = 60

export default async function HomePage() {
  const blogs = await getBlogsWithStats()

  return (
    <main className="relative min-h-screen" data-layout="full">
      {/* Hero Section with Background Image */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1920&q=80"
            alt="Jazz bar background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-overlay opacity-70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-border-orange bg-background-cream/90 px-4 py-2 mb-8 backdrop-blur-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-text">
              Welcome-to
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-tight drop-shadow-2xl">
            Ø435
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="relative py-32 px-6 md:px-10 bg-gradient-purple-pink overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Section Title */}
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white text-center mb-20 uppercase tracking-wider animate-fade-in-up">
            Programs
          </h2>

          {/* Blog Cards - Centered */}
          {blogs.length === 0 ? (
            <div className="text-center text-white/80 py-20">
              곧 새로운 프로그램이 공개됩니다.
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-12">
              {blogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
