import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !key) {
  throw new Error(
    'Supabase 환경 변수가 설정되지 않았습니다. Vercel: Settings → Environment Variables에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 추가한 뒤 Redeploy 해주세요.'
  );
}

// AbortError 방지를 위한 커스텀 fetch 래퍼
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // signal을 완전히 제거하고 새로운 Request 객체 생성
  const { signal, ...restInit } = init ?? {};
  
  // Request 객체인 경우 URL만 추출
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  // signal 없이 새로운 fetch 요청 생성
  return fetch(url, {
    ...restInit,
    // signal을 명시적으로 undefined로 설정하여 완전히 제거
    signal: undefined,
  });
};

// Supabase 세션을 localStorage에서 강제 제거하는 헬퍼
// signOut()이 403/401 등으로 실패할 때 사용
export function forceCleanSession() {
  try {
    // Supabase는 `sb-{ref}-auth-token` 형태로 localStorage에 세션을 저장함
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

export const supabase: SupabaseClient<Database> = createClient<Database>(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'implicit',
    // Supabase v2의 내부 lock 메커니즘이 AbortError를 유발하므로 no-op lock 사용
    lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<unknown>) => {
      return await fn();
    },
  } as Record<string, unknown>,
  global: {
    fetch: customFetch,
  },
});

// 타입 정의 (데이터베이스 스키마와 일치)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          nickname: string;
          email: string | null;
          birthdate: string | null;
          profile_image: string | null;
          bio: string | null;
          role: 'VIEWER' | 'WRITER' | 'ADMIN';
          created_at: string;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      blogs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          name_ko: string;
          description: string;
          cover_image: string;
          logo_image: string | null;
          primary_color: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['blogs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blogs']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          name_ko: string;
          blog_id: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          author_id: string;
          blog_id: string;
          category_id: string | null;
          tags: string[];
          status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
          views: number;
          thumbnail_image: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
    };
  };
};
