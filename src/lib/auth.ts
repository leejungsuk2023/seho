import { supabase } from './supabase';
import type { User } from '../app/data/mockData';
import { usersApi } from './supabase-api';

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
      // Supabase Auth에 사용자 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            nickname: userData.nickname,
          },
        },
      });

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
      if (session?.user) {
        const user = await usersApi.getById(session.user.id);
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};
