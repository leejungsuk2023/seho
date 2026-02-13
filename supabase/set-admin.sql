-- ============================================
-- 관리자 권한 부여 스크립트
-- ============================================
-- 
-- 사용 방법:
-- 1. Supabase 대시보드 → SQL Editor 열기
-- 2. 아래 SQL을 실행하여 특정 사용자를 ADMIN으로 변경
-- 3. 이메일 또는 username으로 사용자 찾아서 role 업데이트
--
-- 예시 1: 이메일로 관리자 지정
-- UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
--
-- 예시 2: username으로 관리자 지정
-- UPDATE users SET role = 'ADMIN' WHERE username = 'your-username';
--
-- 예시 3: 사용자 ID로 관리자 지정
-- UPDATE users SET role = 'ADMIN' WHERE id = 'user-uuid-here';
--
-- 예시 4: 모든 사용자 확인 (관리자 지정 전 확인용)
-- SELECT id, username, email, nickname, role, created_at FROM users ORDER BY created_at DESC;
-- ============================================

-- 현재 사용자 목록 확인 (실행 전 확인용)
SELECT 
  id,
  username,
  email,
  nickname,
  role,
  created_at
FROM users
ORDER BY created_at DESC;

-- ⚠️ 아래 주석을 해제하고 실제 이메일/username을 입력한 후 실행하세요
-- UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
-- 또는
-- UPDATE users SET role = 'ADMIN' WHERE username = 'your-username';
