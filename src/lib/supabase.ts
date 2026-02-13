import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient<Database> | null = null;

/** 환경 변수가 있을 때만 클라이언트를 생성합니다. 없으면 첫 사용 시점에 에러를 던져 Error Boundary가 잡을 수 있게 합니다. */
function getClient(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase 환경 변수가 설정되지 않았습니다. Vercel: Settings → Environment Variables에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 추가한 뒤 Redeploy 해주세요.'
    );
  }
  cachedClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, { ...init, signal: undefined });
      },
    },
  });
  return cachedClient;
}

// 첫 접근 시에만 getClient() 호출되므로, 앱 로드는 막히지 않고 Supabase를 쓰는 시점에 에러 발생
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    return (getClient() as Record<string | symbol, unknown>)[prop];
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
