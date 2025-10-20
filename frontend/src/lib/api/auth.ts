import { apiClient } from './client';
import { ApiResponse, AuthResponse } from '@/types';

/**
 * Auth API
 * PRD.md 5.1 인증 API 구현
 */

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * 회원가입
 * POST /api/auth/register
 */
export const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

/**
 * 로그인
 * POST /api/auth/login
 */
export const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

/**
 * 내 정보 조회
 * GET /api/auth/me
 */
export const getMe = async (): Promise<ApiResponse> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

