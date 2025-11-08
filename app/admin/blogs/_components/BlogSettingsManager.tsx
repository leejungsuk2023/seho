'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'

import { Button } from '@/components/common/Button'

type AdminCategory = {
  id: string
  name: string
  slug: string
}

type AdminBlog = {
  id: string
  slug: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  coverImageUrl: string | null
  logoImageUrl: string | null
  primaryColor: string | null
  visibility: boolean
  headingFont: string | null
  bodyFont: string | null
  layoutStyle: string | null
  sidebarPosition: string | null
  categories: AdminCategory[]
}

type FormState = {
  name: string
  description: string
  thumbnailUrl: string
  coverImageUrl: string
  logoImageUrl: string
  primaryColor: string
  headingFont: string
  bodyFont: string
  layoutStyle: string
  sidebarPosition: string
  visibility: boolean
}

const DEFAULT_FORM: FormState = {
  name: '',
  description: '',
  thumbnailUrl: '',
  coverImageUrl: '',
  logoImageUrl: '',
  primaryColor: '',
  headingFont: '',
  bodyFont: '',
  layoutStyle: '',
  sidebarPosition: '',
  visibility: true,
}

export function BlogSettingsManager({ blogs }: { blogs: AdminBlog[] }) {
  const [selectedBlogId, setSelectedBlogId] = useState<string>(
    blogs[0]?.id ?? '',
  )
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [categories, setCategories] = useState<AdminCategory[]>(
    blogs[0]?.categories ?? [],
  )
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        (blogs[0]?.categories ?? []).map((category) => [
          category.id,
          category.name,
        ]),
      ),
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, startSaving] = useTransition()
  const [isCategorySaving, startCategorySaving] = useTransition()

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === selectedBlogId),
    [blogs, selectedBlogId],
  )

  useEffect(() => {
    if (!selectedBlog) return

    setForm({
      name: selectedBlog.name ?? '',
      description: selectedBlog.description ?? '',
      thumbnailUrl: selectedBlog.thumbnailUrl ?? '',
      coverImageUrl: selectedBlog.coverImageUrl ?? '',
      logoImageUrl: selectedBlog.logoImageUrl ?? '',
      primaryColor: selectedBlog.primaryColor ?? '',
      headingFont: selectedBlog.headingFont ?? '',
      bodyFont: selectedBlog.bodyFont ?? '',
      layoutStyle: selectedBlog.layoutStyle ?? '',
      sidebarPosition: selectedBlog.sidebarPosition ?? '',
      visibility: selectedBlog.visibility,
    })
    setCategories(selectedBlog.categories)
    setCategoryInputs(
      Object.fromEntries(
        selectedBlog.categories.map((category) => [
          category.id,
          category.name,
        ]),
      ),
    )
  }, [selectedBlog])

  const handleInputChange = (
    field: keyof FormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!selectedBlog) return
    setError(null)
    setMessage(null)

    startSaving(async () => {
      try {
        const response = await fetch(`/api/admin/blogs/${selectedBlog.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...form,
          }),
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '블로그 설정 저장에 실패했습니다.')
        }
        setMessage('블로그 설정이 저장되었습니다.')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '블로그 설정 저장 중 오류가 발생했습니다.',
        )
      }
    })
  }

  const refreshCategories = async () => {
    if (!selectedBlog) return
    try {
      const response = await fetch(
        `/api/admin/categories?blogId=${selectedBlog.id}`,
      )
      const data = await response.json()
      if (response.ok) {
        setCategories(data.data)
        setCategoryInputs(
          Object.fromEntries(
            data.data.map((category: AdminCategory) => [
              category.id,
              category.name,
            ]),
          ),
        )
      }
    } catch {
      setError('카테고리 목록을 갱신하지 못했습니다.')
    }
  }

  const handleCategoryCreate = () => {
    if (!selectedBlog) return
    if (newCategoryName.trim().length === 0) {
      setError('카테고리 이름을 입력해주세요.')
      return
    }
    setError(null)
    startCategorySaving(async () => {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blogId: selectedBlog.id,
            name: newCategoryName.trim(),
          }),
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '카테고리 생성에 실패했습니다.')
        }
        setNewCategoryName('')
        await refreshCategories()
        setMessage('카테고리가 추가되었습니다.')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '카테고리 추가 중 오류가 발생했습니다.',
        )
      }
    })
  }

  const handleCategoryUpdate = (categoryId: string) => {
    if (!selectedBlog) return
    const name = categoryInputs[categoryId]?.trim()
    if (!name) {
      setError('카테고리 이름을 입력해주세요.')
      return
    }
    startCategorySaving(async () => {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '카테고리 수정에 실패했습니다.')
        }
        await refreshCategories()
        setMessage('카테고리가 수정되었습니다.')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '카테고리 수정 중 오류가 발생했습니다.',
        )
      }
    })
  }

  const handleCategoryDelete = (categoryId: string) => {
    if (!window.confirm('카테고리를 삭제하시겠습니까?')) {
      return
    }
    startCategorySaving(async () => {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
        })
        const data = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(data?.message ?? '카테고리 삭제에 실패했습니다.')
        }
        await refreshCategories()
        setMessage('카테고리가 삭제되었습니다.')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '카테고리 삭제 중 오류가 발생했습니다.',
        )
      }
    })
  }

  if (!selectedBlog) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
        관리할 블로그가 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {blogs.map((blog) => (
          <button
            key={blog.id}
            type="button"
            onClick={() => setSelectedBlogId(blog.id)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
              selectedBlogId === blog.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-muted text-muted-foreground hover:border-primary/60 hover:text-primary'
            }`}
          >
            {blog.name}
          </button>
        ))}
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold">디자인 및 노출 설정</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="블로그 이름"
            value={form.name}
            onChange={(value) => handleInputChange('name', value)}
          />
          <TextField
            label="슬러그"
            value={selectedBlog.slug}
            disabled
            helper="슬러그는 변경할 수 없습니다."
          />
          <TextAreaField
            label="설명"
            value={form.description}
            onChange={(value) => handleInputChange('description', value)}
          />
          <TextField
            label="대표 색상 (primaryColor)"
            value={form.primaryColor}
            onChange={(value) => handleInputChange('primaryColor', value)}
            placeholder="#3b82f6"
          />
          <ImageField
            label="커버 이미지 URL"
            value={form.coverImageUrl}
            onChange={(value) => handleInputChange('coverImageUrl', value)}
            placeholder="https://example.com/cover.jpg"
          />
          <ImageField
            label="로고 이미지 URL"
            value={form.logoImageUrl}
            onChange={(value) => handleInputChange('logoImageUrl', value)}
            placeholder="https://example.com/logo.png"
          />
          <ImageField
            label="썸네일 이미지 URL"
            value={form.thumbnailUrl}
            onChange={(value) => handleInputChange('thumbnailUrl', value)}
            placeholder="https://example.com/thumb.jpg"
          />
          <ToggleField
            label="공개 여부"
            checked={form.visibility}
            onChange={(value) => handleInputChange('visibility', value)}
          />
          <TextField
            label="헤딩 폰트"
            value={form.headingFont}
            onChange={(value) => handleInputChange('headingFont', value)}
            placeholder="Pretendard, Inter 등"
          />
          <TextField
            label="본문 폰트"
            value={form.bodyFont}
            onChange={(value) => handleInputChange('bodyFont', value)}
            placeholder="Pretendard, Inter 등"
          />
          <TextField
            label="레이아웃 스타일"
            value={form.layoutStyle}
            onChange={(value) => handleInputChange('layoutStyle', value)}
            placeholder="two-column, magazine 등"
          />
          <TextField
            label="사이드바 위치"
            value={form.sidebarPosition}
            onChange={(value) => handleInputChange('sidebarPosition', value)}
            placeholder="left / right / none"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중…' : '블로그 설정 저장'}
          </Button>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">카테고리 관리</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="카테고리 이름 입력"
              className="w-48 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCategoryCreate}
              disabled={isCategorySaving}
            >
              추가
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 카테고리가 없습니다. 새 카테고리를 추가해 보세요.
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-2 rounded-md border border-border px-3 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={categoryInputs[category.id] ?? ''}
                    onChange={(event) =>
                      setCategoryInputs((prev) => ({
                        ...prev,
                        [category.id]: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    slug: {category.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCategoryUpdate(category.id)}
                    disabled={isCategorySaving}
                  >
                    저장
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleCategoryDelete(category.id)}
                    disabled={isCategorySaving}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {(message || error) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            message
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700'
              : 'border-red-500/50 bg-red-500/10 text-red-600'
          }`}
        >
          {message ?? error}
        </div>
      )}
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  helper,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  helper?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted"
      />
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}

function ImageField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder ?? 'https://example.com/image.jpg'}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 text-sm font-medium text-primary hover:underline"
        >
          {showPreview ? '미리보기 숨기기' : '미리보기'}
        </button>
      </div>
      {showPreview && value && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-background p-4">
          <div className="relative h-48 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = ''
                e.currentTarget.alt = '이미지를 불러올 수 없습니다'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
