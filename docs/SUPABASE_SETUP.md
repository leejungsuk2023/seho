# Supabase 설정 가이드

이 문서는 Multi-Blog Platform PRD 프로젝트에 Supabase를 설정하는 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://app.supabase.com)에 접속하여 계정을 생성하거나 로그인합니다.
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다.
4. 프로젝트가 생성될 때까지 기다립니다 (약 2분 소요).

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 왼쪽 메뉴의 **SQL Editor**를 클릭합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 SQL Editor에 붙여넣습니다.
3. "Run" 버튼을 클릭하여 스키마를 생성합니다.
4. 성공 메시지가 표시되면 완료입니다.

## 3. 환경 변수 설정

1. Supabase 대시보드에서 왼쪽 메뉴의 **Settings** > **API**를 클릭합니다.
2. 다음 정보를 확인합니다:
   - **Project URL**: `VITE_SUPABASE_URL`에 사용
   - **anon public key**: `VITE_SUPABASE_ANON_KEY`에 사용

3. 프로젝트 루트에 `.env` 파일을 생성합니다:
   ```bash
   cp .env.example .env
   ```

4. `.env` 파일을 열고 Supabase 정보를 입력합니다:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. 인증 설정 (선택사항)

Supabase Auth를 사용하려면:

1. Supabase 대시보드에서 **Authentication** > **Providers**로 이동합니다.
2. **Email** 프로바이더가 활성화되어 있는지 확인합니다.
3. 필요에 따라 다른 인증 방법(Social Login 등)을 활성화할 수 있습니다.

## 5. Row Level Security (RLS) 확인

스키마에 RLS 정책이 포함되어 있습니다. 다음을 확인하세요:

- **users**: 모든 사용자는 공개 프로필을 볼 수 있고, 자신의 프로필만 수정 가능
- **blogs**: 모든 사용자가 볼 수 있고, ADMIN만 관리 가능
- **posts**: 발행된 포스트는 모두 볼 수 있고, WRITER 이상만 작성 가능
- **comments**: 모든 사용자가 볼 수 있고, 인증된 사용자만 작성 가능

## 6. 초기 데이터 삽입 (선택사항)

초기 블로그 데이터를 삽입하려면:

1. SQL Editor에서 `schema.sql`의 마지막 부분에 있는 주석 처리된 INSERT 문을 활성화합니다.
2. 또는 Supabase 대시보드의 **Table Editor**에서 직접 데이터를 추가할 수 있습니다.

## 7. 파일 스토리지 설정 (이미지 업로드용)

이미지 업로드 기능을 사용하려면:

1. Supabase 대시보드에서 **Storage**를 클릭합니다.
2. "Create a new bucket"을 클릭합니다.
3. 버킷 이름을 입력합니다 (예: `blog-images`).
4. **Public bucket**으로 설정하여 공개 접근을 허용합니다.
5. 필요에 따라 RLS 정책을 설정합니다.

## 8. 테스트

프로젝트를 실행하여 Supabase 연결을 테스트합니다:

```bash
npm run dev
```

브라우저 콘솔에서 Supabase 연결 오류가 없는지 확인하세요.

## 문제 해결

### 환경 변수가 인식되지 않는 경우
- `.env` 파일이 프로젝트 루트에 있는지 확인하세요.
- Vite를 재시작하세요 (`npm run dev` 중지 후 다시 시작).

### RLS 정책 오류
- Supabase 대시보드의 **Authentication** > **Policies**에서 정책을 확인하세요.
- 필요시 `schema.sql`의 RLS 정책을 수정하여 다시 실행하세요.

### 타입 오류
- `src/lib/supabase.ts`의 타입 정의가 데이터베이스 스키마와 일치하는지 확인하세요.

## 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
