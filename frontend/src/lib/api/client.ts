import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Axios 인스턴스 생성
 * - baseURL: 환경 변수에서 가져옴
 * - timeout: 10초
 * - 자동 JSON 파싱
 */
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request 인터셉터
 * - 모든 요청에 JWT 토큰 자동 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져오기
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response 인터셉터
 * - 401 에러 시 자동 로그아웃
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized - 토큰 만료 또는 유효하지 않음
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

