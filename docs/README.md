# 세호 (SEHO) ✍️
## 3개의 블로그 공간 플랫폼

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-development-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**"3개의 특별한 공간에서 이야기를 나누다"**

[🔗 Live Demo](#) | [📖 Documentation](./docs/PRD.md) | [🗺️ Roadmap](./docs/DEVELOPMENT_PLAN.md)

</div>

---

## 📖 프로젝트 소개

**세호(SEHO)**는 3개의 독립적인 블로그 공간을 운영하는 플랫폼입니다.

### 3개의 블로그 공간
- 📚 **Serein Cafe** - 세렌 카페
- 🎨 **Studio CPA** - 스튜디오 CPA
- 💫 **Swing Company** - 스윙 컴퍼니

### 핵심 가치
- 🔐 **역할 기반 권한**: 블로그별 차등 권한으로 컨텐츠 품질 관리
- ✍️ **깔끔한 포스팅**: Markdown 지원으로 전문적인 글쓰기
- 💬 **활발한 소통**: 댓글 시스템으로 독자와 작성자의 교류
- 🎯 **통합 피드**: "On Air"에서 전체 최신글을 한눈에

---

## ✨ 주요 기능 (MVP)

### 1. 사용자 인증 및 역할
- 📧 이메일 기반 회원가입/로그인
- 🔑 4단계 역할 시스템
  - **ADMIN**: 전체 관리 권한
  - **MASTER**: 특정 블로그 전문 작성자
  - **POTLUCK**: 일부 블로그 작성 권한
  - **USER**: 기본 사용자 (댓글만 가능)

### 2. 블로그 시스템
- 📝 블로그별 독립적인 포스트 관리
- 🏷️ 카테고리 기반 글 분류
- 📌 태그 시스템
- 🔍 검색 기능 (제목/본문)
- 📊 "On Air" 전체 최신글 피드

### 3. 포스트 작성
- ✏️ Markdown/MDX 지원
- 🖼️ 이미지 업로드
- 🔒 블로그별 작성 권한 제어
  - Serein Cafe: POTLUCK 이상
  - Studio CPA: MASTER만
  - Swing Company: POTLUCK 이상
- 📝 초안/발행/숨김 상태 관리

### 4. 댓글 및 상호작용
- 💬 댓글 작성/수정/삭제
- 👁️ 조회수 트래킹
- 📱 반응형 디자인

### 5. 관리자 기능
- 📊 통합 대시보드
- 👥 사용자 역할 관리
- 🛡️ 포스트/댓글 모더레이션
- 📈 통계 및 KPI 확인

---

## 🛠 기술 스택

### Core Stack
```
Next.js 15 (App Router with Turbopack)
TypeScript
Tailwind CSS 4 (with PostCSS)
PostgreSQL + Prisma ORM
```

### Frontend
```
React 19
Zustand (State Management)
React Query (Data Fetching)
React Hook Form + Zod (Forms & Validation)
Axios (HTTP Client)
Lucide React (Icons)
```

### Backend & Auth
```
Next.js API Routes (Route Handlers)
Auth.js (NextAuth) - Credentials Provider
bcrypt (Password Hashing)
JWT (Token Management)
```

### Infrastructure
```
Deployment: Vercel
Database: PostgreSQL (Vercel Postgres or Supabase)
Storage: Database URLs (MVP) → S3/Cloudinary (추후)
Email: SMTP / Transactional Service
CI/CD: GitHub Actions
```

### Development Tools
```
Git + GitHub
ESLint + Prettier
Husky (Pre-commit Hooks)
Docker (Local PostgreSQL)
```

---

## 📂 프로젝트 구조

```
seho/
├── app/                        # Next.js App Router 엔트리
│   ├── (public)/               # 공개 페이지 그룹
│   │   ├── page.tsx            # 홈 (블로그 인덱스)
│   │   ├── blogs/              # 블로그별 화면
│   │   ├── on-air/             # 통합 피드
│   │   └── auth/               # 로그인 UI (초안)
│   └── layout.tsx              # 루트 레이아웃
├── components/                 # 공용 컴포넌트
│   ├── blog/
│   ├── common/
│   └── layout/
├── lib/                        # 상수 및 유틸
│   └── constants/
├── public/                     # 정적 자산
├── stores/                     # Zustand 스토어 (준비 중)
├── types/                      # 공용 타입 (준비 중)
├── docs/                       # 문서
├── backend/                    # 구 NestJS 코드베이스 (아카이브)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
└── docker-compose.yml
```

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.x 이상
- pnpm 8.x 이상
- PostgreSQL 15 (또는 Docker)
- Git

### 설치 방법

#### 1. 레포지토리 클론
```bash
git clone https://github.com/your-username/seho.git
cd seho
```

#### 2. 데이터베이스 실행 (Docker)
```bash
docker-compose up -d
# PostgreSQL이 localhost:5432에서 실행됩니다
```

#### 3. 환경 변수 설정

**앱 루트** (`.env.local`):
```env
# Database
DATABASE_URL="postgresql://seho:seho_password@localhost:5432/seho"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_here

# Email (Optional for MVP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### 4. 의존성 설치 및 DB 초기화
```bash
pnpm install

# Prisma 초기 마이그레이션 및 시드 (PostgreSQL 실행 후)
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

#### 5. 개발 서버 실행
```bash
pnpm dev
# → http://localhost:3000
```

---

## 🧪 테스트

### Linting & Type Check
```bash
pnpm lint
pnpm typecheck
pnpm build
```

---

## 📚 문서

### 핵심 문서
- **[PRD](./docs/PRD.md)**: 프로젝트 요구사항 및 상세 설계
- **[개발 계획서](./docs/DEVELOPMENT_PLAN.md)**: MVP 개발 로드맵
- **[API 명세](./docs/API_SPEC.md)**: API 엔드포인트 문서

### 데이터베이스
```bash
# Prisma Studio로 DB 확인
pnpm prisma studio
# → http://localhost:5555
```

---

## ✍️ 포스트 작성 안내

- WRITER 이상 권한이 있는 계정으로 로그인하면 `/blogs/[slug]/write`에서 Markdown 에디터가 제공됩니다.
- 제목, 카테고리, 태그(쉼표로 구분), 본문을 입력한 뒤 `임시 저장` 또는 `바로 발행`을 선택하세요.
- 발행된 포스트는 `/blogs/[slug]/post/[postSlug]`에서 확인 가능하며, 권한자에게는 수정/삭제 버튼이 노출됩니다.
- 최신 포스트는 `/on-air` 페이지에서 블로그별로 필터링하여 확인할 수 있습니다.

## 🔍 검색 사용법

- 헤더의 검색창 또는 `/search` 페이지에서 키워드를 입력하면 발행된 포스트를 검색할 수 있습니다.
- 블로그별 필터를 적용하여 특정 공간의 글만 조회할 수 있으며, 결과가 없을 때는 안내 메시지가 표시됩니다.

## 🛠 블로그 관리 (ADMIN)

- `/admin/blogs` 페이지에서 블로그별 커버/로고/썸네일, 대표 색상, 폰트, 레이아웃 정보를 업데이트할 수 있습니다.
- 같은 화면에서 카테고리를 추가·수정·삭제하면 블로그 홈의 필터가 즉시 반영됩니다.
- 이미지 가이드
  - 커버 이미지: 1920×400px (JPG/PNG/WebP, 2MB 이하)
  - 로고: 200×200px (PNG 권장, 500KB 이하)
  - 카드 썸네일: 400×400px (JPG/PNG, 1MB 이하)
  - 포스트 대표 이미지: 1200×675px (16:9, 3MB 이하)

## 🎯 역할별 권한 요약

| 기능 | ADMIN | WRITER | USER |
|------|-------|--------|------|
| 모든 블로그 글 작성 | ✅ | ✅ | ❌ |
| 자기 글 수정/삭제 | ✅ | ✅ | ❌ |
| 댓글 작성 | ✅ | ✅ | ✅ |
| 타인 글/댓글 모더레이션 | ✅ | ❌ | ❌ |
| 사용자 역할 변경 | ✅ | ❌ | ❌ |
| 관리자 대시보드 접근 | ✅ | ❌ | ❌ |

---

## 🤝 기여 가이드

### 브랜치 전략
```
main        → 프로덕션 배포용
develop     → 개발 메인 브랜치
feature/*   → 새 기능 개발
fix/*       → 버그 수정
```

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정, 패키지 업데이트
```

---

## 📊 프로젝트 현황

### 개발 진행률
- ⏳ **현재 버전**: MVP v0.1 (개발 예정)
- 📅 **목표 완료일**: 2025년 3월 말
- 📈 **전체 진행률**: 0% (초기화 단계)

### 다음 마일스톤
- **M1: 프로젝트 초기화** - 2025-01-26
- **M2: 인증 시스템** - 2025-02-05
- **M3: 블로그 & 포스트** - 2025-02-20
- **M4: 관리자 기능** - 2025-03-10
- **M5: 테스트 & 배포** - 2025-03-30

---

## 🗺️ 로드맵

### MVP (v0.1) - 2025년 Q1
- ✅ 프로젝트 초기화
- 🔄 사용자 인증 (이메일/비밀번호)
- 🔄 3개 블로그 시스템
- 🔄 포스트 작성/수정/삭제
- 🔄 댓글 시스템
- 🔄 관리자 대시보드
- 🔄 역할 기반 권한 제어

### v1.0 - 2025년 Q2
- 소셜 로그인 (Google, Kakao)
- 이미지 최적화 (S3/Cloudinary)
- 포스트 북마크
- 알림 이메일
- 고급 검색 (전문 검색)
- SEO 최적화

### v2.0 - 2025년 Q3
- 실시간 알림
- 포스트 공유 기능
- 통계 대시보드 확장
- RSS 피드
- 다국어 지원

---

## 👥 팀

### 개발자
- **[Your Name]** - Full-stack Developer, Project Lead
  - GitHub: [@your-github](https://github.com/your-github)
  - Email: your.email@example.com

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Auth.js](https://authjs.dev/)

---

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으신가요?

- 📧 Email: seho.platform@example.com
- 💬 GitHub Issues: [이슈 생성하기](https://github.com/your-username/seho/issues)

---

<div align="center">

**세호 (SEHO)** - 3개의 특별한 공간에서 이야기를 나누다

Made with ❤️ by SEHO Team

[⬆ 맨 위로](#세호-seho-)

</div>
