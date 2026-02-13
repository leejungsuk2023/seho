import { supabase } from './supabase';
import type { User } from '../app/data/mockData';
import { usersApi } from './supabase-api';
import { retryOnAbortError } from './supabase-retry';

// ============================================
// 인증 관련 유틸리티 함수
// ============================================

export const authApi = {
  // 이메일/비밀번호로 회원가입
  async signUp(email: string, password: string, userData: {
    username: string;
    nickname: string;
  }): Promise<{ user: User | null; error: Error | null }> {
    try {
      // Supabase Auth에 사용자 생성 (재시도 적용)
      const { data: authData, error: authError } = await retryOnAbortError(() =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: userData.username,
              nickname: userData.nickname,
            },
          },
        })
      );

      if (authError) {
        return { user: null, error: authError };
      }

      if (!authData.user) {
        return { user: null, error: new Error('사용자 생성에 실패했습니다.') };
      }

      // users 테이블에 사용자 정보 생성 (Auth 사용자 id와 동일하게)
      const user = await usersApi.create({
        id: authData.user.id,
        username: userData.username,
        nickname: userData.nickname,
        email,
        role: 'VIEWER',
      });

      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  // 이메일/비밀번호로 로그인
  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      // 로그인은 재시도 적용 (중요한 작업)
      const { data, error } = await retryOnAbortError(() =>
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );

      if (error) {
        return { user: null, error };
      }

      if (!data.user) {
        return { user: null, error: new Error('로그인에 실패했습니다.') };
      }

      // users 테이블에서 사용자 정보 조회
      let user = await usersApi.getById(data.user.id);

      // Auth에는 있지만 users 테이블에 없는 경우 자동 생성
      if (!user && data.user) {
        const meta = data.user.user_metadata || {};
        user = await usersApi.create({
          id: data.user.id,
          username: meta.username || data.user.email?.split('@')[0] || 'user',
          nickname: meta.nickname || meta.username || '사용자',
          email: data.user.email || undefined,
          role: 'VIEWER',
        });
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  // 로그아웃
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // 현재 세션 확인
  async getSession() {
    // 세션 확인은 빠르게 처리 (재시도 불필요)
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser(): Promise<User | null> {
    return await usersApi.getCurrentUser();
  },

  // 세션 변경 감지
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      // 세션이 없거나 사용자가 없으면 null 반환
      if (!session?.user) {
        callback(null);
        return;
      }
      
      // 사용자 정보 조회
      const user = await usersApi.getById(session.user.id);
      
      // 세션은 있지만 users 테이블에 사용자가 없으면 세션 무효화하고 null 반환
      if (!user) {
        // 잘못된 세션 정리
        await supabase.auth.signOut();
        callback(null);
        return;
      }
      
      callback(user);
    });
  },
};
