# SEHO 블로그 플랫폼 개발 계획서
## MVP v0.1 개발 로드맵

**문서 목적**: 세호(SEHO) MVP v0.1을 출시하기 위한 개발 원칙, 마일스톤, 작업 세부 내용을 단일 문서로 관리합니다.  
**프로젝트**: 세호 (SEHO) - 3개의 블로그 공간 플랫폼  
**버전**: MVP v0.1  
**작성일**: 2025-10-20  
**최종 업데이트**: 2025-10-20

---

## 📋 목차
1. [현재 상태 요약](#현재-상태-요약)
2. [개발 원칙](#개발-원칙)
3. [마일스톤 개요](#마일스톤-개요)
4. [Phase / 마일스톤 상세](#phase--마일스톤-상세)
5. [진행 관리 제안](#진행-관리-제안)
6. [리스크 관리](#리스크-관리)
7. [다음 단계 (v1.0 이후)](#다음-단계-v10-이후)

---

## 현재 상태 요약
- Next.js 기반 퍼블릭 화면(홈, 블로그 상세, On Air)과 공용 레이아웃/버튼 컴포넌트가 구현된 상태입니다.
- 블로그/포스트 데이터는 Prisma 기반 API로 제공되며, 쓰기 기능(작성·수정·삭제)과 댓글·검색 기능이 구현된 상태입니다.
- 메인/On Air/블로그/포스트 화면이 최신 UI 가이드(미니멀, 색상, 타이포그래피)에 맞게 개편되었습니다.
- Auth.js(NextAuth) 기반 이메일/비밀번호 인증, 프로필 API 및 보호 라우트가 구현되어 있습니다.
- 관리자 사용자 목록/역할 변경 API와 기본 UI가 구축되어 있으며, 역할 이력 조회는 추후 확장 예정입니다.
- 프로젝트 구조는 단일 Next.js 애플리케이션으로 통합됐으며 `backend/` 폴더는 참고용 아카이브로 유지중입니다.
- Tailwind CSS 4, ESLint/Prettier 등 기본 개발 환경이 세팅되어 있으며 pnpm 기반 스크립트로 통일했습니다.

---

## 개발 원칙

### 1. MVP First
- 핵심 기능에 집중 (3개 블로그, 포스트, 댓글, 관리자)
- 부가 기능은 v1.0 이후로 연기 (소셜 로그인, 이미지 업로드, 알림 등)

### 2. 단일 프로젝트 구조
- NestJS 백엔드 제거, Next.js 단일 프로젝트로 통합
- API Routes (Route Handlers) 사용
- Next.js 앱이 리포지토리 루트에 위치

### 3. 점진적 개발
- 각 Phase 완료 후 기능 테스트
- Phase 간 명확한 의존성 관리
- 매 Phase 종료 시 배포 가능한 상태 유지

### 4. 문서 우선
- 코드 작성 전 API 명세 확정
- 컴포넌트 설계 문서화
- 변경사항 즉시 문서 업데이트

---

## 마일스톤 개요

| 번호 | 마일스톤(Phase) | 핵심 목표 | 주요 산출물 |
|------|-----------------|-----------|-------------|
| M0 / Phase 0 | 프로젝트 재정비 | 단일 Next.js 프로젝트 기반 정리 | 통합된 폴더 구조, Tailwind/ESLint 설정, pnpm 스크립트 |
| M1 / Phase 1 | 인증 시스템 | 이메일/비밀번호 회원가입·로그인 플로우 완성 | Auth.js 설정, 가입/로그인 API, 프로필 기초 |
| M2 / Phase 2 | 역할 및 권한 | ADMIN/WRITER/USER 권한 제어 | 권한 체크 로직, 관리자 UI 기초, 역할 변경 API |
| M3 / Phase 3 | 블로그·포스트 | 블로그 피드와 포스트 CRUD, On Air 통합 | 포스트 목록/상세/작성 UI·API, 블로그 관리 |
| M4 / Phase 4 | 댓글 & 상호작용 | 댓글 CRUD와 사용자 활동 보기 | 댓글 API/UI, 본인 권한 체크, 활동 피드 |
| M5 / Phase 5 | 관리자 & 모더레이션 | 관리자 대시보드 및 모더레이션 기능 | 사용자/포스트/댓글 관리 화면, KPI 카드 |
| M6 / Phase 6-8 | 품질 보강 & 배포 | 테스트, 접근성, 배포 준비 | 테스트 스위트, 접근성 개선, Vercel 배포 |

> 참고: 본 문서는 기존 Phase 0~8 구조를 유지하되, 상위 마일스톤과의 매핑을 위 표에서 제공하여 전체 흐름을 한눈에 파악할 수 있도록 합니다.

---

## Phase / 마일스톤 상세

### Phase 0: 프로젝트 초기화 ✅
**목표**: 개발 환경 구성 및 기본 구조 셋업

**주요 작업**:
- [x] 기존 backend/ 폴더 제거 결정
- [x] Next.js 앱을 루트로 통합 (기존 `frontend/` 자산 정리)
- [x] Tailwind CSS 4 설정
- [x] ESLint, Prettier 설정
- [x] Prisma 설정 및 초기 스키마 작성
- [x] 데이터베이스 마이그레이션 (3개 블로그 시드 데이터)
- [ ] GitHub repository 정리 (불필요한 PDF 삭제 완료)

**완료 기준**:
- `pnpm dev` 실행 시 Next.js 개발 서버 정상 구동
- Prisma Studio로 DB 접속 및 3개 블로그 데이터 확인
- Tailwind CSS 적용 확인

---

### Phase 1: 인증 시스템
**목표**: 사용자 회원가입/로그인 구현

#### 1.1 Auth.js 설정
- [x] Auth.js(NextAuth) 설치 및 기본 설정
- [x] Credentials Provider 구성
- [x] JWT 전략 설정
- [x] Session 관리

#### 1.2 회원가입 기능
- [x] 회원가입 UI (`/auth/sign-up`)
  - 이메일, 비밀번호, 닉네임 입력 폼
  - React Hook Form + Zod 검증
- [x] 회원가입 API (`POST /api/auth/signup`)
  - 이메일 중복 체크
  - 비밀번호 bcrypt 암호화
  - User 생성 (기본 role: USER)
- [x] 비밀번호 강도 검증 (최소 8자, 영문+숫자)

#### 1.3 로그인 기능
- [x] 로그인 UI (`/auth/sign-in`)
- [x] 로그인 API (Auth.js 통합)
- [x] 세션 유지 및 토큰 갱신
- [x] 보호된 라우트 미들웨어 (`middleware.ts`)

#### 1.4 프로필 기본 기능
- [x] 프로필 조회 API (`GET /api/users/[id]`)
- [x] 프로필 수정 API (`PATCH /api/users/[id]`)
- [x] 프로필 페이지 UI (`/profile`)

**완료 기준**:
- 회원가입 → 로그인 → 프로필 조회 플로우 동작
- 로그인 없이 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
- 세션 유지 (새로고침 해도 로그인 상태 유지)

**예상 시간**: 40시간

---

### Phase 2: 역할 및 권한 시스템
**목표**: 3단계 역할(ADMIN, WRITER, USER) 구현 및 권한 제어

#### 2.1 역할 관리 API
- [x] 사용자 목록 API (`GET /api/admin/users`)
  - page/limit 페이지네이션 + role 필터 + 검색(이메일/닉네임)
  - 응답 필드: id, email, nickname, role, createdAt, updatedAt, postCount, commentCount
- [x] 역할 변경 API (`PATCH /api/admin/users/[id]/role`)
  - ADMIN만 접근 가능, 동일 역할로 변경 시 예외 처리
  - RoleHistory 로그 작성(변경자, 변경 사유 optional)
- [ ] 역할 변경 이력 조회 API (`GET /api/admin/users/[id]/role-history`) *(선택)*

#### 2.2 권한 가드 구현
- [x] 서버 권한 유틸 (`lib/auth/permissions.ts`)
  - `canManageUsers`, `canEditPost(user, post)`, `canWriteToBlog(user, blogSlug)` 등 함수화
- [x] 클라이언트 권한 가드 컴포넌트
  - `<RequireRole roles={['ADMIN']}>`, `<RequireWriter blogSlug="...">` 등
- [x] 미들웨어 보강
  - `/admin` 하위 라우트에서 권한 부족 시 전용 403 페이지
  - `/blogs/[slug]/write`, `/blogs/[slug]/edit/[id]` 등 WRITER 이상만 접근 허용

#### 2.3 관리자 UI 기초
- [x] 관리자 레이아웃 (`/admin/layout.tsx`)
  - Sidebar: Dashboard, Users, Posts, Comments, Blogs
  - 현재 로그인 관리자 정보/로그아웃 버튼
- [x] 사용자 관리 페이지 (`/admin/users/page.tsx`)
  - 서버 컴포넌트에서 사용자 목록 fetch → 클라이언트 테이블 전달
  - 역할 변경 드롭다운 + 토스트 피드백
  - 검색 바, 역할 필터, 페이지네이션 UI
- [x] 접근 제어 UX
  - 비로그인 → 로그인 페이지 리다이렉트
  - 권한 부족 → 안내 메시지 + 홈으로 이동 버튼

**완료 기준**:
- ADMIN이 사용자를 WRITER로 승급 가능
- ADMIN이 관리자 대시보드 조회 가능
- USER와 WRITER가 `/admin` 접근 시 403 에러

**예상 시간**: 30시간

---

### Phase 3: 블로그 및 포스트 시스템
**목표**: 3개 블로그 홈, 포스트 CRUD, On Air 피드

#### 3.1 블로그 인덱스
- [x] 블로그 목록 API (`GET /api/blogs`)
  - slug/name/description/visibility/포스트 수 반환
  - 캐싱 전략(e.g. revalidate) 정의
- [x] 홈 페이지 (`/page.tsx`) 실데이터 연결
  - 블로그 카드에 최신 포스트 수/컬러 반영
  - 숏컷 링크 → 각 블로그 페이지

#### 3.2 블로그 홈 (피드)
- [x] 포스트 목록 API (`GET /api/posts`)
  - 필수 쿼리: blogSlug
  - 선택: categorySlug, tag, page, pageSize(<=20), status(admin only)
  - 응답: id, title, slug, excerpt, publishedAt, author, tag 목록
- [x] 블로그 홈 페이지 (`/blogs/[slug]/page.tsx`)
  - Server Component로 목록 Paginate
  - 카테고리 탭/태그 필터 UI
  - Empty state / 로딩 상태
- [x] 블로그 정보 API (`GET /api/blogs/[slug]`) → 설명, 배너, 카테고리 목록 제공

#### 3.3 포스트 작성
- [x] Markdown 에디터 라이브러리 선택 및 통합 (예: @uiw/react-md-editor)
- [x] 포스트 작성 페이지 (`/blogs/[slug]/write`)
  - 제목/슬러그 미리보기, 카테고리 선택, 태그 입력, 본문 작성
  - draft 저장 버튼, 발행 버튼
- [x] 포스트 작성 API (`POST /api/posts`)
  - slug unique(블로그별) 생성, excerpt/truncated body 저장
  - 권한 검증: WRITER 이상, canWriteToBlog
  - 태그 upsert 후 연결

#### 3.4 포스트 상세
- [x] 포스트 상세 API (`GET /api/posts/[slug]`)
  - blogSlug + postSlug 매핑, author, category, tags, 관련글 3개 포함
- [x] 포스트 상세 페이지 (`/blogs/[slug]/post/[postSlug]`)
  - Markdown 렌더링, 메타태그 설정
  - 권한자에게만 수정/삭제 드롭다운 노출
- [ ] 조회수 증가 전략 (향후 Phase 4 확장 예정, 일단 DB counter 필드 준비)

#### 3.5 포스트 수정/삭제
- [x] 포스트 수정 페이지 (`/blogs/[slug]/edit/[id]`)
  - 기존 데이터 로드
  - 수정 권한 검증 (작성자 or ADMIN)
- [x] 포스트 수정 API (`PATCH /api/posts/[id]`)
- [x] 포스트 삭제 API (`DELETE /api/posts/[id]`)

#### 3.6 On Air 피드
- [x] 통합 피드 API (`GET /api/on-air`)
  - 최신 N개 포스트(블로그 합산) 반환, 캐싱 60초
- [x] On Air 페이지 (`/on-air/page.tsx`)
  - 전체/블로그별 필터
  - 실시간 느낌의 UI + Empty state

#### 3.7 블로그 이미지 및 디자인 관리
- [x] 블로그 설정 업데이트 API (`PATCH /api/blogs/[id]`)
  - 이미지 URL 업데이트 (coverImageUrl, logoImageUrl, thumbnailUrl)
  - 디자인 설정 (primaryColor, headingFont, bodyFont, layoutStyle, sidebarPosition)
- [x] 블로그 관리 UI (`/admin/blogs`)
  - 3개 블로그 탭 (Serein Cafe, Studio CPA, Swing Company)
  - 이미지 URL 입력 필드 + 미리보기
  - 색상 피커 (primaryColor)
  - 폰트 선택 드롭다운
  - 레이아웃 옵션 선택
  - 실시간 저장

#### 3.8 카테고리 관리
- [x] 카테고리 CRUD API (`/api/admin/categories`)
  - 블로그별 카테고리 목록
  - 추가/수정/삭제 (ADMIN만)
- [x] 카테고리 관리 섹션 (블로그 관리 UI 내)

**완료 기준**:
- 블로그 홈에서 포스트 목록 조회
- WRITER가 모든 블로그에 글 작성 가능
- 작성한 포스트가 상세 페이지에서 Markdown 렌더링
- On Air에서 전체 최신글 확인

**예상 시간**: 60시간

---

### Phase 4: 댓글 시스템
**목표**: 포스트 댓글 작성/수정/삭제

#### 4.1 댓글 작성
- [x] 댓글 입력 폼 (포스트 상세 하단)
  - 텍스트 영역 (최대 500자)
  - 로그인 필요 안내
- [x] 댓글 작성 API (`POST /api/comments`)
  - postId, content, authorId
- [x] Optimistic UI / 캐시 갱신

#### 4.2 댓글 목록
- [x] 댓글 목록 API (`GET /api/comments?postId=xxx`)
- [x] 댓글 리스트 컴포넌트
  - 작성자, 내용, 시간 (상대 시간)
  - 수정/삭제 버튼 (권한자에게만)
- [x] 최신순 정렬 (대댓글 구조는 추후 확장)

#### 4.3 댓글 수정/삭제
- [x] 댓글 수정 API (`PATCH /api/comments/[id]`)
- [x] 댓글 삭제 API (`DELETE /api/comments/[id]`)
  - 권한: 작성자 or ADMIN
- [x] 댓글 수정 UI (인라인 편집)

**완료 기준**:
- 로그인 사용자가 댓글 작성 가능 ✔️
- 작성 즉시 화면에 반영 (Optimistic UI) ✔️
- 본인 댓글 수정/삭제 가능 ✔️
- ADMIN이 모든 댓글 삭제 가능 ✔️

**예상 시간**: 25시간 → 실제 진행 완료

---

### Phase 5: 검색 기능
**목표**: 포스트 검색

#### 5.1 검색 기능
- [x] 검색 페이지 (`/search`)
  - 검색어 입력
  - 검색 결과 카드 리스트
  - 블로그별 필터
- [x] 검색 API (`GET /api/search?q=keyword`)
  - 제목, 본문 LIKE 검색 (Case-insensitive)
  - PUBLISHED만 검색
- [x] Header 검색 바 추가

**완료 기준**:
- 검색어 입력 시 관련 포스트 조회 ✔️
- 검색 결과가 없을 경우 안내 메시지 제공 ✔️
- 검색 결과 클릭 시 해당 포스트 상세로 이동 ✔️

**예상 시간**: 15시간 → 완료

---

### Phase 6: 관리자 대시보드
**목표**: 관리자 대시보드 및 모더레이션

#### 6.1 대시보드
- [x] 대시보드 페이지 (`/admin/page.tsx`)
  - KPI 카드 (사용자 수, 포스트 수, 댓글 수, 숨김 항목)
  - 최근 포스트 테이블 (10개)
  - 최근 댓글 테이블 (10개)
- [x] 통계 API (`GET /api/admin/stats`)

#### 6.2 포스트 관리
- [x] 포스트 관리 페이지 (`/admin/posts`)
  - 전체 포스트 목록
  - 상태별 필터 (PUBLISHED/DRAFT/ARCHIVED)
  - 블로그별 필터
  - 제목/내용 검색
- [x] 포스트 숨김/복구 액션
  - 상태 변경 API (`PATCH /api/admin/posts/[id]/status`)
  - 모더레이션 로그 기록 *(추후 확장 예정)*

#### 6.3 댓글 관리
- [x] 댓글 관리 페이지 (`/admin/comments`)
  - 전체 댓글 목록
  - 포스트 제목 표시
  - 댓글 숨김/삭제 액션
- [x] 댓글 모더레이션 API (`PATCH /api/admin/comments/[id]/status`)

#### 6.4 블로그/카테고리 관리
- [x] 블로그 관리 페이지 (`/admin/blogs`)
  - 블로그 이름, 설명, 디자인 속성 수정
  - 카테고리 CRUD

**완료 기준**:
- ADMIN이 대시보드에서 전체 통계 확인
- 부적절한 포스트를 HIDDEN 상태로 변경 가능
- 모더레이션 로그 기록 확인 (누가, 언제, 무엇을, 왜) *(선택/추후)*

**예상 시간**: 35시간 → 완료

---

### Phase 7: UI/UX 개선 및 반응형
**목표**: 전체 UI 정제 및 모바일 대응

#### 7.1 디자인 일관성
- [x] 컬러 팔레트 확정 (Tailwind config)
- [x] 타이포그래피 통일
- [x] 버튼, 카드, 폼 스타일 일관성

#### 7.2 반응형 디자인
- [ ] 모바일 (< 768px) 레이아웃
- [ ] 태블릿 (768px - 1024px) 레이아웃
- [ ] Header 모바일 메뉴 (햄버거)

#### 7.3 UX 개선
- [ ] 로딩 스피너 (전역, 컴포넌트별)
- [ ] Toast 알림 (성공/에러)
- [ ] 404/500 에러 페이지
- [x] 빈 상태 UI (Empty State)
  - 포스트 없음 ✔️
  - 댓글 없음 *(추가 예정)*
  - 검색 결과 없음 ✔️

#### 7.4 접근성
- [ ] 키보드 포커스 관리
- [ ] ARIA 속성 추가
- [ ] 색상 대비 체크 (WCAG AA)

**완료 기준**:
- 모바일에서 모든 페이지 정상 동작
- 키보드만으로 주요 기능 사용 가능
- 로딩/에러 상태가 사용자에게 명확히 전달

**예상 시간**: 30시간

---

### Phase 8: 테스트 및 버그 수정
**목표**: 전체 기능 테스트 및 배포 준비

#### 8.1 기능 테스트
- [ ] 회원가입/로그인 플로우
- [ ] 역할별 권한 테스트
  - USER: 댓글만 가능
  - WRITER: 모든 블로그에 작성 가능
  - ADMIN: 모든 기능 가능
- [ ] 포스트 작성/수정/삭제
- [ ] 댓글 작성/삭제
- [ ] 검색 기능
- [ ] 관리자 기능 (숨김, 역할 변경)

#### 8.2 성능 테스트
- [ ] 페이지 로드 시간 체크
- [ ] 이미지 최적화 (next/image)
- [ ] Bundle 사이즈 분석

#### 8.3 SEO 기본
- [ ] 메타 태그 (title, description)
- [ ] OpenGraph 이미지
- [ ] robots.txt
- [ ] sitemap.xml (정적 페이지)

#### 8.4 배포 준비
- [ ] 환경 변수 Vercel 설정
- [ ] 데이터베이스 마이그레이션 (프로덕션)
- [ ] 배포 스크립트 테스트
- [ ] GitHub Actions CI/CD 확인

**완료 기준**:
- 모든 핵심 기능 동작
- 알려진 버그 없음
- Vercel 배포 성공
- 프로덕션 URL 접속 가능

**예상 시간**: 30시간

---

## 진행 관리 제안

- **주간 점검**: 각 마일스톤 진행 상황을 주간 회의에서 확인하고 장애 요소를 공유합니다.
- **이슈 트래킹**: GitHub Projects 또는 Linear로 기능/버그를 티켓 단위로 관리합니다.
- **브랜치 전략**: `main`(배포), `develop`(통합), `feature/*`(단위 작업) 구조를 유지하고, 마일스톤 완료 시 태그를 남깁니다.
- **리스크 모니터링**: Markdown 에디터, 권한 복잡도, 배포 이슈 등 주요 리스크를 회고 때마다 재평가합니다.

---

## 리스크 관리

### 리스크 1: 기술 스택 변경 (NestJS → Next.js API Routes)
**확률**: 낮음
**영향도**: 중간
**대응**:
- Next.js API Routes 공식 문서 숙지
- Prisma 연결 예제 확인
- 초기 Phase에서 API 구조 확정

### 리스크 2: Markdown 에디터 라이브러리 선택
**확률**: 중간
**영향도**: 중간
**대응**:
- Phase 3 초기에 여러 라이브러리 프로토타입 테스트
- 후보: react-md-editor, @uiw/react-markdown-editor, react-simplemde-editor
- 필수 기능: 이미지 삽입 (URL), 코드 블록, 미리보기

### 리스크 3: 권한 로직 복잡도
**확률**: 중간
**영향도**: 높음
**대응**:
- Phase 2에서 권한 로직 단일 함수로 추상화
- 단위 테스트 작성
- 블로그별 권한 매핑 테이블을 코드로 명시

### 리스크 4: 일정 지연
**확률**: 중간
**영향도**: 중간
**대응**:
- 주 단위 진행 체크
- 지연 시 Phase 7 (UI/UX 개선) 축소
- Phase 5 (검색) 또는 Phase 6 일부 (카테고리 관리) v1.0으로 연기 고려

### 리스크 5: 배포 이슈
**확률**: 낮음
**영향도**: 높음
**대응**:
- Phase 3 완료 시점에 Vercel 테스트 배포
- 환경 변수 미리 설정
- 데이터베이스 마이그레이션 스크립트 검증

---

## 다음 단계 (v1.0 이후)

MVP 완료 후 다음 기능 개발 예정:

### Q2 2025 (v1.0)
1. **소셜 로그인** (Google, Kakao OAuth)
2. **이미지 직접 업로드** (S3/Cloudinary)
3. **포스트 북마크** 기능
4. **알림 이메일** (신규 댓글 알림)
5. **고급 검색** (PostgreSQL Full-Text Search)
6. **SEO 최적화** (동적 sitemap, structured data)

### Q3 2025 (v2.0)
1. **실시간 알림** (WebSocket)
2. **포스트 공유** (소셜 미디어)
3. **통계 대시보드** (차트, 그래프)
4. **RSS 피드**
5. **다크 모드**

---

## 참고 문서
- [PRD (Product Requirements Document)](./PRD.md)
- [README](../README.md)
- [API 명세](./API_SPEC.md) *(작성 예정)*

---

**문서 버전**: 1.0
**마지막 업데이트**: 2025-01-20
**작성자**: Development Team
