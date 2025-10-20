# 개발 계획서 (Development Plan)
# 세호 (SEHO) - MVP v0.1

## 버전 정보
- **대상 버전**: MVP v0.1
- **계획 작성일**: 2025-01-19
- **목표 완료일**: 2025-04-19 (3개월)
- **개발 방법론**: Document-Driven Development (DDD)

---

## 개발 목표

### 주요 목표
1. **핵심 기능 구현**: 취향 기반 커뮤니티 플랫폼의 필수 기능 완성
2. **사용 가능한 MVP**: 실제 사용자가 서비스를 이용할 수 있는 수준의 완성도
3. **확장 가능한 구조**: 향후 기능 추가를 고려한 아키텍처 설계

### 개발 범위
- ✅ 사용자 인증 및 프로필 관리
- ✅ 커뮤니티 생성 및 참여
- ✅ 게시글 작성 및 상호작용
- ✅ 문화 이벤트 정보 등록 및 조회
- ⚠️ 맞춤 추천 (간단한 버전, 고도화는 v1.0에서)

### 제외 범위 (MVP 이후)
- ❌ 실시간 채팅
- ❌ 결제 시스템
- ❌ 오프라인 모임 기능
- ❌ 네이티브 모바일 앱
- ❌ 고급 AI 추천 알고리즘

---

## 작업 항목 (Task Breakdown)

### Phase 1: 프로젝트 초기 설정 (1주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-001 | 프로젝트 구조 설정 | 폴더 구조, Git 설정, 환경 변수 | Critical | 4h | TODO | |
| T-002 | Frontend 초기 설정 | Next.js 프로젝트 생성, 라이브러리 설치 | Critical | 4h | TODO | |
| T-003 | Backend 초기 설정 | NestJS 프로젝트 생성, 기본 구조 | Critical | 4h | TODO | |
| T-004 | Database 설정 | PostgreSQL 설치, Prisma ORM 설정 | Critical | 4h | TODO | |
| T-005 | 디자인 시스템 구축 | 컬러, 타이포그래피, 기본 컴포넌트 | High | 8h | TODO | Tailwind CSS |
| T-006 | CI/CD 파이프라인 설정 | GitHub Actions 설정 | Medium | 4h | TODO | |

**Phase 1 총 예상 시간**: 28시간 (약 1주)

---

### Phase 2: 사용자 인증 시스템 (2주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-101 | DB 스키마 생성 | users, sessions 테이블 생성 | Critical | 2h | TODO | Prisma migration |
| T-102 | 회원가입 API | POST /api/auth/register | Critical | 6h | TODO | bcrypt 암호화 |
| T-103 | 로그인 API | POST /api/auth/login | Critical | 4h | TODO | JWT 토큰 발급 |
| T-104 | 이메일 인증 | 이메일 발송, 인증 토큰 검증 | High | 6h | TODO | SendGrid/AWS SES |
| T-105 | 비밀번호 재설정 | 비밀번호 찾기 기능 | Medium | 4h | TODO | |
| T-106 | 소셜 로그인 (Google) | Google OAuth 연동 | High | 6h | TODO | Passport.js |
| T-107 | 소셜 로그인 (Kakao) | Kakao OAuth 연동 | High | 6h | TODO | |
| T-108 | 회원가입 UI | 회원가입 폼, 유효성 검사 | Critical | 8h | TODO | React Hook Form |
| T-109 | 로그인 UI | 로그인 폼, 소셜 로그인 버튼 | Critical | 6h | TODO | |
| T-110 | 인증 미들웨어 | JWT 검증, 라우트 보호 | Critical | 4h | TODO | |

**Phase 2 총 예상 시간**: 52시간 (약 1.5주)

---

### Phase 3: 프로필 관리 (3주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-201 | DB 스키마 확장 | tags, user_tags, interests 테이블 | Critical | 3h | TODO | |
| T-202 | 프로필 조회 API | GET /api/users/:userId | Critical | 4h | TODO | |
| T-203 | 프로필 수정 API | PATCH /api/users/:userId | Critical | 4h | TODO | |
| T-204 | 태그 관리 API | GET/POST tags, user_tags | High | 6h | TODO | |
| T-205 | 관심사 관리 API | GET/PUT user_interests | High | 4h | TODO | |
| T-206 | 이미지 업로드 | S3 업로드, 프로필 이미지 처리 | High | 8h | TODO | AWS S3/Multer |
| T-207 | 프로필 UI | 프로필 보기 화면 | Critical | 8h | TODO | |
| T-208 | 프로필 편집 UI | 편집 폼, 이미지 업로드 | Critical | 10h | TODO | |
| T-209 | 태그 선택 UI | 태그 검색 및 선택 컴포넌트 | High | 8h | TODO | Multi-select |
| T-210 | 관심사 선택 UI | 카테고리 선택 화면 | High | 6h | TODO | |

**Phase 3 총 예상 시간**: 61시간 (약 2주)

---

### Phase 4: 커뮤니티 기능 (4-5주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-301 | DB 스키마 생성 | communities, memberships, community_tags | Critical | 3h | TODO | |
| T-302 | 커뮤니티 생성 API | POST /api/communities | Critical | 6h | TODO | |
| T-303 | 커뮤니티 목록 API | GET /api/communities (페이지네이션) | Critical | 6h | TODO | |
| T-304 | 커뮤니티 상세 API | GET /api/communities/:id | Critical | 4h | TODO | |
| T-305 | 커뮤니티 가입/탈퇴 API | POST/DELETE join/leave | Critical | 6h | TODO | |
| T-306 | 커뮤니티 검색 API | 검색, 필터링, 정렬 | High | 8h | TODO | Full-text search |
| T-307 | 멤버 관리 API | 멤버 목록, 역할 변경 | Medium | 6h | TODO | |
| T-308 | 커뮤니티 목록 UI | 카드 그리드, 필터, 검색 | Critical | 12h | TODO | |
| T-309 | 커뮤니티 생성 UI | 생성 폼, 이미지 업로드 | Critical | 10h | TODO | |
| T-310 | 커뮤니티 상세 UI | 상세 정보, 멤버 목록 | Critical | 12h | TODO | |
| T-311 | 가입/탈퇴 UI | 가입 버튼, 확인 모달 | High | 4h | TODO | |

**Phase 4 총 예상 시간**: 77시간 (약 2.5주)

---

### Phase 5: 게시글 및 댓글 (6-7주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-401 | DB 스키마 생성 | posts, comments, likes, bookmarks | Critical | 3h | TODO | |
| T-402 | 게시글 CRUD API | 생성, 조회, 수정, 삭제 | Critical | 10h | TODO | |
| T-403 | 게시글 목록 API | 커뮤니티별 게시글 목록 | Critical | 6h | TODO | |
| T-404 | 댓글 CRUD API | 댓글, 대댓글 처리 | Critical | 10h | TODO | |
| T-405 | 좋아요 API | 좋아요/취소 (posts, comments) | High | 6h | TODO | |
| T-406 | 북마크 API | 북마크/취소 | High | 4h | TODO | |
| T-407 | 이미지 업로드 | 게시글 이미지 다중 업로드 | High | 6h | TODO | |
| T-408 | 게시글 작성 UI | 에디터, 이미지 업로드 | Critical | 12h | TODO | Draft.js/Quill |
| T-409 | 게시글 목록 UI | 피드 형식, 무한 스크롤 | Critical | 10h | TODO | |
| T-410 | 게시글 상세 UI | 상세 보기, 댓글 영역 | Critical | 12h | TODO | |
| T-411 | 댓글 UI | 댓글 입력, 대댓글, 수정/삭제 | Critical | 12h | TODO | |
| T-412 | 좋아요/북마크 UI | 버튼, 애니메이션 | Medium | 6h | TODO | |

**Phase 5 총 예상 시간**: 97시간 (약 3주)

---

### Phase 6: 문화 이벤트 (8주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-501 | DB 스키마 생성 | events, event_bookmarks | Critical | 2h | TODO | |
| T-502 | 이벤트 CRUD API | 생성, 조회, 수정, 삭제 | Critical | 10h | TODO | |
| T-503 | 이벤트 목록 API | 필터링, 검색, 정렬 | Critical | 8h | TODO | |
| T-504 | 이벤트 북마크 API | 북마크/취소 | High | 4h | TODO | |
| T-505 | 이벤트 등록 UI | 관리자/사용자 등록 폼 | Critical | 12h | TODO | |
| T-506 | 이벤트 목록 UI | 카드 그리드, 필터 | Critical | 10h | TODO | |
| T-507 | 이벤트 상세 UI | 상세 정보, 지도, 북마크 | Critical | 12h | TODO | Google Maps API |
| T-508 | 이벤트 검색 UI | 검색 바, 필터 옵션 | High | 8h | TODO | |

**Phase 6 총 예상 시간**: 66시간 (약 2주)

---

### Phase 7: 홈 및 탐색 (9주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-601 | 홈 피드 API | 맞춤 추천 게시글 | High | 8h | TODO | 간단한 알고리즘 |
| T-602 | 홈 UI | 피드, 추천 커뮤니티, 이벤트 | Critical | 12h | TODO | |
| T-603 | 탐색 UI | 커뮤니티/이벤트 탐색 | Critical | 10h | TODO | |
| T-604 | 네비게이션 UI | 상단바, 사이드바, 하단바 | Critical | 10h | TODO | 반응형 |
| T-605 | 검색 기능 | 통합 검색 (커뮤니티, 게시글, 이벤트) | High | 12h | TODO | Elasticsearch |
| T-606 | 알림 UI | 알림 목록, 실시간 표시 | Medium | 8h | TODO | |

**Phase 7 총 예상 시간**: 60시간 (약 2주)

---

### Phase 8: 테스트 및 최적화 (10-11주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-701 | Unit 테스트 | API 엔드포인트 테스트 | High | 20h | TODO | Jest |
| T-702 | Integration 테스트 | 주요 플로우 테스트 | High | 16h | TODO | |
| T-703 | E2E 테스트 | 사용자 시나리오 테스트 | Medium | 16h | TODO | Playwright/Cypress |
| T-704 | 성능 최적화 | 쿼리 최적화, 캐싱 | High | 12h | TODO | Redis |
| T-705 | 이미지 최적화 | WebP 변환, Lazy Loading | Medium | 8h | TODO | |
| T-706 | SEO 최적화 | 메타 태그, sitemap | Medium | 8h | TODO | |
| T-707 | 반응형 디자인 점검 | Mobile, Tablet, Desktop | High | 12h | TODO | |
| T-708 | 접근성 개선 | WCAG 준수, 스크린 리더 | Medium | 8h | TODO | |
| T-709 | 버그 수정 | 테스트 중 발견된 버그 | High | 20h | TODO | |

**Phase 8 총 예상 시간**: 120시간 (약 4주)

---

### Phase 9: 배포 및 모니터링 (12주차)

| Task ID | 작업명 | 상세 설명 | 우선순위 | 예상 시간 | 상태 | 비고 |
|---------|--------|-----------|----------|-----------|------|------|
| T-801 | 프로덕션 환경 설정 | AWS/Vercel 설정 | Critical | 8h | TODO | |
| T-802 | 도메인 및 SSL | 도메인 연결, HTTPS 설정 | Critical | 4h | TODO | |
| T-803 | Database 마이그레이션 | 프로덕션 DB 설정 | Critical | 6h | TODO | |
| T-804 | 모니터링 설정 | Sentry, Google Analytics | High | 6h | TODO | |
| T-805 | 로깅 시스템 | 에러 로깅, 사용자 행동 로그 | Medium | 6h | TODO | |
| T-806 | 백업 시스템 | DB 백업 자동화 | Medium | 4h | TODO | |
| T-807 | 프로덕션 배포 | 최종 배포 및 검증 | Critical | 8h | TODO | |
| T-808 | 사용자 가이드 작성 | 서비스 이용 가이드 | Medium | 8h | TODO | |

**Phase 9 총 예상 시간**: 50시간 (약 1.5주)

---

## 마일스톤 (Milestones)

| 마일스톤 | 목표 날짜 | 완료 조건 | 상태 |
|---------|----------|----------|------|
| M1: 프로젝트 초기화 완료 | 2025-01-26 | Phase 1 모든 Task 완료 | ⏳ Pending |
| M2: 인증 시스템 완료 | 2025-02-09 | 회원가입/로그인 작동 | ⏳ Pending |
| M3: 커뮤니티 기능 완료 | 2025-03-02 | 커뮤니티 생성/가입 가능 | ⏳ Pending |
| M4: 게시글 기능 완료 | 2025-03-23 | 게시글 작성/댓글 작동 | ⏳ Pending |
| M5: 이벤트 기능 완료 | 2025-03-30 | 이벤트 등록/조회 가능 | ⏳ Pending |
| M6: MVP 기능 완성 | 2025-04-06 | 모든 핵심 기능 작동 | ⏳ Pending |
| M7: 테스트 완료 | 2025-04-13 | 모든 테스트 통과 | ⏳ Pending |
| M8: 프로덕션 배포 | 2025-04-19 | 서비스 정식 오픈 | ⏳ Pending |

---

## 기술 스택 (Tech Stack)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator
- **API Documentation**: Swagger

### Infrastructure
- **Hosting (Frontend)**: Vercel
- **Hosting (Backend)**: AWS EC2 / Railway
- **Database**: AWS RDS / Supabase
- **File Storage**: AWS S3 / Cloudinary
- **Cache**: Redis
- **CI/CD**: GitHub Actions

### Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + Playwright
- **Monitoring**: Sentry + Google Analytics

---

## 리스크 및 대응 방안

### 기술적 리스크

| 리스크 | 발생 가능성 | 영향도 | 대응 방안 |
|--------|-----------|--------|----------|
| 데이터베이스 스키마 변경 필요 | Medium | High | Prisma 마이그레이션으로 버전 관리 |
| 성능 이슈 (대용량 트래픽) | Low | High | 초기는 캐싱으로 대응, 이후 확장 |
| 소셜 로그인 API 변경 | Low | Medium | 추상화 레이어로 분리 설계 |
| 이미지 업로드 용량 문제 | Medium | Medium | 클라이언트 측 압축, CDN 활용 |
| 보안 취약점 | Medium | Critical | 정기적인 보안 점검, 업데이트 |

### 일정 리스크

| 리스크 | 발생 가능성 | 영향도 | 대응 방안 |
|--------|-----------|--------|----------|
| 예상보다 긴 개발 시간 | High | High | 우선순위 낮은 기능 다음 버전으로 연기 |
| 예상치 못한 버그 | High | Medium | 충분한 테스트 기간 확보 |
| 기술 학습 곡선 | Medium | Medium | 사전 학습, 문서화 충실 |
| 리소스 부족 | Medium | High | 외부 라이브러리 적극 활용 |

### 비즈니스 리스크

| 리스크 | 발생 가능성 | 영향도 | 대응 방안 |
|--------|-----------|--------|----------|
| 사용자 피드백 반영 필요 | High | Medium | 베타 테스트 기간 확보 |
| 경쟁 서비스 출현 | Medium | Medium | 차별화 포인트 강화 |
| 초기 사용자 확보 어려움 | High | High | 마케팅 전략 수립, 인플루언서 협업 |

---

## 팀 구성 및 역할

### 현재 팀 (Solo Development)
- **개발자 1명**: Full-stack 개발, 디자인, 기획 모두 담당

### 협업 필요 시 (선택사항)
- **디자이너**: UI/UX 디자인 개선
- **마케터**: 초기 사용자 확보
- **테스터**: QA 및 베타 테스트

---

## 일일 개발 계획 (Daily Schedule)

### 평일 (월-금)
- **09:00 - 10:00**: 문서 검토, 오늘 할 일 확인
- **10:00 - 13:00**: 개발 (핵심 기능)
- **13:00 - 14:00**: 점심 휴식
- **14:00 - 18:00**: 개발 (보조 기능, UI)
- **18:00 - 19:00**: 테스트, 코드 리뷰
- **19:00 - 20:00**: 문서 업데이트, 진행 상황 정리

### 주말 (토-일)
- **선택적 개발**: 밀린 작업이나 학습에 활용
- **주간 회고**: 일요일 저녁 이번 주 성과 정리

---

## 품질 관리 (Quality Assurance)

### 코드 품질
- [ ] ESLint + Prettier 규칙 준수
- [ ] TypeScript strict 모드 사용
- [ ] 코드 리뷰 체크리스트 작성
- [ ] 최소 70% 테스트 커버리지

### 성능 기준
- [ ] Lighthouse 점수: 90점 이상
- [ ] First Contentful Paint: 1.8초 이하
- [ ] Time to Interactive: 3.8초 이하
- [ ] API 응답 시간: 500ms 이하

### 보안 체크리스트
- [ ] HTTPS 적용
- [ ] SQL Injection 방어
- [ ] XSS 방어
- [ ] CSRF 토큰 적용
- [ ] Rate Limiting 설정
- [ ] 민감 정보 환경 변수화

---

## 문서 업데이트 규칙

### 작업 시작 전
1. PRD에서 해당 기능 명세 확인
2. DEVELOPMENT_PLAN에서 Task 상태를 "in_progress"로 변경
3. 필요시 세부 계획 추가 작성

### 작업 중
1. 중요한 기술적 결정 사항은 Task 비고란에 기록
2. API 변경 시 PRD 업데이트
3. DB 스키마 변경 시 PRD 업데이트

### 작업 완료 후
1. Task 상태를 "completed"로 변경
2. 완료 날짜 기록
3. TEST_REPORT에 테스트 항목 추가
4. README 업데이트 (필요시)

---

## 진행 상황 추적

### 전체 진행률
- **전체 Task 수**: 79개
- **완료**: 0개 (0%)
- **진행 중**: 0개 (0%)
- **대기 중**: 79개 (100%)

### Phase별 진행률
| Phase | Task 수 | 완료 | 진행 중 | 완료율 |
|-------|---------|------|---------|--------|
| Phase 1: 초기 설정 | 6 | 0 | 0 | 0% |
| Phase 2: 인증 | 10 | 0 | 0 | 0% |
| Phase 3: 프로필 | 10 | 0 | 0 | 0% |
| Phase 4: 커뮤니티 | 11 | 0 | 0 | 0% |
| Phase 5: 게시글 | 12 | 0 | 0 | 0% |
| Phase 6: 이벤트 | 8 | 0 | 0 | 0% |
| Phase 7: 홈/탐색 | 6 | 0 | 0 | 0% |
| Phase 8: 테스트 | 9 | 0 | 0 | 0% |
| Phase 9: 배포 | 8 | 0 | 0 | 0% |

---

## 주간 리뷰 (Weekly Review)

### Week 1 (2025-01-19 ~ 2025-01-26)
- **계획**: Phase 1 완료
- **실제**: 
- **이슈**: 
- **다음 주**: 

### Week 2 (2025-01-27 ~ 2025-02-02)
- **계획**: Phase 2 진행
- **실제**: 
- **이슈**: 
- **다음 주**: 

*(매주 업데이트)*

---

## 참고 자료

### 관련 문서
- [PRD.md](./PRD.md) - 상세 기능 명세
- [README.md](../README.md) - 프로젝트 개요
- [FUTURE_DEVELOPMENT_ROADMAP.md](./FUTURE_DEVELOPMENT_ROADMAP.md) - 향후 계획

### 기술 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 참고 서비스
- Meetup
- Facebook Groups
- Reddit Communities
- Discord Servers

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|----------|--------|
| 2025-01-19 | 초안 작성 | Dev Team |

---

**문서 상태**: Active  
**다음 업데이트**: 매주 일요일  
**담당자**: Development Team

