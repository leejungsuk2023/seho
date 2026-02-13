#!/usr/bin/env node
/**
 * Supabase 연동 확인 스크립트
 * 사용법: node scripts/verify-supabase.mjs
 * .env에서 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 읽어서 테스트합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env 파일이 없습니다. 프로젝트 루트에 .env를 만들고 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 넣어주세요.');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

if (!url || !key) {
  console.error('❌ .env에 VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 없습니다.');
  process.exit(1);
}

console.log('🔗 Supabase 연동 확인 중...');
console.log('   URL:', url);

const apiUrl = `${url.replace(/\/$/, '')}/rest/v1/blogs?select=id&limit=1`;
const res = await fetch(apiUrl, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
});

if (res.ok) {
  console.log('✅ 연동 성공! Supabase와 앱이 정상적으로 연결되어 있습니다.');
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    console.log('   (블로그 테이블에 데이터가 있습니다.)');
  } else {
    console.log('   (블로그 테이블이 비어 있을 수 있습니다. supabase/seed.sql 실행을 권장합니다.)');
  }
} else {
  const text = await res.text();
  console.error('❌ 연동 실패. 응답 상태:', res.status);
  console.error('   내용:', text.slice(0, 200));
  process.exit(1);
}
