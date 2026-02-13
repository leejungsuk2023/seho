  # Multi-Blog Platform PRD

  This is a code bundle for Multi-Blog Platform PRD. The original project is available at https://www.figma.com/design/Xl87ft9iuwudV7xRdKN5CV/Multi-Blog-Platform-PRD.

  ## 기술 스택

  - **Frontend**: React 18 + Vite
  - **UI**: Radix UI + Tailwind CSS
  - **Database**: Supabase (PostgreSQL)
  - **Authentication**: Supabase Auth
  - **Routing**: React Router v7

  ## 시작하기

  ### 1. 의존성 설치

  ```bash
  npm i
  ```

  ### 2. Supabase 설정

  프로젝트는 Supabase를 백엔드로 사용합니다. 설정 방법은 [Supabase 설정 가이드](./docs/SUPABASE_SETUP.md)를 참고하세요.

  빠른 설정:
  1. [Supabase](https://app.supabase.com)에서 프로젝트 생성
  2. `supabase/schema.sql` 파일을 SQL Editor에서 실행
  3. `.env.example`을 `.env`로 복사하고 Supabase 프로젝트 정보 입력

  ```bash
  cp .env.example .env
  # .env 파일을 열어서 Supabase URL과 API 키를 입력하세요
  ```

  ### 3. 개발 서버 실행

  ```bash
  npm run dev
  ```

  ## 프로젝트 구조

  ```
  src/
  ├── app/              # 메인 애플리케이션
  │   ├── components/   # 재사용 컴포넌트
  │   ├── pages/        # 페이지 컴포넌트
  │   ├── data/         # 타입 정의 및 mockData
  │   └── routes.tsx    # 라우팅 설정
  ├── lib/              # 유틸리티 및 API
  │   ├── supabase.ts   # Supabase 클라이언트
  │   ├── supabase-api.ts # Supabase API 서비스 레이어
  │   └── auth.ts       # 인증 유틸리티
  └── styles/           # 스타일 파일
  ```

  ## 주요 기능

  - ✅ 멀티 블로그 플랫폼 (4개의 독립적인 블로그)
  - ✅ 역할 기반 권한 관리 (VIEWER, WRITER, ADMIN)
  - ✅ 포스트 작성/수정/삭제
  - ✅ 댓글 시스템
  - ✅ 카테고리 관리 (계층 구조 지원)
  - ✅ 검색 기능
  - ✅ On Air 통합 피드

  ## 문서

  - [PRD](./docs/PRD.md) - 제품 요구사항 문서
  - [개발 계획](./docs/DEVELOPMENT_PLAN.md) - 개발 계획서
  - [프론트엔드 디자인 스펙](./docs/FRONTEND_DESIGN_SPEC.md) - 디자인 스펙
  - [Supabase 설정 가이드](./docs/SUPABASE_SETUP.md) - Supabase 설정 방법

  