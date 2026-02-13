# 환경 변수 정리

로컬 개발(`.env`) 및 Vercel 등 배포 환경에서 설정할 환경 변수 목록입니다.

---

## 필수 변수 (Supabase)

| 변수명 | 설명 | 예시 값 (비워두지 마세요) |
|--------|------|---------------------------|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon(public) API 키 | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |

- **확인 위치**: [Supabase 대시보드](https://app.supabase.com) → 프로젝트 선택 → **Settings** → **API**
  - **Project URL** → `VITE_SUPABASE_URL`
  - **Project API keys** → **anon public** → `VITE_SUPABASE_ANON_KEY`

---

## 로컬에서 사용 (.env)

1. 프로젝트 루트에 `.env` 파일 생성
2. 아래 내용을 복사한 뒤, `your_...` 부분만 실제 값으로 교체

```env
# Supabase (필수)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. 저장 후 `npm run dev` 재시작

---

## Vercel에서 사용

1. [Vercel 대시보드](https://vercel.com) → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 아래처럼 추가 (Production / Preview / Development 원하는 환경에 체크)

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |

4. 저장 후 **Deployments** → 최신 배포 **Redeploy** (환경 변수 반영)

**배포 후 흰 화면만 나올 때**

- 위 두 환경 변수가 **반드시** 설정되어 있어야 합니다. 없으면 Supabase 요청이 실패하거나 앱이 동작하지 않을 수 있습니다.
- 프로젝트 루트의 `vercel.json`이 SPA 라우팅(모든 경로 → `index.html`)을 위해 사용됩니다. 삭제하지 마세요.

---

## 참고

- `VITE_` 접두사가 붙은 변수만 Vite 빌드 시 클라이언트에서 사용됩니다.
- `.env` 파일은 Git에 올리지 마세요 (`.gitignore`에 포함됨).
- anon key는 프론트에 노출되는 공개 키이므로, RLS로 보안을 유지합니다.
