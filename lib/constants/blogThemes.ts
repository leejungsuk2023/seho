type BlogTheme = {
  slug: string
  displayName: string
  tagline: string
  description: string
  subtitle: string
  items: string[]
  accent: string
  accentSoft: string
  gradient: string
  placeholder: string
  ctaLabel: string
}

export const BLOG_THEMES: Record<string, BlogTheme> = {
  'studio-cpa': {
    slug: 'studio-cpa',
    displayName: 'STUDIO CPA',
    tagline: 'Balance the numbers, craft the stories.',
    description:
      '재무와 감각이 공존하는 스튜디오. 전문가의 시선으로 회계와 비즈니스 인사이트를 전합니다.',
    subtitle: 'Life is all about debits and credits.\n인생은 그야말로 차변과 대변.',
    items: [
      '재무회계 (Financial Accounting)',
      '세무회계 (Taxation)',
      '재무자문 (Financial Advisory)',
      '내부회계 (Internal Control over FR)',
    ],
    accent: '#8b5cf6',
    accentSoft: '#ede9fe',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.08) 100%)',
    placeholder:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Studio CPA connect',
  },
  'swing-company': {
    slug: 'swing-company',
    displayName: 'SWING COMPANY',
    tagline: 'Ideas swing between boldness and rhythm.',
    description:
      '창의와 에너지로 가득한 스윙 컴퍼니. 프로젝트와 사람, 그리고 가능성을 잇는 공간입니다.',
    subtitle: 'Swing is Dionysian connection.\n스윙은 불연속의 연속이며, 연속의 불연속이다.',
    items: [
      '♬ Jazz 소개',
      '♬ Jazz 감상',
      '♬ 마치 잘 아는 것처럼 떠들어대기',
      '♬ 전문가의 이야기들',
    ],
    accent: '#ec4899',
    accentSoft: '#fce7f3',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0.08) 100%)',
    placeholder:
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Swing Company connect',
  },
  'serein-cafe': {
    slug: 'serein-cafe',
    displayName: 'SEREIN CAFE',
    tagline: 'Stories brewed slow and shared warm.',
    description:
      '잔잔한 영감이 머무는 세렌 카페. 글과 음악, 일상의 순간을 담아내는 아카이브입니다.',
    subtitle: 'Where pleasantly roasted stories rise.\n알맞게 로스팅된 이야기가 피어오르는 곳',
    items: [
      '☕ 취향을 묻고 필터에 내려서 올리기',
      '☕ 너무나 쓰면서가 있는 중요한 것들',
      '☕ 너무나 중요한 쓰면서가 있는 것들',
      '☕ ...사람 사는 이야기들',
    ],
    accent: '#3b82f6',
    accentSoft: '#dbeafe',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.08) 100%)',
    placeholder:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'Serein Cafe connect',
  },
}

export function getBlogTheme(slug: string) {
  return BLOG_THEMES[slug] ?? {
    slug,
    displayName: slug,
    tagline: 'Stories worth sharing.',
    description: '콘텐츠가 곧 브랜드가 되는 곳, 세호의 이야기가 이어집니다.',
    subtitle: 'New stories begin here.',
    items: [],
    accent: '#3b82f6',
    accentSoft: '#dbeafe',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.08) 100%)',
    placeholder:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    ctaLabel: 'connect',
  }
}
