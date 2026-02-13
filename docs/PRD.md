# PRD (Product Requirements Document)
# 세호 (SEHO) - 4개의 블로그 공간 플랫폼

## 1. 프로젝트 개요
- **프로젝트명**: 세호 (SEHO)
- **도메인**: ch0435.com
- **버전**: MVP v0.1
- **작성일**: 2025-01-20
- **최종 수정일**: 2026-02-12
- **작성자**: Product Team
- **프로젝트 성격**: 역할 기반 권한을 가진 다중 블로그 플랫폼

---

## 2. 프로젝트 비전 및 목표

### 2.1 비전
"4개의 독립적인 블로그 공간에서 역할에 따라 컨텐츠를 관리하고 공유하는 플랫폼"

### 2.2 핵심 목표
1. **블로그 공간 운영**: Serein Cafe, Studio CPA, Swing Company, Bookstore 4개의 독립적인 블로그 운영
2. **역할 기반 권한 관리**: 단순한 3단계 권한으로 명확한 관리
3. **통합 피드 제공**: "On Air"에서 모든 블로그의 최신글을 한눈에 확인
4. **효율적인 관리**: 관리자 대시보드를 통한 사용자, 포스트, 댓글 통합 관리

### 2.3 4개의 블로그 공간
1. **Serein Cafe** (세렌 카페)
   - slug: `serein-cafe`
   - 작성 권한: ADMIN, WRITER
   - 성격: 다양한 작성자가 참여하는 블로그
   - 주요 카테고리: Hostmade, Potluck, Catered event

2. **Studio CPA** (스튜디오 CPA)
   - slug: `studio-cpa`
   - 작성 권한: ADMIN, WRITER
   - 성격: 작성자들의 전문 컨텐츠
   - 카테고리 구조: 계층적 구조 (Accounting > Financial Accounting > Cost Accounting 등)

3. **Swing Company** (스윙 컴퍼니)
   - slug: `swing-company`
   - 작성 권한: ADMIN, WRITER
   - 성격: 자유게시판 성격의 블로그
   - 특징: 24시간 최신글 우선 표시

4. **Bookstore (Story Cellar)** (북스토어 - 스토리 셀러)
   - slug: `bookstore` 또는 `story-cellar`
   - 작성 권한: ADMIN, WRITER
   - 성격: 책 관련 컨텐츠 블로그

### 2.4 성공 지표 (KPI)
- **사용자 지표**
  - 월간 활성 사용자(MAU): 500명 (3개월 내)
  - 재방문율: 50% 이상
  - 평균 세션 시간: 3분 이상

- **컨텐츠 지표**
  - 월간 포스트 발행: 20개 이상
  - 포스트당 평균 조회수: 100회 이상
  - 포스트당 평균 댓글: 3개 이상

- **관리 지표**
  - 스팸/부적절 컨텐츠 대응 시간: 24시간 이내
  - 사용자 문의 응답 시간: 48시간 이내

---

## 3. 핵심 기능 명세 (MVP)

### 3.1 사용자 인증 및 역할 관리

#### 3.1.1 회원가입/로그인
- **개요**: 이메일 기반 사용자 인증 (Supabase Auth)
- **User Story**:
  - "사용자로서, 이메일과 비밀번호로 회원가입하여 서비스를 이용하고 싶다"
  - "사용자로서, 로그인 상태를 유지하고 싶다"
- **상세 명세**:
  - **회원가입 필드**:
    - 아이디/username (필수, Unique, 프로필 식별용)
    - 이메일 (필수, Unique, 로그인에 사용)
    - 비밀번호 (필수, 최소 8자, 영문+숫자 조합)
    - 닉네임 (필수)
    - 생년월일 (선택)
  - 비밀번호 강도 검증 (최소 8자, 영문+숫자 조합)
  - Supabase Auth 기반 세션 관리 (JWT 자동 발행)
  - 비밀번호 재설정 (v1.0 이후)
- **우선순위**: Critical
- **의존성**: 없음

#### 3.1.2 역할(Role) 시스템
- **개요**: 3단계 역할로 단순하고 명확한 권한 관리
- **User Story**:
  - "관리자로서, 사용자에게 적절한 역할을 부여하여 작성 권한을 제어하고 싶다"
- **역할 정의**:
  - **VIEWER**: 기본 사용자
    - 댓글 작성/수정/삭제 (자기 것만)
    - 포스트 조회
  - **WRITER**: 작성자
    - VIEWER 권한 + 모든 블로그에 포스트 작성
    - 자기 포스트 수정/삭제
  - **ADMIN**: 전체 관리자
    - 모든 권한
    - 사용자 역할 변경
    - 포스트/댓글 강제 편집/삭제/숨김
    - 블로그/카테고리 관리
    - 블로그 이미지 및 설정 관리
- **상세 명세**:
  - 회원가입 시 기본 역할: VIEWER
  - 역할 변경은 ADMIN만 가능 (API: PATCH /api/admin/users/:id/role)
  - 라우트 가드: 서버 사이드 (middleware.ts) 및 클라이언트 사이드
- **우선순위**: Critical
- **의존성**: 3.1.1 회원가입/로그인

#### 3.1.3 프로필 관리
- **개요**: 사용자 기본 정보 관리
- **User Story**:
  - "사용자로서, 내 닉네임과 프로필을 설정하고 싶다"
- **상세 명세**:
  - 닉네임 (필수, Unique)
  - 프로필 이미지 URL (선택)
  - 자기소개 (선택)
  - 생년월일 (선택, 회원가입 시 입력 가능)
  - 이메일 (선택, 회원가입 시 입력 가능)
  - 내가 쓴 포스트 목록
  - 내가 쓴 댓글 목록
- **우선순위**: High
- **의존성**: 3.1.1

#### 3.1.4 My Page (마이페이지)
- **개요**: 사용자 개인 활동 관리 페이지
- **User Story**:
  - "사용자로서, 내가 작성한 포스트와 댓글을 한 곳에서 확인하고 싶다"
  - "사용자로서, 북마크한 포스트를 관리하고 싶다"
- **상세 명세**:
  - 경로: `/my-page` 또는 `/user/[id]`
  - 표시 내용:
    - 사용자 프로필 정보 (닉네임, 프로필 이미지, 자기소개)
    - 내가 쓴 포스트 목록 (페이지네이션 포함)
    - 내가 쓴 댓글 목록 (페이지네이션 포함)
    - 북마크한 포스트 목록 (v1.0 이후 구현 예정)
  - 각 섹션별 탭 또는 필터링 옵션
- **우선순위**: High
- **의존성**: 3.1.1

---

### 3.2 블로그 시스템

#### 3.2.1 블로그 인덱스
- **개요**: 4개 블로그를 카드 형태로 보여주는 홈페이지
- **User Story**:
  - "방문자로서, 어떤 블로그가 있는지 한눈에 보고 원하는 블로그로 이동하고 싶다"
- **상세 명세**:
  - 경로: `/` 또는 `/blogs`
  - 각 블로그 카드에 표시:
    - 블로그 이름
    - 설명
    - 커버 이미지 (선택)
    - 최근 포스트 개수
  - 카드 클릭 시 해당 블로그 홈으로 이동
  - 4개 블로그 카드 그리드 레이아웃 (2x2 또는 4열)
- **우선순위**: Critical
- **의존성**: 없음

#### 3.2.2 블로그 홈 (피드)
- **개요**: 특정 블로그의 포스트 목록
- **User Story**:
  - "방문자로서, Serein Cafe의 최신글들을 시간순으로 보고 싶다"
- **상세 명세**:
  - 경로: `/blogs/[slug]` (예: `/blogs/serein-cafe`)
  - 포스트 카드 리스트 (최신순)
  - 각 카드에 표시:
    - 제목
    - 작성자 (닉네임, 프로필 이미지)
    - 작성일 (상대 시간: "2일 전")
    - 썸네일 이미지 (선택)
    - 본문 미리보기 (첫 100자)
    - 조회수, 댓글 수
  - 카테고리 필터 (드롭다운 or 탭)
  - **페이지네이션**: 숫자 스타일 (`<< 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 >>`)
    - 이전/다음 버튼 (`<<`, `>>`)
    - 현재 페이지 강조 표시
    - 페이지 번호 클릭 시 해당 페이지로 이동
- **우선순위**: Critical
- **의존성**: 3.3 포스트 시스템

#### 3.2.3 "On Air" 통합 피드
- **개요**: 모든 블로그의 최신글을 통합하여 보여주는 피드
- **User Story**:
  - "방문자로서, 4개 블로그의 최신글을 한 곳에서 보고 싶다"
- **상세 명세**:
  - 경로: `/on-air`
  - **페이지 디자인**:
    - 배경 이미지 설정 가능 (관리자 설정)
    - 상단에 "ch0435" 로고 표시
    - 전체적인 브랜딩 일관성 유지
  - **콘텐츠 표시**:
    - 모든 블로그의 PUBLISHED 포스트를 createdAt DESC로 정렬
    - Swing Company의 경우: 24시간 이내 최신글 우선 표시
    - 포스트 카드에 블로그명 뱃지 표시 (어느 블로그 글인지 표시)
  - **필터링 옵션**:
    - 블로그별 필터링 (Serein Cafe, Studio CPA, Swing Company, Bookstore)
    - 카테고리별 필터링 (블로그 선택 시 해당 블로그의 카테고리 표시)
    - 정렬 옵션: 최신순, 조회수순, 댓글수순
  - **페이지네이션**: 숫자 스타일 (`<< 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 >>`)
- **우선순위**: High
- **의존성**: 3.3 포스트 시스템

#### 3.2.4 카테고리 시스템
- **개요**: 블로그별 포스트 분류 (계층적 구조 지원)
- **User Story**:
  - "방문자로서, Studio CPA의 'Accounting > Financial Accounting' 카테고리 글만 보고 싶다"
- **상세 명세**:
  - 각 블로그는 여러 카테고리 보유 가능
  - 카테고리는 블로그에 종속 (blogId + slug unique)
  - 경로: `/blogs/[slug]/category/[categorySlug]`
  - **계층적 구조** (Studio CPA 특화):
    - 부모-자식 관계 지원 (예: Accounting > Financial Accounting > Cost Accounting)
    - 폴더 트리 형태로 표시
    - 부모 카테고리 클릭 시 하위 카테고리 모두 포함하여 표시
  - **블로그별 카테고리 구조**:
    - **Serein Cafe**: Hostmade, Potluck, Catered event (평면 구조)
    - **Studio CPA**: Accounting > Financial Accounting > Cost Accounting 등 (계층 구조)
    - **Swing Company**: 자유게시판 성격 (카테고리 선택적)
    - **Bookstore**: 책 관련 카테고리 (평면 또는 계층 구조)
  - 카테고리는 관리자가 생성/관리
- **우선순위**: High
- **의존성**: 3.3 포스트 시스템

---

### 3.3 포스트 시스템

#### 3.3.1 포스트 작성
- **개요**: 권한이 있는 사용자가 포스트 작성
- **User Story**:
  - "WRITER로서, Serein Cafe에 글을 작성하고 싶다"
  - "WRITER로서, Studio CPA에 전문 컨텐츠를 작성하고 싶다"
- **상세 명세**:
  - 경로: `/blogs/[slug]/write`
  - 권한 검증: ADMIN, WRITER (모든 블로그 동일)
  - 입력 필드:
    - 제목 (필수)
    - 본문 (Markdown/MDX 에디터)
    - 카테고리 선택 (드롭다운)
    - 태그 입력 (쉼표 구분, 최대 5개)
    - 상태 선택: DRAFT(초안) / PUBLISHED(발행)
  - 임시 저장 기능 (localStorage or DB)
  - 이미지 업로드:
    - MVP: 외부 이미지 URL 입력
    - v1.0: S3/Cloudinary 직접 업로드
- **우선순위**: Critical
- **의존성**: 3.1.2 역할 시스템

#### 3.3.2 포스트 수정/삭제
- **개요**: 작성자 또는 관리자가 포스트 편집
- **User Story**:
  - "작성자로서, 내가 쓴 글을 수정하고 싶다"
  - "관리자로서, 부적절한 글을 삭제하고 싶다"
- **상세 명세**:
  - 경로: `/blogs/[slug]/edit/[postId]`
  - 권한 검증:
    - 본인 포스트: 수정/삭제 가능
    - ADMIN: 모든 포스트 수정/삭제 가능
  - 수정 시 updatedAt 갱신
  - 삭제 시 실제 DB 삭제 (soft delete 아님, MVP 단순화)
- **우선순위**: Critical
- **의존성**: 3.3.1

#### 3.3.3 포스트 상세 페이지
- **개요**: 포스트 전체 내용 및 댓글 표시
- **User Story**:
  - "방문자로서, 흥미로운 글의 전체 내용을 읽고 댓글을 확인하고 싶다"
- **상세 명세**:
  - 경로: `/blogs/[slug]/post/[id]`
  - 표시 내용:
    - 제목
    - 작성자 정보 (닉네임, 프로필 이미지, 작성자 페이지 링크)
    - 작성일, 수정일 (수정된 경우)
    - 블로그명, 카테고리
    - 태그 리스트 (클릭 시 태그 검색)
    - 본문 (Markdown 렌더링)
    - 조회수
    - 댓글 리스트 (3.4 참조)
  - 조회수 증가:
    - 페이지 로드 시 +1
    - **IP 기반 추적**: 동일 IP에서 중복 조회 방지 (24시간 기준)
    - **사용자 ID 기반 추적**: 로그인 사용자의 경우 User ID로도 추적
    - localStorage를 통한 클라이언트 사이드 중복 방지 (보조 수단)
  - 작성자/관리자에게만 수정/삭제 버튼 표시
- **우선순위**: Critical
- **의존성**: 3.3.1

#### 3.3.4 포스트 상태 관리
- **개요**: 포스트의 공개 상태 제어
- **상태 정의**:
  - **DRAFT**: 초안 (본인 및 ADMIN만 조회 가능)
  - **PUBLISHED**: 발행 (모두에게 공개)
  - **HIDDEN**: 숨김 (ADMIN이 숨긴 상태, 작성자도 조회 불가)
- **상세 명세**:
  - DRAFT → PUBLISHED: 작성자가 발행 버튼 클릭
  - PUBLISHED → DRAFT: 작성자가 비공개 전환
  - ANY → HIDDEN: ADMIN만 가능 (모더레이션)
- **우선순위**: High
- **의존성**: 3.3.1

---

### 3.4 댓글 시스템

#### 3.4.1 댓글 작성
- **개요**: 로그인 사용자가 포스트에 댓글 작성
- **User Story**:
  - "사용자로서, 흥미로운 글에 내 생각을 댓글로 남기고 싶다"
- **상세 명세**:
  - 로그인 필요
  - 입력: 텍스트 (최대 500자)
  - 댓글 작성 시 실시간 추가 (Optimistic UI)
  - 작성 시간 표시 (상대 시간)
- **우선순위**: High
- **의존성**: 3.1.1, 3.3.3

#### 3.4.2 댓글 수정/삭제
- **개요**: 댓글 작성자 또는 관리자가 댓글 관리
- **User Story**:
  - "사용자로서, 내가 쓴 댓글을 수정하거나 삭제하고 싶다"
  - "관리자로서, 부적절한 댓글을 삭제하고 싶다"
- **상세 명세**:
  - 본인 댓글: 수정/삭제 가능
  - ADMIN: 모든 댓글 삭제 가능 (수정은 본인만)
  - 삭제 시 실제 DB 삭제
- **우선순위**: High
- **의존성**: 3.4.1

#### 3.4.3 댓글 상태 관리
- **개요**: 댓글의 공개 상태 제어
- **상태 정의**:
  - **VISIBLE**: 공개 (기본값)
  - **HIDDEN**: 숨김 (ADMIN이 숨긴 상태)
- **상세 명세**:
  - ADMIN만 HIDDEN 상태로 변경 가능
  - HIDDEN 댓글은 "[관리자에 의해 숨겨진 댓글입니다]" 표시
- **우선순위**: Medium
- **의존성**: 3.4.1

---

### 3.5 검색 기능

#### 3.5.1 포스트 검색
- **개요**: 제목 및 본문 기반 검색 (폰트 커스터마이징 및 정렬 옵션 포함)
- **User Story**:
  - "방문자로서, 'React' 관련 글을 찾고 싶다"
  - "사용자로서, 검색 결과의 폰트 크기와 색상을 조정하고 싶다"
- **상세 명세**:
  - 경로: `/search?q=keyword`
  - 검색 대상: 제목, 본문 (LIKE 검색, PostgreSQL)
  - **검색 결과 표시**:
    - 포스트 카드 리스트
    - 블로그별 필터링 옵션
    - **정렬 옵션** (라디오 박스):
      - 최신순 (기본값)
      - 조회수순
      - 댓글수순
      - 제목순 (가나다순)
  - **폰트 커스터마이징** (검색 결과 페이지):
    - 폰트 크기 조정 (슬라이더 또는 선택 옵션)
    - 폰트 색상 선택 (색상 피커 또는 미리 정의된 색상)
    - 설정은 localStorage에 저장하여 다음 검색 시에도 유지
  - **페이지네이션**: 숫자 스타일 (`<< 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 >>`)
  - 빈 결과 처리: "검색 결과가 없습니다" 메시지
- **우선순위**: Medium
- **의존성**: 3.3 포스트 시스템

---

### 3.6 관리자 기능

#### 3.6.1 관리자 대시보드
- **개요**: 전체 시스템 통계 및 최근 활동 확인
- **User Story**:
  - "관리자로서, 사용자 수, 포스트 수, 최근 활동을 한눈에 보고 싶다"
- **상세 명세**:
  - 경로: `/admin` (ADMIN만 접근)
  - KPI 카드:
    - 전체 사용자 수
    - 활성 포스트 수 (PUBLISHED)
    - 최근 24시간 새 댓글 수
    - HIDDEN 상태 아이템 수
  - 최근 활동 테이블:
    - 최신 포스트 10개 (제목, 작성자, 상태, 작성일)
    - 최신 댓글 10개 (내용 미리보기, 작성자, 작성일)
  - 빠른 액션 버튼:
    - 포스트 숨김/복구
    - 댓글 숨김/삭제
- **우선순위**: High
- **의존성**: 3.1.2

#### 3.6.2 사용자 관리
- **개요**: 사용자 목록 및 역할 변경
- **User Story**:
  - "관리자로서, 특정 사용자를 WRITER로 승급시키고 싶다"
- **상세 명세**:
  - 경로: `/admin/users`
  - 테이블 컬럼:
    - 이메일, 닉네임, 역할, 가입일
  - 액션:
    - 역할 변경 (드롭다운)
    - 사용자 비활성화 (추후 기능)
    - 상세 보기 (작성 포스트/댓글 목록)
  - 필터: 역할별 필터링
  - 검색: 이메일/닉네임 검색
- **우선순위**: Critical
- **의존성**: 3.1.2

#### 3.6.3 포스트 관리
- **개요**: 모든 포스트 목록 및 모더레이션
- **User Story**:
  - "관리자로서, 스팸 포스트를 숨기고 싶다"
- **상세 명세**:
  - 경로: `/admin/posts`
  - 테이블 컬럼:
    - 제목, 작성자, 블로그, 상태, 작성일
  - 액션:
    - 포스트 숨김/복구 (HIDDEN ↔ PUBLISHED)
    - 포스트 삭제 (영구 삭제)
    - 제목/본문 인라인 편집 (ADMIN만)
  - 필터: 블로그별, 상태별
  - 검색: 제목 검색
  - 모더레이션 로그:
    - 누가, 언제, 무엇을, 왜 (reason 필드)
- **우선순위**: High
- **의존성**: 3.3 포스트 시스템

#### 3.6.4 댓글 관리
- **개요**: 모든 댓글 목록 및 모더레이션
- **User Story**:
  - "관리자로서, 부적절한 댓글을 삭제하고 싶다"
- **상세 명세**:
  - 경로: `/admin/comments`
  - 테이블 컬럼:
    - 댓글 내용 (미리보기), 작성자, 포스트 제목, 상태, 작성일
  - 액션:
    - 댓글 숨김/복구
    - 댓글 삭제
  - 필터: 상태별
  - 검색: 내용 검색
- **우선순위**: Medium
- **의존성**: 3.4 댓글 시스템

#### 3.6.5 블로그 디자인 및 이미지 관리
- **개요**: 블로그별 비주얼 요소 및 메타데이터 관리
- **User Story**:
  - "관리자로서, Studio CPA의 커버 이미지와 로고를 변경하고 싶다"
  - "관리자로서, Serein Cafe의 테마 색상을 변경하고 싶다"
  - "관리자로서, 각 블로그에 새 카테고리를 추가하고 싶다"
- **상세 명세**:
  - 경로: `/admin/blogs`

  - **블로그 기본 정보 관리**:
    - 블로그 이름 수정
    - 설명(description) 수정
    - 가시성 토글 (visibility) - 블로그 숨김/공개
    - slug 변경 (주의: URL 변경됨)

  - **이미지 관리**:
    - **커버 이미지**: 블로그 홈 상단 배경 이미지
      - 이미지 URL 입력 또는 파일 업로드
      - 미리보기 제공
      - 권장 크기: 1920x600px
    - **로고 이미지**: 블로그 헤더에 표시되는 로고
      - 이미지 URL 입력 또는 파일 업로드
      - 권장 크기: 200x200px (투명 배경 PNG)
    - **썸네일**: 블로그 인덱스 카드에 표시
      - 권장 크기: 800x500px
    - 이미지 업로드 방식:
      - MVP: 외부 이미지 URL 입력
      - v1.0 이후: 직접 업로드 (S3/Cloudinary)

  - **디자인 커스터마이징**:
    - **테마 색상 (Primary Color)**:
      - 색상 피커로 선택
      - 블로그 특정 요소(버튼, 링크, 강조 등)에 적용
    - **폰트 선택**:
      - 제목 폰트 (Heading Font)
      - 본문 폰트 (Body Font)
      - 미리 정의된 폰트 목록에서 선택
    - **레이아웃 옵션**:
      - 포스트 카드 스타일 (그리드/리스트)
      - 사이드바 위치 (왼쪽/오른쪽/없음)

  - **카테고리 CRUD**:
    - 블로그별 카테고리 목록
    - 카테고리 추가/수정/삭제
    - slug 자동 생성 (name → slug)
    - 카테고리 순서 변경 (드래그 앤 드롭)

  - **UI 구성**:
    - 4개 블로그 탭 (Serein Cafe, Studio CPA, Swing Company, Bookstore)
    - 각 탭에 해당 블로그 설정 폼 표시
    - 실시간 미리보기 패널 (옵션)
    - "변경사항 저장" 버튼

- **우선순위**: High
- **의존성**: 3.2 블로그 시스템

---

### 3.7 알림/이메일 (경량)

#### 3.7.1 신규 댓글 알림
- **개요**: 포스트 작성자에게 새 댓글 알림
- **User Story**:
  - "작성자로서, 내 글에 댓글이 달렸을 때 이메일로 알림받고 싶다"
- **상세 명세**:
  - 트리거: 댓글 작성 시
  - 수신자: 포스트 작성자 (본인 댓글 제외)
  - 이메일 내용:
    - 포스트 제목
    - 댓글 작성자
    - 댓글 내용 (첫 100자)
    - 포스트 링크
  - SMTP 또는 트랜잭셔널 서비스 (Resend, SendGrid 등)
- **우선순위**: Low (MVP 선택 기능)
- **의존성**: 3.4.1

#### 3.7.2 비밀번호 재설정 이메일
- **개요**: 비밀번호 찾기 이메일 발송
- **User Story**:
  - "사용자로서, 비밀번호를 잊어버렸을 때 이메일로 재설정 링크를 받고 싶다"
- **상세 명세**:
  - 경로: `/auth/reset-password`
  - 프로세스:
    1. 이메일 입력
    2. 토큰 생성 (1시간 유효)
    3. 이메일 발송 (재설정 링크)
    4. 링크 클릭 시 새 비밀번호 입력
  - 보안: 토큰은 1회용, 만료 시간 체크
- **우선순위**: Medium
- **의존성**: 3.1.1

---

## 4. 데이터베이스 스키마 (Prisma)

### 4.1 User (사용자)
```prisma
model User {
  id            String    @id @default(cuid())
  username      String    @unique // 로그인 ID
  email         String?   @unique // 선택적 이메일
  passwordHash  String
  name          String    // 닉네임/이름
  birthDate     DateTime? // 생년월일 (선택)
  avatarUrl     String?
  role          Role      @default(USER)
  posts         Post[]
  comments      Comment[]
  moderations   ModerationLog[] @relation("Moderator")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role { ADMIN WRITER USER }
```

### 4.2 Blog (블로그)
```prisma
model Blog {
  id              String     @id @default(cuid())
  slug            String     @unique
  name            String
  description     String?
  visibility      Boolean    @default(true)

  // 이미지
  coverImageUrl   String?    // 커버 이미지 (1920x600px)
  logoImageUrl    String?    // 로고 (200x200px)
  thumbnailUrl    String?    // 썸네일 (800x500px)

  // 디자인 커스터마이징
  primaryColor    String?    @default("#3B82F6") // Hex 색상 코드
  headingFont     String?    @default("Inter")
  bodyFont        String?    @default("Inter")
  layoutStyle     String?    @default("grid") // "grid" | "list"
  sidebarPosition String?    @default("right") // "left" | "right" | "none"

  categories      Category[]
  posts           Post[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

### 4.3 Category (카테고리)
```prisma
model Category {
  id          String     @id @default(cuid())
  blog        Blog       @relation(fields: [blogId], references: [id])
  blogId      String
  name        String
  slug        String
  parentId    String?    // 부모 카테고리 ID (계층 구조 지원)
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  order       Int        @default(0) // 정렬 순서
  posts       Post[]
  @@unique([blogId, slug])
}
```

### 4.4 Post (포스트)
```prisma
model Post {
  id         String      @id @default(cuid())
  blog       Blog        @relation(fields: [blogId], references: [id])
  blogId     String
  author     User        @relation(fields: [authorId], references: [id])
  authorId   String
  title      String
  content    String      // Markdown/MDX
  status     PostStatus  @default(PUBLISHED)
  tags       PostTag[]
  category   Category?   @relation(fields: [categoryId], references: [id])
  categoryId String?
  comments   Comment[]
  viewCount  Int         @default(0)
  viewLogs   PostViewLog[] // IP 기반 조회수 추적
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  @@index([blogId, status, createdAt])
}

model PostViewLog {
  id        String   @id @default(cuid())
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  ipAddress String   // IP 주소
  userId    String?  // 로그인 사용자 ID (선택)
  viewedAt  DateTime @default(now())
  @@index([postId, ipAddress, viewedAt])
  @@index([postId, userId, viewedAt])
}
```

enum PostStatus { PUBLISHED DRAFT HIDDEN }
```

### 4.5 Tag (태그)
```prisma
model Tag {
  id    String    @id @default(cuid())
  name  String
  slug  String    @unique
  posts PostTag[]
}

model PostTag {
  post   Post   @relation(fields: [postId], references: [id])
  postId String
  tag    Tag    @relation(fields: [tagId], references: [id])
  tagId  String
  @@id([postId, tagId])
}
```

### 4.6 Comment (댓글)
```prisma
model Comment {
  id        String        @id @default(cuid())
  post      Post          @relation(fields: [postId], references: [id])
  postId    String
  author    User          @relation(fields: [authorId], references: [id])
  authorId  String
  content   String
  status    CommentStatus @default(VISIBLE)
  createdAt DateTime      @default(now())
  @@index([postId, createdAt])
}

enum CommentStatus { VISIBLE HIDDEN }
```

### 4.7 ModerationLog (모더레이션 로그)
```prisma
model ModerationLog {
  id         String   @id @default(cuid())
  targetType String   // "POST" | "COMMENT"
  targetId   String
  action     String   // "HIDE" | "UNHIDE" | "EDIT" | "DELETE"
  actor      User     @relation("Moderator", fields: [actorId], references: [id])
  actorId    String
  reason     String?
  createdAt  DateTime @default(now())
  @@index([targetType, targetId])
}
```

### 4.8 PasswordResetToken (비밀번호 재설정 토큰)
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  token     String   @unique
  expiresAt DateTime
}
```

---

## 5. API 명세

### 5.1 인증 API (Auth.js)
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/auth/[...nextauth]` | NextAuth 핸들러 | Public |
| POST | `/api/auth/register` | 회원가입 (이메일, PW, username, 닉네임, 생년월일) | Public |
| POST | `/api/auth/login` | 로그인 (이메일, PW) | Public |

### 5.2 포스트 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/posts` | 포스트 목록 (쿼리: blogId, status, page) | Public |
| POST | `/api/posts` | 포스트 작성 | WRITER+ |
| GET | `/api/posts/[id]` | 포스트 상세 | Public |
| PATCH | `/api/posts/[id]` | 포스트 수정 | 작성자 or ADMIN |
| DELETE | `/api/posts/[id]` | 포스트 삭제 | 작성자 or ADMIN |

### 5.3 댓글 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/comments` | 댓글 작성 | USER+ |
| GET | `/api/comments?postId=xxx` | 댓글 목록 | Public |
| PATCH | `/api/comments/[id]` | 댓글 수정 | 작성자 |
| DELETE | `/api/comments/[id]` | 댓글 삭제 | 작성자 or ADMIN |

### 5.4 블로그 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/blogs` | 블로그 목록 | Public |
| GET | `/api/blogs/[slug]` | 블로그 상세 (설정 포함) | Public |
| PATCH | `/api/blogs/[id]` | 블로그 설정 업데이트 (이미지, 디자인) | ADMIN |

### 5.5 검색 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/search?q=keyword&blogId=xxx&sort=latest&page=1` | 포스트 검색 (정렬 옵션 포함) | Public |
| GET | `/api/search/settings` | 검색 설정 조회 (폰트 크기, 색상 등) | Public |
| POST | `/api/search/settings` | 검색 설정 저장 (localStorage 백업) | USER+ |

### 5.6 관리자 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| PATCH | `/api/admin/users/[id]/role` | 역할 변경 | ADMIN |
| POST | `/api/admin/moderation` | 포스트/댓글 숨김/복구 | ADMIN |
| GET | `/api/admin/stats` | 대시보드 통계 | ADMIN |

### 5.7 My Page API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/api/my/posts` | 내가 쓴 포스트 목록 | USER+ |
| GET | `/api/my/comments` | 내가 쓴 댓글 목록 | USER+ |
| GET | `/api/my/bookmarks` | 북마크한 포스트 목록 (v1.0) | USER+ |

### 5.8 조회수 추적 API
| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/posts/[id]/view` | 포스트 조회수 증가 (IP 기반 중복 방지) | Public |
| GET | `/api/posts/[id]/views` | 포스트 조회수 통계 (IP별, User별) | ADMIN |

---

## 6. 화면 설계 (Wireframe 설명)

### 6.1 홈 (블로그 인덱스)
- Header: 로고 (ch0435), 검색, 로그인/프로필
- Hero Section: "4개의 특별한 공간" 메시지
- 4개 블로그 카드 (그리드 레이아웃: 2x2 또는 4열)
- Footer: 저작권, 링크

### 6.2 블로그 홈
- Header (동일)
- 블로그 정보 (이름, 설명)
- 카테고리 탭
- 포스트 카드 리스트
- Sidebar: "On Air" 링크, 인기 포스트

### 6.3 포스트 상세
- Header
- 포스트 내용 (제목, 메타, 본문)
- 댓글 섹션
- 관련 포스트 (같은 블로그)

### 6.4 포스트 작성
- Header
- 에디터 (제목, 카테고리, 태그, 본문)
- 임시저장/발행 버튼

### 6.5 관리자 대시보드
- Sidebar: Dashboard, Users, Posts, Comments, Blogs
- Main: KPI 카드, 최근 활동 테이블

### 6.6 My Page (마이페이지)
- Header (동일)
- 프로필 섹션: 닉네임, 프로필 이미지, 자기소개
- 탭 메뉴: 내 포스트, 내 댓글, 북마크 (v1.0)
- 포스트/댓글 목록: 카드 형태 또는 테이블 형태
- 페이지네이션: 숫자 스타일 (`<< 1, 2, 3... >>`)

### 6.7 On Air 페이지 (상세)
- 배경 이미지 (전체 화면)
- 상단: ch0435 로고
- 필터 섹션:
  - 블로그 선택 (라디오 또는 체크박스)
  - 카테고리 선택 (블로그 선택 시 표시)
  - 정렬 옵션 (라디오 박스): 최신순, 조회수순, 댓글수순
- 포스트 카드 리스트 (배경 이미지 위에 반투명 배경)
- 페이지네이션: 숫자 스타일 (`<< 1, 2, 3... >>`)

### 6.8 검색 결과 페이지
- 검색어 표시
- 폰트 설정 패널:
  - 폰트 크기 슬라이더
  - 폰트 색상 선택기
- 정렬 옵션 (라디오 박스): 최신순, 조회수순, 댓글수순, 제목순
- 블로그 필터 (체크박스)
- 검색 결과 리스트
- 페이지네이션: 숫자 스타일 (`<< 1, 2, 3... >>`)

---

## 7. 품질 및 운영

### 7.1 접근성
- 키보드 포커스 관리 (탭 네비게이션)
- ARIA 속성 적용
- 색상 대비 준수 (WCAG 2.1 AA)

### 7.2 UX
- 전역 로딩 스피너 (Next.js loading.tsx)
- 에러 바운더리 (error.tsx)
- Toast 알림 (성공/실패 메시지)
- 404/500 페이지

### 7.3 분석
- 페이지뷰 트래킹 (Google Analytics 또는 Vercel Analytics)
- 주요 이벤트 로깅 (포스트 작성, 댓글 작성)

---

## 8. 향후 로드맵 (v1.0 이후)

### v1.0 (Q2 2025)
- 소셜 로그인 (Google, Kakao OAuth)
- 이미지 직접 업로드 (S3/Cloudinary)
- 포스트 북마크
- 알림 이메일 활성화
- 고급 검색 (전문 검색, PostgreSQL Full-Text Search)
- SEO 최적화 (메타 태그, sitemap.xml, robots.txt)

### v2.0 (Q3 2025)
- 실시간 알림 (WebSocket or Server-Sent Events)
- 포스트 공유 기능 (Twitter, Facebook)
- 통계 대시보드 확장 (차트, 그래프)
- RSS 피드 생성
- 다국어 지원 (i18n)
- 다크 모드

---

## 9. 성공 기준 (DoD: Definition of Done)

### 단위 기능 DoD
- [ ] 단위/통합 테스트 통과 (핵심 도메인: Auth, 권한 가드, Post CRUD, Role 변경)
- [ ] TypeScript 타입 에러 없음
- [ ] ESLint 경고 없음
- [ ] 접근성 체크 (키보드 포커스, 콘트라스트)
- [ ] PR 리뷰 1인 이상
- [ ] 미해결 TODO 없음

### MVP 릴리스 DoD
- [ ] 4개 블로그 모두 정상 동작
- [ ] 역할별 권한 제어 검증 완료
- [ ] 관리자 대시보드 기본 기능 동작
- [ ] On Air 페이지 배경 이미지 및 로고 표시 정상 동작
- [ ] 계층적 카테고리 구조 (Studio CPA) 정상 동작
- [ ] IP 기반 조회수 추적 정상 동작
- [ ] 검색 페이지 폰트 커스터마이징 및 정렬 옵션 정상 동작
- [ ] 페이지네이션 숫자 스타일 정상 동작
- [ ] My Page 기능 정상 동작
- [ ] 프로덕션 배포 (Vercel) 성공
- [ ] 스모크 테스트 통과 (로그인→글 작성→댓글→관리자 숨김 플로우)
- [ ] 문서화 완료 (README, API 문서)

---

**문서 버전**: 2.0
**마지막 업데이트**: 2026-02-12
**작성자**: Product Team
**승인자**: [Your Name]

---

## 10. CSV 기반 추가 요구사항 (2026-02-12 업데이트)

### 10.1 도메인 및 브랜딩
- **도메인**: ch0435.com
- **로고**: ch0435 브랜드 로고 (On Air 페이지 상단 표시)

### 10.2 블로그 확장
- **4번째 블로그 추가**: Bookstore (Story Cellar)
- **Swing Company 특화**: 24시간 이내 최신글 우선 표시 (On Air 페이지)

### 10.3 사용자 인증
- **회원가입 필드**: 이메일(필수), PW, username, 닉네임, 생년월일(선택)
- **로그인 방식**: 이메일 기반 로그인 (Supabase Auth)

### 10.4 My Page 기능
- 사용자 포스트 목록
- 사용자 댓글 목록
- 북마크 기능 (v1.0 이후)

### 10.5 카테고리 시스템 개선
- **계층적 구조 지원**: Studio CPA의 Accounting > Financial Accounting > Cost Accounting 구조
- **블로그별 특화 카테고리**:
  - Serein Cafe: Hostmade, Potluck, Catered event
  - Studio CPA: 계층적 구조
  - Swing Company: 자유게시판 성격

### 10.6 검색 기능 고도화
- **폰트 커스터마이징**: 크기, 색상 조정 가능
- **정렬 옵션**: 최신순, 조회수순, 댓글수순, 제목순 (라디오 박스)

### 10.7 페이지네이션 스타일
- **숫자 스타일**: `<< 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 >>`
- 이전/다음 버튼 포함
- 현재 페이지 강조 표시

### 10.8 조회수 추적 개선
- **IP 기반 추적**: 동일 IP에서 24시간 내 중복 조회 방지
- **User ID 기반 추적**: 로그인 사용자의 경우 User ID로도 추적
- **PostViewLog 모델 추가**: 조회 이력 저장

### 10.9 On Air 페이지 디자인
- 배경 이미지 설정 가능
- ch0435 로고 상단 표시
- 향상된 필터링 옵션 (블로그별, 카테고리별)
