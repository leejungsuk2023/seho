import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { register, login, RegisterData, LoginData } from '../api/auth';
import type { AxiosError } from 'axios';
import type { ApiResponse, AuthResponse } from '@/types';

/**
 * Auth Hooks
 * - 회원가입, 로그인 처리
 * - 토큰 저장 및 리다이렉트
 */

/**
 * 회원가입 Hook
 */
export function useRegister() {
  const router = useRouter();

  return useMutation<ApiResponse<AuthResponse>, AxiosError, RegisterData>({
    mutationFn: register,
    onSuccess: (data) => {
      // 토큰 저장
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      // 홈으로 이동
      router.push('/');
    },
  });
}

/**
 * 로그인 Hook
 */
export function useLogin() {
  const router = useRouter();

  return useMutation<ApiResponse<AuthResponse>, AxiosError, LoginData>({
    mutationFn: login,
    onSuccess: (data) => {
      // 토큰 저장
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      // 홈으로 이동
      router.push('/');
    },
  });
}

/**
 * 로그아웃 Hook
 */
export function useLogout() {
  const router = useRouter();

  return () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
}

