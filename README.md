# 세호 (SEHO) 🎨
## 취향 공동체를 위한 복합 문화 플랫폼

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-development-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**"당신의 취향, 우리의 연결"**

[🔗 Live Demo](#) | [📖 Documentation](./docs/PRD.md) | [🗺️ Roadmap](./docs/FUTURE_DEVELOPMENT_ROADMAP.md)

</div>

---

## 📖 프로젝트 소개

**세호(SEHO)**는 취향을 중심으로 사람들을 연결하고, 문화 경험을 공유하는 커뮤니티 플랫폼입니다.

### 핵심 가치
- 🎯 **취향 기반 연결**: 비슷한 취향을 가진 사람들과의 의미 있는 만남
- 🎨 **문화 정보 큐레이션**: 전시, 공연, 이벤트 정보를 한눈에
- 💬 **활발한 커뮤니티**: 온라인에서 오프라인으로 이어지는 문화 활동
- ✨ **맞춤형 추천**: AI 기반 개인화된 문화 컨텐츠 추천

---

## ✨ 주요 기능 (MVP)

### 1. 사용자 인증 및 프로필
- 📧 이메일 / 소셜 로그인 (Google, Kakao)
- 👤 프로필 커스터마이징
- 🏷️ 취향 태그 및 관심 카테고리 설정

### 2. 취향 기반 커뮤니티
- 🏘️ 커뮤니티 생성 및 참여
- ✍️ 게시글 작성 및 댓글
- ❤️ 좋아요 및 북마크
- 🔍 커뮤니티 검색 및 탐색

### 3. 문화 컨텐츠 정보
- 🎭 전시/공연/이벤트 정보 등록
- 📅 날짜 및 카테고리별 필터링
- 🗺️ 지도 기반 장소 정보
- 🔖 이벤트 북마크

### 4. 맞춤 추천
- 🤖 취향 기반 컨텐츠 추천
- 📊 개인화된 피드
- 🎯 유사 사용자 매칭

---

## 🛠 기술 스택

### Frontend
```
Next.js 14 (App Router)
TypeScript
Tailwind CSS
Zustand (State Management)
React Query (Data Fetching)
React Hook Form + Zod (Forms & Validation)
shadcn/ui (UI Components)
```

### Backend
```
NestJS
TypeScript
PostgreSQL 15
Prisma ORM
Passport.js + JWT (Authentication)
Redis (Caching)
```

### Infrastructure
```
Frontend: Vercel
Backend: AWS EC2 / Railway
Database: AWS RDS / Supabase
Storage: AWS S3 / Cloudinary
CI/CD: GitHub Actions
Monitoring: Sentry + Google Analytics
```

### Development Tools
```
Git + GitHub
pnpm (Package Manager)
ESLint + Prettier (Code Quality)
Jest + Playwright (Testing)
Docker (Containerization)
```

---

## 📂 프로젝트 구조

```
seho/
├── frontend/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── lib/             # 유틸리티 함수
│   │   ├── hooks/           # Custom Hooks
│   │   ├── stores/          # Zustand 스토어
│   │   └── types/           # TypeScript 타입 정의
│   ├── public/              # 정적 파일
│   └── package.json
│
├── backend/                  # NestJS 백엔드
│   ├── src/
│   │   ├── modules/         # 기능별 모듈
│   │   ├── common/          # 공통 유틸리티
│   │   ├── config/          # 설정 파일
│   │   ├── database/        # DB 관련
│   │   └── main.ts          # 진입점
│   ├── prisma/              # Prisma 스키마 & 마이그레이션
│   └── package.json
│
├── docs/                     # 문서
│   ├── PRD.md               # 통합 요구사항 정의서
│   ├── DEVELOPMENT_PLAN.md  # 개발 계획서
│   ├── TEST_REPORT.md       # 테스트 보고서
│   ├── DETAILED_TEST_REPORT.md
│   ├── FINAL_SUMMARY.md
│   └── FUTURE_DEVELOPMENT_ROADMAP.md
│
├── .github/                  # GitHub 설정
│   └── workflows/           # CI/CD 파이프라인
│
├── .cursorrules             # Cursor AI 규칙
├── README.md                # 프로젝트 소개 (이 파일)
└── docker-compose.yml       # Docker 설정
```

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.x 이상
- pnpm 8.x 이상
- PostgreSQL 15
- Redis
- Git

### 설치 방법

#### 1. 레포지토리 클론
```bash
git clone https://github.com/your-username/seho.git
cd seho
```

#### 2. 환경 변수 설정

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
```

**Backend** (`.env`):
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/seho"

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# AWS S3
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### 3. 의존성 설치
```bash
# Frontend
cd frontend
pnpm install

# Backend
cd ../backend
pnpm install
```

#### 4. 데이터베이스 설정
```bash
cd backend

# Prisma 마이그레이션 실행
pnpm prisma migrate dev

# 초기 데이터 시딩 (선택사항)
pnpm prisma db seed
```

#### 5. 개발 서버 실행
```bash
# Frontend (터미널 1)
cd frontend
pnpm dev
# → http://localhost:3000

# Backend (터미널 2)
cd backend
pnpm start:dev
# → http://localhost:3001
```

### Docker로 실행 (선택사항)
```bash
# 전체 스택 실행
docker-compose up -d

# 개별 서비스 실행
docker-compose up postgres redis -d
```

---

## 🧪 테스트

### Unit 테스트
```bash
# Backend
cd backend
pnpm test

# Frontend
cd frontend
pnpm test
```

### E2E 테스트
```bash
cd frontend
pnpm test:e2e
```

### 테스트 커버리지
```bash
pnpm test:cov
```

---

## 📚 문서

### 핵심 문서
- **[PRD](./docs/PRD.md)**: 프로젝트 요구사항 및 상세 설계
- **[개발 계획서](./docs/DEVELOPMENT_PLAN.md)**: MVP 개발 로드맵
- **[향후 계획](./docs/FUTURE_DEVELOPMENT_ROADMAP.md)**: 다음 버전 기능

### API 문서
- **Swagger UI**: http://localhost:3001/api/docs (개발 서버 실행 후)

### 개발 가이드
- [컴포넌트 스타일 가이드](./docs/COMPONENT_GUIDE.md) *(작성 예정)*
- [API 개발 가이드](./docs/API_GUIDE.md) *(작성 예정)*
- [데이터베이스 스키마](./docs/DATABASE_SCHEMA.md) *(작성 예정)*

---

## 🤝 기여 가이드

### 개발 워크플로우

이 프로젝트는 **Document-Driven Development (DDD)** 방법론을 따릅니다.

#### 새 기능 추가 시
1. **기획**: `docs/PRD.md`에 기능 명세 추가
2. **계획**: `docs/DEVELOPMENT_PLAN.md`에 작업 계획 추가
3. **개발**: 코드 작성 및 테스트
4. **테스트**: `docs/TEST_REPORT.md`에 테스트 항목 추가
5. **문서화**: `README.md` 및 관련 문서 업데이트

#### 브랜치 전략
```
main        → 프로덕션 배포용
develop     → 개발 메인 브랜치
feature/*   → 새 기능 개발
fix/*       → 버그 수정
hotfix/*    → 긴급 수정
```

#### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정, 패키지 업데이트 등
```

예시:
```bash
git commit -m "feat: 커뮤니티 생성 기능 추가"
git commit -m "fix: 로그인 토큰 만료 이슈 수정"
git commit -m "docs: API 문서 업데이트"
```

---

## 🐛 이슈 및 버그 리포트

버그를 발견하셨나요? [GitHub Issues](https://github.com/your-username/seho/issues)에 리포트해주세요!

### 이슈 작성 시 포함할 내용
- 🐞 버그 설명
- 🔄 재현 방법
- 💡 예상 결과 vs 실제 결과
- 🖥️ 환경 정보 (OS, 브라우저, 버전 등)
- 📸 스크린샷 (가능한 경우)

---

## 📊 프로젝트 현황

### 개발 진행률
- ⏳ **현재 버전**: MVP v0.1 (개발 중)
- 📅 **목표 완료일**: 2025-04-19
- 📈 **전체 진행률**: 0% (79개 작업 중 0개 완료)

### 다음 마일스톤
- **M1: 프로젝트 초기화** - 2025-01-26
- **M2: 인증 시스템** - 2025-02-09
- **M3: 커뮤니티 기능** - 2025-03-02

자세한 진행 상황은 [개발 계획서](./docs/DEVELOPMENT_PLAN.md)를 참고하세요.

---

## 🗺️ 로드맵

### MVP (v0.1) - 2025년 Q2
- ✅ 사용자 인증 및 프로필
- ✅ 커뮤니티 생성 및 관리
- ✅ 게시글 및 댓글
- ✅ 이벤트 정보

### v1.0 - 2025년 Q3
- 🔄 실시간 채팅
- 🔄 고급 추천 알고리즘
- 🔄 오프라인 모임 기능
- 🔄 알림 시스템

### v2.0 - 2025년 Q4
- 🔄 네이티브 모바일 앱
- 🔄 프리미엄 기능
- 🔄 파트너십 시스템

전체 로드맵은 [FUTURE_DEVELOPMENT_ROADMAP.md](./docs/FUTURE_DEVELOPMENT_ROADMAP.md)를 참고하세요.

---

## 👥 팀

### 개발자
- **[Your Name]** - Full-stack Developer, Project Lead
  - GitHub: [@your-github](https://github.com/your-github)
  - Email: your.email@example.com

### 기여자
- *(아직 없음 - 첫 기여자가 되어주세요!)*

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으신가요?

- 📧 Email: seho.platform@example.com
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@seho_official](#)

---

<div align="center">

**세호 (SEHO)** - 취향을 통해 세상을 연결합니다

Made with ❤️ by SEHO Team

[⬆ 맨 위로](#세호-seho-)

</div>

