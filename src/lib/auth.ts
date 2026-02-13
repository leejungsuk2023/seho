import { supabase, forceCleanSession } from './supabase';
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
      // 회원가입 전 stale 세션 정리 (이전에 삭제된 사용자의 세션이 남아있을 수 있음)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          try {
            await supabase.auth.signOut();
          } catch {
            forceCleanSession();
          }
        }
      } catch {
        forceCleanSession();
      }

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
        // "User already registered" 에러인 경우 로그인으로 안내
        if (authError.message?.includes('already registered') || authError.message?.includes('already exists')) {
          return { user: null, error: new Error('이미 가입된 이메일입니다. 로그인을 시도해주세요.') };
        }
        return { user: null, error: authError };
      }

      if (!authData.user) {
        return { user: null, error: new Error('사용자 생성에 실패했습니다.') };
      }

      // signUp 후 세션이 완전히 설정되도록 명시적으로 signIn
      // (RLS 정책이 auth.uid()를 확인하므로 세션이 반드시 필요)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        return { user: null, error: new Error('계정은 생성되었으나 자동 로그인에 실패했습니다. 로그인 페이지에서 로그인해주세요.') };
      }

      // 세션이 확실히 활성화된 상태에서 users 테이블에 사용자 정보 생성
      const user = await usersApi.create({
        id: authData.user.id,
        username: userData.username,
        nickname: userData.nickname,
        email,
        role: 'VIEWER',
      });

      if (!user) {
        return { user: null, error: new Error('회원 정보 저장에 실패했습니다. 로그인을 시도하면 자동으로 복구됩니다.') };
      }

      // 가입 완료 후 세션 정리 (로그인 페이지로 보내므로)
      try {
        await supabase.auth.signOut();
      } catch {
        forceCleanSession();
      }

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
      if (error) {
        // signOut API가 에러를 반환해도 로컬 세션은 정리
        forceCleanSession();
      }
      return { error };
    } catch (error) {
      // 네트워크 오류 등으로 완전히 실패해도 로컬 세션 정리
      forceCleanSession();
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
        // 잘못된 세션 정리 (배포 환경에서도 작동하도록)
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          // signOut 실패 시 (403/401 등) localStorage에서 세션 강제 제거
          console.warn('Failed to sign out, force cleaning session:', signOutError);
          forceCleanSession();
        }
        callback(null);
        return;
      }
      
      callback(user);
    });
  },
};
