# 세호 Frontend

Next.js 14 (App Router) 기반 프론트엔드 애플리케이션

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 시작하기

### 설치

```bash
pnpm install
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
```

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 에서 확인

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/              # App Router 페이지
│   │   ├── (auth)/      # 인증 관련 페이지
│   │   ├── (main)/      # 메인 페이지들
│   │   ├── api/         # API Routes
│   │   └── layout.tsx   # Root Layout
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── ui/          # shadcn/ui 컴포넌트
│   │   ├── layout/      # 레이아웃 컴포넌트
│   │   └── features/    # 기능별 컴포넌트
│   ├── lib/             # 유틸리티 함수
│   │   ├── api/         # API 클라이언트
│   │   ├── hooks/       # Custom Hooks
│   │   └── utils/       # 헬퍼 함수
│   ├── stores/          # Zustand 스토어
│   ├── types/           # TypeScript 타입 정의
│   └── styles/          # 글로벌 스타일
├── public/              # 정적 파일
└── package.json
```

## 코딩 컨벤션

### 파일 명명 규칙
- 컴포넌트: `PascalCase.tsx`
- 유틸리티: `camelCase.ts`
- 스타일: `kebab-case.css`

### 컴포넌트 구조
```typescript
// 1. Imports
import { useState } from 'react';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export function Component({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{title}</div>;
}
```

## 테스트

```bash
# 유닛 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 커버리지
pnpm test:coverage
```

## 배포

### Vercel

```bash
vercel deploy
```

### Docker

```bash
docker build -t seho-frontend .
docker run -p 3000:3000 seho-frontend
```

## 문제 해결

### 일반적인 문제

**Q: 개발 서버가 시작되지 않아요**
A: `pnpm install`로 의존성을 다시 설치해보세요.

**Q: 환경 변수가 작동하지 않아요**
A: `.env.local` 파일이 제대로 설정되었는지 확인하고 서버를 재시작하세요.

## 관련 문서

- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

