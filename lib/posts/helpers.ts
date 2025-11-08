const MAX_EXCERPT_LENGTH = 160

export function generatePostSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'post'
}

export function createExcerpt(content: string, length = MAX_EXCERPT_LENGTH) {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/[#>*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= length) {
    return plain
  }

  return `${plain.slice(0, length)}…`
}

export function generateTagSlug(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

export function generateCategorySlug(name: string) {
  return generateTagSlug(name)
}
