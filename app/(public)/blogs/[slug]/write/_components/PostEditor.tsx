'use client'

import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'

import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

type Category = {
  id: string
  name: string
  slug: string
}

type ExistingPost = {
  id: string
  title: string
  content: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  categoryId: string | null
  tags: string[]
}

type PostEditorProps = {
  blogSlug: string
  categories: Category[]
  defaultAuthorName: string
  mode?: 'create' | 'edit'
  initialPost?: ExistingPost
}

export function PostEditor({
  blogSlug,
  categories,
  defaultAuthorName,
  mode = 'create',
  initialPost,
}: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [categoryId, setCategoryId] = useState<string | undefined>(
    initialPost?.categoryId ?? undefined,
  )
  const [tagInput, setTagInput] = useState(
    initialPost?.tags.join(', ') ?? '',
  )
  const [content, setContent] = useState<string | undefined>(
    initialPost?.content ?? '## 안녕하세요 👋\n\n여기에 내용을 작성해보세요.',
  )
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(
    initialPost?.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!content || content.trim().length === 0) {
      setError('본문을 입력해주세요.')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          blogSlug,
          title,
          content,
          status,
          categoryId: categoryId ?? null,
          tagNames: parseTags(tagInput),
        }

        const endpoint =
          mode === 'edit' && initialPost
            ? `/api/posts/${initialPost.id}`
            : '/api/posts'

        const response = await fetch(endpoint, {
          method: mode === 'edit' ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            mode === 'edit' && initialPost
              ? {
                  ...payload,
                  regenerateSlug: payload.title !== initialPost.title,
                }
              : payload,
          ),
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message ?? '포스트 작성 중 오류가 발생했습니다.')
        }

        setSuccess(mode === 'edit' ? '포스트가 수정되었습니다.' : '포스트가 저장되었습니다.')
        setTimeout(() => {
          router.push(`/blogs/${blogSlug}/post/${data.post.slug}`)
        }, 600)
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      }
    })
  }

  const publishLabel =
    mode === 'edit'
      ? status === 'PUBLISHED'
        ? '발행 상태로 저장'
        : '임시 저장으로 저장'
      : status === 'PUBLISHED'
      ? '바로 발행'
      : '임시 저장'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="포스트 제목을 입력하세요"
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            카테고리
          </label>
          <select
            id="category"
            value={categoryId ?? ''}
            onChange={(event) =>
              setCategoryId(event.target.value === '' ? undefined : event.target.value)
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">
            태그
          </label>
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="쉼표(,) 로 구분하여 입력"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            예) 감성, 커피, 음악 — 최대 10개까지 입력 가능합니다.
          </p>
        </div>
      </div>

      <div data-color-mode="light">
        <MDEditor
          value={content}
          onChange={(value) => setContent(value ?? '')}
          height={400}
          preview="edit"
        />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/40 p-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          작성자: <span className="font-medium text-foreground">{defaultAuthorName}</span>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as 'DRAFT' | 'PUBLISHED')}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DRAFT">임시 저장</option>
            <option value="PUBLISHED">바로 발행</option>
          </select>
          <Button type="submit" disabled={isPending}>
            {isPending ? '저장 중…' : publishLabel}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}
    </form>
  )
}

function parseTags(input: string) {
  return input
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}
