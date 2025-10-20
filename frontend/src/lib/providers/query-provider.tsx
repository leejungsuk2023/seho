'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * React Query Provider
 * - Client Component로 전체 앱을 감싸서 사용
 * - 데이터 페칭, 캐싱, 동기화를 관리
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 동안 캐시 유지
            staleTime: 5 * 60 * 1000,
            // 백그라운드에서 자동 리페치 비활성화 (필요 시 활성화)
            refetchOnWindowFocus: false,
            // 에러 재시도 1회
            retry: 1,
          },
          mutations: {
            // 에러 재시도 안 함
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

