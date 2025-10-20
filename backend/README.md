# 세호 Backend

NestJS 기반 백엔드 API 서버

## 기술 스택

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator
- **Cache**: Redis
- **File Storage**: AWS S3

## 시작하기

### 설치

```bash
pnpm install
```

### 환경 변수 설정

`.env` 파일 생성:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/seho"
JWT_SECRET=your_secret_key
# ... (더 많은 환경 변수는 .env.example 참조)
```

### 데이터베이스 설정

```bash
# Prisma 마이그레이션
pnpm prisma migrate dev

# Prisma 스튜디오 실행 (DB GUI)
pnpm prisma studio
```

### 개발 서버 실행

```bash
pnpm start:dev
```

http://localhost:3001 에서 API 확인
http://localhost:3001/api/docs 에서 Swagger 문서 확인

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start:prod
```

## 프로젝트 구조

```
backend/
├── src/
│   ├── modules/           # 기능별 모듈
│   │   ├── auth/         # 인증
│   │   ├── users/        # 사용자
│   │   ├── communities/  # 커뮤니티
│   │   ├── posts/        # 게시글
│   │   └── events/       # 이벤트
│   ├── common/           # 공통 유틸리티
│   │   ├── decorators/   # 커스텀 데코레이터
│   │   ├── filters/      # 예외 필터
│   │   ├── guards/       # 가드
│   │   ├── interceptors/ # 인터셉터
│   │   └── pipes/        # 파이프
│   ├── config/           # 설정 파일
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── ...
│   ├── database/         # 데이터베이스 관련
│   │   └── prisma.service.ts
│   ├── main.ts           # 진입점
│   └── app.module.ts     # 루트 모듈
├── prisma/               # Prisma 스키마 & 마이그레이션
│   ├── schema.prisma
│   └── migrations/
├── test/                 # 테스트 파일
└── package.json
```

## API 문서

Swagger UI: http://localhost:3001/api/docs

### 주요 엔드포인트

#### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 내 정보

#### 사용자
- `GET /api/users/:id` - 사용자 조회
- `PATCH /api/users/:id` - 프로필 수정

#### 커뮤니티
- `GET /api/communities` - 목록 조회
- `POST /api/communities` - 생성
- `GET /api/communities/:id` - 상세 조회

#### 게시글
- `GET /api/posts` - 목록 조회
- `POST /api/posts` - 작성
- `GET /api/posts/:id` - 상세 조회

## 데이터베이스

### 마이그레이션

```bash
# 새 마이그레이션 생성
pnpm prisma migrate dev --name migration_name

# 프로덕션 마이그레이션 적용
pnpm prisma migrate deploy

# 마이그레이션 초기화 (개발 환경)
pnpm prisma migrate reset
```

### 시딩

```bash
pnpm prisma db seed
```

## 테스트

```bash
# 유닛 테스트
pnpm test

# E2E 테스트
pnpm test:e2e

# 커버리지
pnpm test:cov

# 특정 테스트 파일
pnpm test auth.service.spec.ts
```

## 코딩 컨벤션

### 모듈 구조
```
module/
├── dto/              # Data Transfer Objects
├── entities/         # Prisma 모델
├── guards/           # 모듈별 가드
├── module.controller.ts
├── module.service.ts
└── module.module.ts
```

### 네이밍 규칙
- Controller: `*.controller.ts`
- Service: `*.service.ts`
- DTO: `*.dto.ts`
- Entity: `*.entity.ts`

## 보안

### 구현된 보안 기능
- [x] JWT 기반 인증
- [x] bcrypt 비밀번호 암호화
- [x] CORS 설정
- [x] Rate Limiting
- [x] Helmet (보안 헤더)
- [x] Input Validation

### 보안 체크리스트
- [ ] 2FA 구현
- [ ] API 키 로테이션
- [ ] 보안 감사 로그

## 배포

### Railway

```bash
railway up
```

### Docker

```bash
docker build -t seho-backend .
docker run -p 3001:3001 seho-backend
```

### AWS EC2

```bash
# PM2로 실행
pm2 start dist/main.js --name seho-backend

# 로그 확인
pm2 logs seho-backend
```

## 모니터링

### Sentry
에러 트래킹이 자동으로 Sentry로 전송됩니다.

### Logs
로그는 `logs/` 디렉토리에 저장됩니다.

```bash
# 로그 확인
tail -f logs/error.log
tail -f logs/combined.log
```

## 문제 해결

### 일반적인 문제

**Q: 데이터베이스 연결 오류**
A: DATABASE_URL 환경 변수를 확인하고 PostgreSQL이 실행 중인지 확인하세요.

**Q: Prisma 마이그레이션 오류**
A: `pnpm prisma migrate reset`으로 데이터베이스를 초기화하세요.

**Q: JWT 토큰 오류**
A: JWT_SECRET 환경 변수가 설정되어 있는지 확인하세요.

## 관련 문서

- [NestJS 문서](https://docs.nestjs.com)
- [Prisma 문서](https://www.prisma.io/docs)
- [Passport.js](http://www.passportjs.org)

