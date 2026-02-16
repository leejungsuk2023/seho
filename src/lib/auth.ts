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

      // DB 트리거(on_auth_user_created)가 auth.users INSERT 시 자동으로 users 테이블에 생성
      // 트리거가 처리하므로 여기서 usersApi.create() 호출하지 않음 (중복 시 23505 에러 발생)
      const user = await usersApi.getById(authData.user.id);

      if (!user) {
        return { user: null, error: new Error('회원 정보 저장에 실패했습니다. 잠시 후 로그인을 시도해주세요.') };
      }

      // 가입 완료 후 세션 정리 (로그인 페이지로 안내하므로)
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

  // 비밀번호 변경
  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    } catch (error) {
      return { error: error as Error };
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

  // 세션 변경 감지 (같은 세션 연속 호출 시 캐시로 중복 요청 방지)
  _lastSessionId: null as string | null,
  _lastUser: null as User | null,
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      // 세션이 없거나 사용자가 없으면 null 반환
      if (!session?.user) {
        authApi._lastSessionId = null;
        authApi._lastUser = null;
        callback(null);
        return;
      }
      
      // 같은 세션 연속 호출 시 캐시 사용 (TOKEN_REFRESHED 등)
      if (authApi._lastSessionId === session.user.id) {
        callback(authApi._lastUser);
        return;
      }
      
      // 사용자 정보 조회
      const user = await usersApi.getById(session.user.id);
      authApi._lastSessionId = session.user.id;
      authApi._lastUser = user ?? null;
      
      // 세션은 있지만 users 테이블에 사용자가 없으면 세션 무효화하고 null 반환
      if (!user) {
        authApi._lastSessionId = null;
        authApi._lastUser = null;
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
