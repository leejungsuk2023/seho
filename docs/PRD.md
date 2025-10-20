# PRD (Product Requirements Document)
# 세호 (SEHO) - 취향 공동체를 위한 복합 문화 플랫폼

## 1. 프로젝트 개요
- **프로젝트명**: 세호 (SEHO)
- **버전**: MVP v0.1
- **작성일**: 2025-01-19
- **최종 수정일**: 2025-01-19
- **작성자**: Product Team

---

## 2. 프로젝트 비전 및 목표

### 2.1 비전
"취향을 중심으로 사람들을 연결하고, 문화 경험을 공유하는 커뮤니티 플랫폼"

### 2.2 핵심 목표
1. **취향 기반 커뮤니티 형성**: 사용자들이 자신의 취향을 표현하고 비슷한 취향을 가진 사람들과 연결
2. **문화 정보 큐레이션**: 전시, 공연, 이벤트 등 다양한 문화 정보를 한 곳에서 제공
3. **소셜 네트워킹**: 온라인에서의 관계를 오프라인 문화 활동으로 확장
4. **개인 맞춤 추천**: AI 기반 취향 분석을 통한 맞춤형 문화 컨텐츠 추천

### 2.3 성공 지표 (KPI)
- **사용자 지표**
  - MAU (Monthly Active Users): 1,000명 (3개월 내)
  - 재방문율: 40% 이상
  - 평균 세션 시간: 5분 이상

- **참여 지표**
  - 게시글 작성: 평균 주 1회
  - 커뮤니티 참여율: 60%
  - 이벤트 참여율: 30%

- **만족도 지표**
  - NPS(Net Promoter Score): 50 이상
  - 앱 평점: 4.5/5.0 이상

---

## 3. 핵심 기능 명세 (MVP)

### 3.1 사용자 인증 및 프로필 관리

#### 3.1.1 회원가입/로그인
- **개요**: 사용자가 플랫폼에 가입하고 로그인할 수 있는 기능
- **User Story**: 
  - "사용자로서, 이메일과 비밀번호로 회원가입하여 서비스를 이용하고 싶다"
  - "사용자로서, 소셜 로그인으로 간편하게 가입하고 싶다"
- **상세 명세**:
  - 이메일 + 비밀번호 회원가입
  - 소셜 로그인 (Google, Kakao)
  - 이메일 인증
  - 비밀번호 재설정
- **우선순위**: Critical
- **의존성**: 없음

#### 3.1.2 프로필 설정
- **개요**: 사용자가 자신의 프로필 정보를 관리할 수 있는 기능
- **User Story**: 
  - "사용자로서, 내 프로필에 취향과 관심사를 표시하여 다른 사람들에게 나를 소개하고 싶다"
- **상세 명세**:
  - 기본 정보 (닉네임, 프로필 이미지, 소개글)
  - 취향 태그 선택 (최대 10개)
  - 관심 카테고리 설정 (전시, 공연, 영화, 음악 등)
- **우선순위**: High
- **의존성**: 3.1.1 회원가입/로그인

### 3.2 취향 기반 커뮤니티

#### 3.2.1 커뮤니티 생성/참여
- **개요**: 특정 취향이나 주제를 중심으로 소규모 커뮤니티를 만들고 참여하는 기능
- **User Story**: 
  - "사용자로서, 내가 좋아하는 전시회에 대해 이야기할 수 있는 커뮤니티를 만들고 싶다"
  - "사용자로서, 관심 있는 주제의 커뮤니티에 참여하고 싶다"
- **상세 명세**:
  - 커뮤니티 생성 (제목, 설명, 카테고리, 커버 이미지)
  - 커뮤니티 검색/탐색
  - 커뮤니티 가입/탈퇴
  - 멤버 관리 (오픈형/승인형)
- **우선순위**: Critical
- **의존성**: 3.1.2 프로필 설정

#### 3.2.2 게시글 작성 및 상호작용
- **개요**: 커뮤니티 내에서 게시글을 작성하고 소통하는 기능
- **User Story**: 
  - "사용자로서, 내가 다녀온 전시회 후기를 사진과 함께 공유하고 싶다"
  - "사용자로서, 다른 사람의 게시글에 댓글을 남기고 의견을 나누고 싶다"
- **상세 명세**:
  - 게시글 작성 (텍스트, 이미지, 링크)
  - 게시글 수정/삭제
  - 댓글 작성/수정/삭제
  - 좋아요/북마크
- **우선순위**: Critical
- **의존성**: 3.2.1 커뮤니티 생성/참여

### 3.3 문화 컨텐츠 정보

#### 3.3.1 이벤트/전시 정보 등록
- **개요**: 전시, 공연, 문화 행사 정보를 등록하고 공유하는 기능
- **User Story**: 
  - "사용자로서, 내가 발견한 흥미로운 전시회 정보를 공유하고 싶다"
  - "관리자로서, 큐레이션된 문화 행사 정보를 제공하고 싶다"
- **상세 명세**:
  - 이벤트 정보 등록 (제목, 설명, 날짜, 장소, 카테고리, 이미지)
  - 이벤트 상세 페이지
  - 카테고리별 분류
  - 날짜별 필터링
- **우선순위**: High
- **의존성**: 3.1.2 프로필 설정

#### 3.3.2 검색 및 필터링
- **개요**: 사용자가 원하는 문화 컨텐츠를 쉽게 찾을 수 있는 기능
- **User Story**: 
  - "사용자로서, 이번 주말에 볼 수 있는 전시회를 찾고 싶다"
  - "사용자로서, '현대미술' 카테고리의 이벤트만 보고 싶다"
- **상세 명세**:
  - 키워드 검색
  - 카테고리 필터
  - 날짜 범위 필터
  - 지역 필터
- **우선순위**: High
- **의존성**: 3.3.1 이벤트/전시 정보 등록

### 3.4 맞춤 추천 (Optional for MVP)

#### 3.4.1 취향 기반 추천
- **개요**: 사용자의 취향 태그와 활동 이력을 기반으로 맞춤형 컨텐츠 추천
- **User Story**: 
  - "사용자로서, 내 취향에 맞는 전시회를 자동으로 추천받고 싶다"
- **상세 명세**:
  - 사용자 프로필 태그 기반 추천
  - 활동 이력 기반 추천 (좋아요, 북마크, 참여한 커뮤니티)
  - 유사 사용자 기반 추천
- **우선순위**: Medium (MVP 이후 고려)
- **의존성**: 3.1.2, 3.2.2, 3.3.1

---

## 4. 데이터베이스 스키마

### 4.1 사용자 (users)
- **목적**: 사용자 기본 정보 관리
- **컬럼**:
  - `id` (UUID, PK): 사용자 고유 ID
  - `email` (String, Unique): 이메일
  - `password_hash` (String): 암호화된 비밀번호
  - `nickname` (String, Unique): 닉네임
  - `profile_image_url` (String, Nullable): 프로필 이미지 URL
  - `bio` (Text, Nullable): 자기소개
  - `provider` (Enum): 가입 방법 (local, google, kakao)
  - `provider_id` (String, Nullable): 소셜 로그인 제공자 ID
  - `is_verified` (Boolean): 이메일 인증 여부
  - `created_at` (Timestamp): 생성일
  - `updated_at` (Timestamp): 수정일
- **관계**:
  - 1:N with user_tags
  - 1:N with user_interests
  - 1:N with community_memberships
  - 1:N with posts

### 4.2 취향 태그 (tags)
- **목적**: 전체 시스템에서 사용되는 태그 목록
- **컬럼**:
  - `id` (UUID, PK): 태그 ID
  - `name` (String, Unique): 태그 이름
  - `category` (String): 태그 카테고리
  - `usage_count` (Integer): 사용 횟수
  - `created_at` (Timestamp): 생성일
- **관계**:
  - 1:N with user_tags
  - 1:N with community_tags

### 4.3 사용자 태그 (user_tags)
- **목적**: 사용자가 선택한 취향 태그 (중간 테이블)
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK): 사용자 ID
  - `tag_id` (UUID, FK): 태그 ID
  - `created_at` (Timestamp): 생성일
- **관계**:
  - N:1 with users
  - N:1 with tags

### 4.4 관심 카테고리 (interests)
- **목적**: 문화 카테고리 목록
- **컬럼**:
  - `id` (UUID, PK)
  - `name` (String, Unique): 카테고리 이름 (전시, 공연, 영화 등)
  - `icon` (String): 아이콘 이름
  - `created_at` (Timestamp)
- **관계**:
  - 1:N with user_interests
  - 1:N with events

### 4.5 사용자 관심사 (user_interests)
- **목적**: 사용자가 선택한 관심 카테고리 (중간 테이블)
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK)
  - `interest_id` (UUID, FK)
  - `created_at` (Timestamp)
- **관계**:
  - N:1 with users
  - N:1 with interests

### 4.6 커뮤니티 (communities)
- **목적**: 취향 기반 커뮤니티 정보
- **컬럼**:
  - `id` (UUID, PK)
  - `name` (String): 커뮤니티 이름
  - `description` (Text): 설명
  - `cover_image_url` (String, Nullable): 커버 이미지
  - `creator_id` (UUID, FK): 생성자 ID
  - `category` (String): 카테고리
  - `type` (Enum): 커뮤니티 타입 (open, approval)
  - `member_count` (Integer): 멤버 수
  - `post_count` (Integer): 게시글 수
  - `is_active` (Boolean): 활성화 여부
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
- **관계**:
  - N:1 with users (creator)
  - 1:N with community_memberships
  - 1:N with posts
  - 1:N with community_tags

### 4.7 커뮤니티 태그 (community_tags)
- **목적**: 커뮤니티에 연결된 태그 (중간 테이블)
- **컬럼**:
  - `id` (UUID, PK)
  - `community_id` (UUID, FK)
  - `tag_id` (UUID, FK)
  - `created_at` (Timestamp)
- **관계**:
  - N:1 with communities
  - N:1 with tags

### 4.8 커뮤니티 멤버십 (community_memberships)
- **목적**: 사용자와 커뮤니티 간의 관계
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK)
  - `community_id` (UUID, FK)
  - `role` (Enum): 역할 (admin, moderator, member)
  - `status` (Enum): 상태 (active, pending, banned)
  - `joined_at` (Timestamp)
  - `updated_at` (Timestamp)
- **관계**:
  - N:1 with users
  - N:1 with communities

### 4.9 게시글 (posts)
- **목적**: 커뮤니티 내 게시글
- **컬럼**:
  - `id` (UUID, PK)
  - `community_id` (UUID, FK)
  - `author_id` (UUID, FK)
  - `title` (String)
  - `content` (Text)
  - `image_urls` (Array<String>, Nullable): 이미지 URL 배열
  - `like_count` (Integer)
  - `comment_count` (Integer)
  - `view_count` (Integer)
  - `is_pinned` (Boolean): 고정 여부
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
- **관계**:
  - N:1 with communities
  - N:1 with users (author)
  - 1:N with comments
  - 1:N with likes
  - 1:N with bookmarks

### 4.10 댓글 (comments)
- **목적**: 게시글에 대한 댓글
- **컬럼**:
  - `id` (UUID, PK)
  - `post_id` (UUID, FK)
  - `author_id` (UUID, FK)
  - `content` (Text)
  - `parent_id` (UUID, FK, Nullable): 대댓글용 부모 댓글 ID
  - `like_count` (Integer)
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
- **관계**:
  - N:1 with posts
  - N:1 with users (author)
  - 1:N with comments (self-referencing, 대댓글)

### 4.11 좋아요 (likes)
- **목적**: 게시글/댓글 좋아요
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK)
  - `target_type` (Enum): 대상 타입 (post, comment)
  - `target_id` (UUID): 대상 ID
  - `created_at` (Timestamp)
- **관계**:
  - N:1 with users
  - Polymorphic relationship with posts/comments

### 4.12 북마크 (bookmarks)
- **목적**: 게시글 북마크/저장
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK)
  - `post_id` (UUID, FK)
  - `created_at` (Timestamp)
- **관계**:
  - N:1 with users
  - N:1 with posts

### 4.13 이벤트 (events)
- **목적**: 문화 행사/전시 정보
- **컬럼**:
  - `id` (UUID, PK)
  - `title` (String): 제목
  - `description` (Text): 설명
  - `interest_id` (UUID, FK): 카테고리
  - `location` (String): 장소
  - `address` (String): 주소
  - `latitude` (Decimal, Nullable): 위도
  - `longitude` (Decimal, Nullable): 경도
  - `start_date` (Date): 시작일
  - `end_date` (Date): 종료일
  - `image_urls` (Array<String>): 이미지 URL 배열
  - `link_url` (String, Nullable): 외부 링크
  - `price` (String, Nullable): 가격 정보
  - `organizer` (String, Nullable): 주최자
  - `creator_id` (UUID, FK): 등록자 ID
  - `view_count` (Integer)
  - `bookmark_count` (Integer)
  - `status` (Enum): 상태 (draft, published, ended)
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)
- **관계**:
  - N:1 with interests (category)
  - N:1 with users (creator)
  - 1:N with event_bookmarks

### 4.14 이벤트 북마크 (event_bookmarks)
- **목적**: 이벤트 북마크/관심 표시
- **컬럼**:
  - `id` (UUID, PK)
  - `user_id` (UUID, FK)
  - `event_id` (UUID, FK)
  - `created_at` (Timestamp)
- **관계**:
  - N:1 with users
  - N:1 with events

---

## 5. API 명세

### 5.1 인증 (Authentication)

#### POST /api/auth/register
**설명**: 이메일 회원가입
**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "user123"
}
```
**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "user123",
      "is_verified": false
    },
    "token": "jwt_token"
  }
}
```
**Error Handling**:
- 400: 이메일/닉네임 중복, 유효하지 않은 입력
- 500: 서버 오류

#### POST /api/auth/login
**설명**: 로그인
**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "user123"
    },
    "token": "jwt_token"
  }
}
```

#### POST /api/auth/social
**설명**: 소셜 로그인 (Google, Kakao)
**Request**:
```json
{
  "provider": "google",
  "token": "social_provider_token"
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "user123"
    },
    "token": "jwt_token",
    "is_new_user": false
  }
}
```

#### POST /api/auth/verify-email
**설명**: 이메일 인증
**Request**:
```json
{
  "token": "verification_token"
}
```
**Response (200)**:
```json
{
  "success": true,
  "message": "이메일이 인증되었습니다."
}
```

### 5.2 프로필 (Profile)

#### GET /api/users/:userId
**설명**: 사용자 프로필 조회
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nickname": "user123",
    "profile_image_url": "https://...",
    "bio": "안녕하세요!",
    "tags": ["현대미술", "재즈", "독립영화"],
    "interests": ["전시", "공연", "영화"],
    "community_count": 5,
    "post_count": 23,
    "created_at": "2025-01-19T00:00:00Z"
  }
}
```

#### PATCH /api/users/:userId
**설명**: 프로필 수정
**Request**:
```json
{
  "nickname": "new_nickname",
  "bio": "새로운 소개글",
  "profile_image_url": "https://..."
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nickname": "new_nickname",
    "bio": "새로운 소개글"
  }
}
```

#### PUT /api/users/:userId/tags
**설명**: 취향 태그 업데이트
**Request**:
```json
{
  "tag_ids": ["uuid1", "uuid2", "uuid3"]
}
```
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "tags": ["현대미술", "재즈", "독립영화"]
  }
}
```

### 5.3 커뮤니티 (Communities)

#### GET /api/communities
**설명**: 커뮤니티 목록 조회
**Query Parameters**:
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 20)
- `category`: 카테고리 필터
- `search`: 검색 키워드
- `sort`: 정렬 (popular, recent, members)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "communities": [
      {
        "id": "uuid",
        "name": "현대미술 감상 모임",
        "description": "현대미술을 사랑하는 사람들의 모임",
        "cover_image_url": "https://...",
        "category": "전시",
        "member_count": 127,
        "post_count": 342,
        "tags": ["현대미술", "전시"],
        "is_joined": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "has_more": true
    }
  }
}
```

#### POST /api/communities
**설명**: 커뮤니티 생성
**Request**:
```json
{
  "name": "재즈 애호가 모임",
  "description": "재즈를 사랑하는 사람들",
  "category": "음악",
  "type": "open",
  "cover_image_url": "https://...",
  "tag_ids": ["uuid1", "uuid2"]
}
```
**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "재즈 애호가 모임",
    "creator_id": "uuid",
    "member_count": 1
  }
}
```

#### GET /api/communities/:communityId
**설명**: 커뮤니티 상세 조회
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "현대미술 감상 모임",
    "description": "...",
    "cover_image_url": "https://...",
    "creator": {
      "id": "uuid",
      "nickname": "creator123"
    },
    "category": "전시",
    "type": "open",
    "member_count": 127,
    "post_count": 342,
    "tags": ["현대미술", "전시"],
    "is_joined": true,
    "my_role": "member",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### POST /api/communities/:communityId/join
**설명**: 커뮤니티 가입
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "status": "active",
    "role": "member",
    "joined_at": "2025-01-19T00:00:00Z"
  }
}
```

#### DELETE /api/communities/:communityId/leave
**설명**: 커뮤니티 탈퇴
**Response (200)**:
```json
{
  "success": true,
  "message": "커뮤니티에서 탈퇴했습니다."
}
```

### 5.4 게시글 (Posts)

#### GET /api/communities/:communityId/posts
**설명**: 커뮤니티 게시글 목록
**Query Parameters**:
- `page`, `limit`, `sort` (recent, popular)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "community_id": "uuid",
        "author": {
          "id": "uuid",
          "nickname": "user123",
          "profile_image_url": "https://..."
        },
        "title": "오늘 다녀온 전시회 후기",
        "content": "정말 좋았어요...",
        "image_urls": ["https://..."],
        "like_count": 45,
        "comment_count": 12,
        "view_count": 234,
        "is_liked": false,
        "is_bookmarked": false,
        "created_at": "2025-01-19T00:00:00Z"
      }
    ],
    "pagination": { "..." }
  }
}
```

#### POST /api/communities/:communityId/posts
**설명**: 게시글 작성
**Request**:
```json
{
  "title": "제목",
  "content": "내용",
  "image_urls": ["https://..."]
}
```
**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "제목",
    "created_at": "2025-01-19T00:00:00Z"
  }
}
```

#### GET /api/posts/:postId
**설명**: 게시글 상세 조회
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "community": {
      "id": "uuid",
      "name": "커뮤니티명"
    },
    "author": { "..." },
    "title": "제목",
    "content": "내용",
    "image_urls": ["https://..."],
    "like_count": 45,
    "comment_count": 12,
    "view_count": 235,
    "is_liked": false,
    "is_bookmarked": false,
    "created_at": "2025-01-19T00:00:00Z"
  }
}
```

#### PATCH /api/posts/:postId
**설명**: 게시글 수정
**Request**:
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

#### DELETE /api/posts/:postId
**설명**: 게시글 삭제
**Response (200)**:
```json
{
  "success": true,
  "message": "게시글이 삭제되었습니다."
}
```

#### POST /api/posts/:postId/like
**설명**: 게시글 좋아요
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "is_liked": true,
    "like_count": 46
  }
}
```

#### DELETE /api/posts/:postId/like
**설명**: 게시글 좋아요 취소

#### POST /api/posts/:postId/bookmark
**설명**: 게시글 북마크

### 5.5 댓글 (Comments)

#### GET /api/posts/:postId/comments
**설명**: 게시글 댓글 목록
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "author": {
          "id": "uuid",
          "nickname": "commenter",
          "profile_image_url": "https://..."
        },
        "content": "댓글 내용",
        "like_count": 5,
        "is_liked": false,
        "replies": [
          {
            "id": "uuid",
            "author": { "..." },
            "content": "대댓글 내용",
            "created_at": "2025-01-19T00:00:00Z"
          }
        ],
        "created_at": "2025-01-19T00:00:00Z"
      }
    ]
  }
}
```

#### POST /api/posts/:postId/comments
**설명**: 댓글 작성
**Request**:
```json
{
  "content": "댓글 내용",
  "parent_id": "uuid"  // 대댓글인 경우
}
```

#### DELETE /api/comments/:commentId
**설명**: 댓글 삭제

### 5.6 이벤트 (Events)

#### GET /api/events
**설명**: 이벤트 목록 조회
**Query Parameters**:
- `page`, `limit`
- `interest_id`: 카테고리 필터
- `start_date`, `end_date`: 날짜 범위
- `location`: 지역 필터
- `search`: 검색 키워드

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "현대미술 특별전",
        "description": "...",
        "interest": {
          "id": "uuid",
          "name": "전시"
        },
        "location": "서울시립미술관",
        "address": "서울시 중구...",
        "start_date": "2025-02-01",
        "end_date": "2025-03-31",
        "image_urls": ["https://..."],
        "price": "무료",
        "is_bookmarked": false,
        "bookmark_count": 234
      }
    ],
    "pagination": { "..." }
  }
}
```

#### POST /api/events
**설명**: 이벤트 등록
**Request**:
```json
{
  "title": "현대미술 특별전",
  "description": "...",
  "interest_id": "uuid",
  "location": "서울시립미술관",
  "address": "서울시 중구...",
  "start_date": "2025-02-01",
  "end_date": "2025-03-31",
  "image_urls": ["https://..."],
  "link_url": "https://...",
  "price": "무료"
}
```

#### GET /api/events/:eventId
**설명**: 이벤트 상세 조회

#### POST /api/events/:eventId/bookmark
**설명**: 이벤트 북마크

### 5.7 태그 (Tags)

#### GET /api/tags
**설명**: 태그 목록 조회
**Query Parameters**:
- `category`: 카테고리 필터
- `search`: 검색
- `popular`: 인기 태그 (true/false)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "uuid",
        "name": "현대미술",
        "category": "전시",
        "usage_count": 456
      }
    ]
  }
}
```

### 5.8 관심사 (Interests)

#### GET /api/interests
**설명**: 카테고리 목록 조회
**Response (200)**:
```json
{
  "success": true,
  "data": {
    "interests": [
      {
        "id": "uuid",
        "name": "전시",
        "icon": "gallery"
      },
      {
        "id": "uuid",
        "name": "공연",
        "icon": "music"
      }
    ]
  }
}
```

---

## 6. UI/UX 설계

### 6.1 화면 구성 (Screen Layout)

#### 주요 화면
1. **홈 (Home)**
   - 맞춤 추천 피드
   - 인기 커뮤니티
   - 다가오는 이벤트

2. **탐색 (Explore)**
   - 커뮤니티 탐색
   - 이벤트 탐색
   - 카테고리별 필터

3. **커뮤니티 (Community)**
   - 커뮤니티 목록
   - 커뮤니티 상세
   - 게시글 피드

4. **이벤트 (Events)**
   - 이벤트 목록
   - 이벤트 상세
   - 지도 뷰

5. **프로필 (Profile)**
   - 내 프로필
   - 내가 가입한 커뮤니티
   - 북마크
   - 설정

### 6.2 디자인 시스템

#### 컬러 팔레트
- **Primary**: #FF6B6B (따뜻한 레드)
- **Secondary**: #4ECDC4 (민트)
- **Background**: #F7F9FC
- **Text**: #2D3748
- **Border**: #E2E8F0

#### 타이포그래피
- **Title**: Pretendard Bold, 24-32px
- **Heading**: Pretendard SemiBold, 18-20px
- **Body**: Pretendard Regular, 14-16px
- **Caption**: Pretendard Regular, 12px

#### 컴포넌트
- 버튼: Rounded (8px), Primary/Secondary/Outline
- 카드: Shadow, Rounded (12px)
- 입력 필드: Border, Rounded (8px)
- 태그: Pill shape, Rounded (20px)

---

## 7. 비기능적 요구사항

### 7.1 성능 (Performance)
- 페이지 로딩 시간: 3초 이내
- API 응답 시간: 500ms 이내
- 이미지 최적화: WebP 포맷, Lazy Loading

### 7.2 보안 (Security)
- HTTPS 통신 필수
- JWT 토큰 기반 인증
- 비밀번호: bcrypt 암호화
- XSS, CSRF 방어
- Rate Limiting: API 호출 제한

### 7.3 확장성 (Scalability)
- 마이크로서비스 아키텍처 고려
- 데이터베이스 인덱싱
- 캐싱 전략 (Redis)
- CDN을 통한 정적 파일 제공

### 7.4 접근성 (Accessibility)
- WCAG 2.1 AA 수준 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 대체 텍스트 제공

### 7.5 호환성 (Compatibility)
- **브라우저**: Chrome, Safari, Firefox (최신 2버전)
- **모바일**: iOS 14+, Android 10+
- **반응형**: Desktop, Tablet, Mobile

---

## 8. 제약사항 및 전제조건

### 8.1 기술적 제약사항
- MVP는 웹 우선 개발 (모바일 앱은 이후 버전)
- 초기 서버 인프라: AWS 프리티어 또는 저비용 호스팅
- 외부 API 의존: 소셜 로그인 (Google, Kakao)

### 8.2 비즈니스 제약사항
- MVP 개발 기간: 3개월
- 초기 예산: 제한적
- 초기 타겟: 서울/수도권 20-30대 문화 애호가

### 8.3 전제조건
- 사용자는 인터넷 연결 환경에서 서비스 이용
- 이메일 인증이 가능한 유효한 이메일 주소 보유
- 모바일 브라우저 또는 데스크톱 브라우저 사용

---

## 9. 향후 계획 (Future Roadmap)

상세한 내용은 `FUTURE_DEVELOPMENT_ROADMAP.md` 참조

### MVP 이후 추가 예정 기능
- AI 기반 맞춤 추천 고도화
- 실시간 채팅 기능
- 오프라인 모임 기능
- 결제 시스템 (프리미엄 기능)
- 네이티브 모바일 앱

---

## 10. 변경 이력 (Change Log)

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2025-01-19 | 초안 작성 | Product Team |

---

**문서 상태**: Draft  
**승인 필요**: Yes  
**다음 리뷰**: 2025-01-26

