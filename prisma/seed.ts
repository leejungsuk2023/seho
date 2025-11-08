import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BLOGS = [
  {
    slug: 'serein-cafe',
    name: 'Serein Cafe',
    description: '세렌 카페 - 다양한 이야기가 모이는 공간',
    primaryColor: '#3b82f6',
    visibility: true,
  },
  {
    slug: 'studio-cpa',
    name: 'Studio CPA',
    description: '스튜디오 CPA - 전문적인 컨텐츠 공간',
    primaryColor: '#8b5cf6',
    visibility: true,
  },
  {
    slug: 'swing-company',
    name: 'Swing Company',
    description: '스윙 컴퍼니 - 창의적인 아이디어가 모이는 곳',
    primaryColor: '#ec4899',
    visibility: true,
  },
] as const

async function main() {
  for (const blog of BLOGS) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {
        name: blog.name,
        description: blog.description,
        primaryColor: blog.primaryColor,
        visibility: blog.visibility,
      },
      create: {
        slug: blog.slug,
        name: blog.name,
        description: blog.description,
        primaryColor: blog.primaryColor,
        visibility: blog.visibility,
      },
    })
  }

  // Optional: mark default categories
  const defaultCategories = [
    { name: '공지', slug: 'notice' },
    { name: '소식', slug: 'news' },
    { name: '인사이트', slug: 'insight' },
  ] as const

  const blogs = await prisma.blog.findMany()
  for (const blog of blogs) {
    for (const category of defaultCategories) {
      await prisma.category.upsert({
        where: {
          blogId_slug: {
            blogId: blog.id,
            slug: `${category.slug}-${blog.slug}`,
          },
        },
        update: {},
        create: {
          blogId: blog.id,
          name: category.name,
          slug: `${category.slug}-${blog.slug}`,
        },
      })
    }
  }

  // Create or find a default author
  const passwordHash = await bcrypt.hash('admin123', 10)
  const defaultAuthor = await prisma.user.upsert({
    where: { email: 'admin@seho.com' },
    update: {},
    create: {
      email: 'admin@seho.com',
      nickname: 'admin',
      passwordHash,
      role: 'ADMIN',
    },
  })

  // Create dummy posts for each blog
  const studioCpa = await prisma.blog.findUnique({ where: { slug: 'studio-cpa' } })
  const swingCompany = await prisma.blog.findUnique({ where: { slug: 'swing-company' } })
  const sereinCafe = await prisma.blog.findUnique({ where: { slug: 'serein-cafe' } })

  if (studioCpa) {
    const studioCpaPosts = [
      {
        slug: 'understanding-financial-statements',
        title: '재무제표의 기초: 차변과 대변의 이해',
        content: `![회계](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80)

# 재무제표의 기초

재무회계의 가장 기본이 되는 차변(Debit)과 대변(Credit)에 대해 알아봅시다.

## 차변과 대변이란?

모든 거래는 차변과 대변으로 기록됩니다. 이는 복식부기의 핵심 원리입니다.

- **차변**: 자산의 증가, 비용의 발생
- **대변**: 부채의 증가, 자본의 증가, 수익의 발생

## 실전 예제

예를 들어, 100만원을 현금으로 받았다면:
- 차변: 현금 1,000,000원
- 대변: 매출 1,000,000원

이렇게 항상 차변과 대변의 합계는 일치해야 합니다.`,
        excerpt: '재무회계의 기초인 차변과 대변의 개념을 쉽게 설명합니다.',
      },
      {
        slug: 'tax-planning-tips',
        title: '스타트업을 위한 세무 계획 가이드',
        content: `![스타트업](https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80)

# 스타트업 세무 계획

초기 스타트업이 꼭 알아야 할 세무 계획에 대해 정리했습니다.

## 1. 법인 설립 시기

개인사업자로 시작할지, 법인으로 시작할지는 매우 중요한 결정입니다.

### 개인사업자
- 간편한 설립 절차
- 낮은 초기 비용
- 소득세 적용

### 법인
- 법인세 적용 (더 유리할 수 있음)
- 대외 신용도 향상
- 투자 유치 용이

## 2. 세금 공제 활용

연구개발비, 인건비 등 다양한 공제 혜택을 놓치지 마세요!`,
        excerpt: '스타트업 창업자가 알아야 할 필수 세무 지식을 공유합니다.',
      },
      {
        slug: 'financial-analysis-basics',
        title: '재무분석의 기초: 비율분석 완벽 가이드',
        content: `![재무분석](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80)

# 재무분석의 기초

기업의 재무 상태를 파악하는 핵심 도구, 재무비율 분석에 대해 알아봅니다.

## 유동성 비율

### 유동비율
- 계산식: 유동자산 / 유동부채
- 적정 수준: 200% 이상
- 단기 지급능력을 나타냅니다

## 수익성 비율

### ROE (자기자본이익률)
경영성과를 측정하는 가장 중요한 지표 중 하나입니다.`,
        excerpt: '재무비율 분석을 통해 기업의 재무상태를 파악하는 방법을 설명합니다.',
      },
      {
        slug: 'bookkeeping-automation',
        title: '회계 자동화: 업무 효율을 높이는 도구들',
        content: `![자동화](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)

# 회계 자동화

반복적인 회계 업무를 자동화하여 효율성을 높이는 방법을 소개합니다.

## 추천 도구

### 전자세금계산서
- 국세청 홈택스
- 자동 발행 시스템

### 회계 프로그램
- 더존 SmartA
- 삼쩜삼

자동화로 업무 시간을 50% 이상 절약할 수 있습니다!`,
        excerpt: '회계 업무를 자동화하여 생산성을 높이는 실전 팁을 공유합니다.',
      },
      {
        slug: 'year-end-tax-settlement',
        title: '연말정산 완벽 가이드',
        content: `![연말정산](https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80)

# 연말정산 완벽 가이드

13월의 보너스를 받기 위한 연말정산 전략을 알아봅니다.

## 주요 공제 항목

### 1. 의료비 공제
- 총급여 3% 초과분
- 가족 의료비 포함

### 2. 교육비 공제
- 본인: 전액
- 자녀: 1인당 한도 있음

미리 준비하면 환급액을 최대화할 수 있습니다!`,
        excerpt: '연말정산 환급액을 최대화하는 전략과 팁을 소개합니다.',
      },
      {
        slug: 'internal-control-guide',
        title: '내부회계관리제도 구축 가이드',
        content: `![내부통제](https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80)

# 내부회계관리제도

상장사에 필수인 내부회계관리제도 구축 방법을 설명합니다.

## 주요 구성 요소

### 1. 통제환경
조직 문화와 경영진의 의지

### 2. 위험평가
재무보고 위험 식별 및 평가

### 3. 통제활동
실제 통제 절차 수립

체계적인 접근이 성공의 열쇠입니다.`,
        excerpt: '내부회계관리제도의 핵심 요소와 구축 방법을 안내합니다.',
      },
    ]

    for (const post of studioCpaPosts) {
      await prisma.post.upsert({
        where: {
          blogId_slug: {
            blogId: studioCpa.id,
            slug: post.slug,
          },
        },
        update: {},
        create: {
          ...post,
          blogId: studioCpa.id,
          authorId: defaultAuthor.id,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    }
  }

  if (swingCompany) {
    const swingCompanyPosts = [
      {
        slug: 'intro-to-bebop',
        title: '비밥(Bebop)의 탄생: 재즈의 혁명',
        content: `![재즈](https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80)

# 비밥의 탄생

1940년대, 재즈는 큰 변화를 맞이했습니다. 바로 비밥(Bebop)의 등장입니다.

## 비밥이란?

비밥은 스윙 재즈의 상업화에 반발하여 탄생한 혁명적인 스타일입니다.

### 주요 특징
- 빠른 템포
- 복잡한 화성 진행
- 즉흥 연주 중심
- 소규모 앙상블

## 대표 아티스트

### Charlie Parker
색소폰의 마법사. 그의 연주는 비밥의 정수를 보여줍니다.

### Dizzy Gillespie
트럼펫으로 새로운 경지를 개척했습니다.

비밥은 단순히 음악 스타일을 넘어, 예술가의 자유와 창의성을 상징합니다.`,
        excerpt: '재즈 역사를 바꾼 비밥의 탄생과 그 의미를 탐구합니다.',
      },
      {
        slug: 'jazz-for-beginners',
        title: '재즈 입문자를 위한 추천 앨범 5선',
        content: `![앨범](https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80)

# 재즈 입문 추천 앨범

처음 재즈를 듣는다면 이 앨범들부터 시작해보세요.

## 1. Kind of Blue - Miles Davis
재즈의 교과서. 모달 재즈의 걸작입니다.

## 2. Time Out - Dave Brubeck Quartet
"Take Five"로 유명한 앨범. 쉽게 들을 수 있습니다.

## 3. A Love Supreme - John Coltrane
영적인 깊이가 느껴지는 명반.

## 4. Moanin' - Art Blakey & The Jazz Messengers
하드 밥의 정수. 그루비한 리듬이 매력적입니다.

## 5. Getz/Gilberto - Stan Getz & João Gilberto
보사노바 재즈의 완성. "The Girl from Ipanema"가 수록되어 있습니다.

각 앨범마다 다른 매력이 있으니, 천천히 즐겨보세요!`,
        excerpt: '재즈를 처음 접하는 분들을 위한 필청 앨범 가이드입니다.',
      },
      {
        slug: 'swing-dance-basics',
        title: '스윙 댄스 입문: 린디합의 세계',
        content: `![댄스](https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80)

# 스윙 댄스의 세계

스윙 음악과 함께 즐기는 린디합(Lindy Hop) 댄스에 대해 알아봅니다.

## 린디합이란?

1920-30년대 할렘에서 탄생한 파트너 댄스입니다.

### 기본 스텝
- **스윙아웃**: 가장 기본이 되는 스텝
- **찰스턴**: 에너지 넘치는 솔로 스텝
- **텍사스 토미**: 회전이 들어간 화려한 동작

## 스윙 댄스의 매력

음악에 맞춰 파트너와 소통하며 춤추는 즐거움은 말로 표현하기 어렵습니다.`,
        excerpt: '활기차고 즐거운 스윙 댄스의 기초를 소개합니다.',
      },
      {
        slug: 'jazz-club-guide',
        title: '서울 재즈 클럽 가이드',
        content: `![재즈클럽](https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80)

# 서울 재즈 클럽

라이브 재즈를 즐길 수 있는 서울의 명소들을 소개합니다.

## 추천 클럽

### 1. 재즈스토리
신사동에 위치한 아늑한 재즈 클럽. 매주 금요일 라이브 공연.

### 2. 블루노트 서울
세계적인 재즈 클럽 체인의 서울 지점. 해외 아티스트 공연 多.

### 3. 웨일즈스토리
홍대의 재즈 펍. 합리적인 가격과 편안한 분위기.

라이브 재즈의 생생한 에너지를 직접 느껴보세요!`,
        excerpt: '서울에서 라이브 재즈를 즐길 수 있는 곳들을 안내합니다.',
      },
      {
        slug: 'saxophone-journey',
        title: '색소폰 연주 시작하기',
        content: `![색소폰](https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80)

# 색소폰 연주 여정

재즈의 꽃, 색소폰 연주를 시작하는 방법을 안내합니다.

## 색소폰 선택하기

### 알토 색소폰
가장 대중적이고 입문하기 좋습니다.

### 테너 색소폰
깊고 풍부한 소리가 매력적입니다.

## 기초 연습

### 1. 롱톤
긴 음을 안정적으로 내는 연습

### 2. 스케일
다양한 조성의 음계 연습

### 3. 스탠다드 넘버
"Autumn Leaves" 같은 쉬운 곡부터

꾸준한 연습이 실력 향상의 지름길입니다!`,
        excerpt: '색소폰 연주를 처음 시작하는 분들을 위한 가이드입니다.',
      },
      {
        slug: 'jazz-history',
        title: '재즈의 역사: 뉴올리언스에서 현대까지',
        content: `![역사](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80)

# 재즈의 역사

100년이 넘는 재즈의 풍부한 역사를 살펴봅니다.

## 시대별 특징

### 1900-20년대: 뉴올리언스 재즈
- 집단 즉흥 연주
- 루이 암스트롱의 등장

### 1930-40년대: 스윙 시대
- 빅 밴드의 전성기
- 베니 굿맨, 듀크 엘링턴

### 1940-50년대: 비밥 혁명
- 찰리 파커, 디지 길레스피
- 복잡한 화성과 빠른 템포

### 1950-60년대: 쿨 재즈 & 하드 밥
- 마일스 데이비스의 "Kind of Blue"
- 웨스트 코스트의 쿨한 사운드

### 1960-70년대: 프리 재즈 & 퓨전
- 존 콜트레인의 실험
- 일렉트릭 악기의 도입

재즈는 끊임없이 진화하는 살아있는 음악입니다.`,
        excerpt: '뉴올리언스에서 시작된 재즈의 100년 역사를 정리합니다.',
      },
    ]

    for (const post of swingCompanyPosts) {
      await prisma.post.upsert({
        where: {
          blogId_slug: {
            blogId: swingCompany.id,
            slug: post.slug,
          },
        },
        update: {},
        create: {
          ...post,
          blogId: swingCompany.id,
          authorId: defaultAuthor.id,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    }
  }

  if (sereinCafe) {
    const sereinCafePosts = [
      {
        slug: 'perfect-cup-of-coffee',
        title: '완벽한 한 잔을 위한 커피 추출 가이드',
        content: `![커피](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80)

# 완벽한 커피 한 잔

집에서도 카페 못지않은 커피를 즐길 수 있습니다.

## 좋은 원두 선택하기

신선한 원두가 가장 중요합니다. 로스팅 날짜를 확인하세요.

### 로스팅 레벨
- **라이트**: 산미가 강하고 꽃향기
- **미디엄**: 균형잡힌 맛
- **다크**: 쓴맛과 바디감

## 추출 방법

### 핸드드립
가장 섬세한 맛을 낼 수 있습니다.
1. 원두 15g, 물 250ml 비율
2. 93°C 정도의 물
3. 천천히 원을 그리며 부어주기

### 프렌치 프레스
바디감이 풍부한 커피를 원한다면.

커피는 과학이자 예술입니다. 자신만의 레시피를 찾아가는 과정을 즐겨보세요!`,
        excerpt: '집에서 카페 수준의 커피를 만드는 방법을 소개합니다.',
      },
      {
        slug: 'slow-living-philosophy',
        title: '느리게 살기: 여유로운 삶의 철학',
        content: `![휴식](https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80)

# 느리게 살기

빠른 세상에서 의도적으로 속도를 늦추는 것의 가치.

## 슬로우 라이프란?

단순히 느리게 사는 것이 아닙니다. 의미 있는 것에 집중하는 삶입니다.

### 실천 방법

#### 1. 멀티태스킹 줄이기
한 번에 한 가지 일에만 집중하세요.

#### 2. 디지털 디톡스
하루에 정해진 시간만 스마트폰 사용하기.

#### 3. 천천히 먹기
음식의 맛과 향을 음미하며 식사하기.

#### 4. 산책하기
목적 없이 걷는 시간을 가져보세요.

## 느림의 가치

속도를 늦추면 보이지 않던 것들이 보입니다.
주변의 작은 아름다움, 사람들의 미소, 계절의 변화...

서두르지 마세요. 인생은 목적지가 아닌 여정입니다.`,
        excerpt: '바쁜 일상 속에서 의미있는 여유를 찾는 방법을 나눕니다.',
      },
      {
        slug: 'afternoon-tea-time',
        title: '오후의 티타임: 차 한 잔의 여유',
        content: `![차](https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80)

# 오후의 티타임

바쁜 일상 속 잠시 멈추고 차 한 잔의 여유를 즐겨보세요.

## 차의 종류

### 홍차
진한 맛과 향. 우유나 레몬을 곁들여도 좋습니다.

### 녹차
은은한 풀향과 깔끔한 맛. 일본의 말차도 인기.

### 허브티
카페인이 없어 저녁에도 부담없이. 캐모마일, 페퍼민트 등.

## 티타임 즐기기

조용한 음악을 틀고, 좋아하는 책이나 잡지를 펼쳐보세요.
완벽한 오후의 시간입니다.`,
        excerpt: '차 한 잔과 함께하는 여유로운 오후 시간을 제안합니다.',
      },
      {
        slug: 'cozy-reading-corner',
        title: '나만의 독서 공간 만들기',
        content: `![독서](https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80)

# 나만의 독서 공간

집에서 아늑한 독서 공간을 만드는 방법을 소개합니다.

## 필수 요소

### 1. 편안한 의자
장시간 앉아도 불편하지 않은 의자가 중요합니다.

### 2. 적절한 조명
눈의 피로를 줄여주는 따뜻한 조명.

### 3. 책장
손쉽게 책을 꺼낼 수 있는 위치에.

### 4. 작은 테이블
커피나 차를 올려놓을 공간.

## 분위기 만들기

- 부드러운 쿠션
- 따뜻한 담요
- 은은한 향초
- 조용한 음악

완벽한 독서 공간이 완성됩니다.`,
        excerpt: '집에서 편안하게 독서를 즐길 수 있는 공간 만들기 팁입니다.',
      },
      {
        slug: 'seasonal-mood',
        title: '계절을 느끼는 작은 습관들',
        content: `![계절](https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80)

# 계절을 느끼는 습관

바쁜 일상 속에서 계절의 변화를 느끼는 작은 습관들.

## 봄

### 꽃구경
벚꽃, 개나리, 진달래... 봄꽃을 찾아 산책.

### 봄나물
냉이, 달래 같은 제철 나물로 봄을 맛보기.

## 여름

### 수박과 아이스크림
더위를 식히는 여름의 맛.

### 해변 산책
파도 소리를 들으며 걷는 저녁.

## 가을

### 단풍 구경
알록달록 물든 산과 나무.

### 따뜻한 차
쌀쌀해진 날씨에 따뜻한 차 한 잔.

## 겨울

### 첫눈
창밖으로 내리는 하얀 눈.

### 온천
추운 겨울, 따뜻한 온천에서의 휴식.

계절의 변화를 느끼며 살아가세요.`,
        excerpt: '사계절의 아름다움을 일상에서 느끼는 방법들을 소개합니다.',
      },
      {
        slug: 'mindful-living',
        title: '마음챙김: 현재를 살아가는 법',
        content: `![명상](https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80)

# 마음챙김 명상

현재 이 순간에 집중하는 마음챙김 명상을 소개합니다.

## 마음챙김이란?

과거나 미래가 아닌, 지금 이 순간에 온전히 집중하는 것.

## 실천 방법

### 호흡 명상
1. 편안한 자세로 앉기
2. 눈을 감고 호흡에 집중
3. 들숨과 날숨을 관찰
4. 생각이 떠오르면 다시 호흡으로

### 걷기 명상
천천히 걸으며 발의 감각에 집중합니다.

### 먹기 명상
음식의 색, 향, 맛, 식감을 천천히 느껴봅니다.

## 효과

- 스트레스 감소
- 집중력 향상
- 감정 조절 능력 향상
- 내면의 평화

하루 10분, 마음챙김으로 삶의 질이 달라집니다.`,
        excerpt: '현재에 집중하여 평화를 찾는 마음챙김 명상을 안내합니다.',
      },
    ]

    for (const post of sereinCafePosts) {
      await prisma.post.upsert({
        where: {
          blogId_slug: {
            blogId: sereinCafe.id,
            slug: post.slug,
          },
        },
        update: {},
        create: {
          ...post,
          blogId: sereinCafe.id,
          authorId: defaultAuthor.id,
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    }
  }

  console.log(`✅ Created ${defaultAuthor.nickname} as default author`)
  console.log('✅ Created 18 dummy posts (6 per blog)')
}

main()
  .then(async () => {
    console.log('✅ Seed data applied successfully')
  })
  .catch(async (error) => {
    console.error('❌ Seed failed', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
