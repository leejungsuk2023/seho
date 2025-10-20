/**
 * 공통 타입 정의
 */

// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  nickname: string;
  profile_image_url?: string;
  bio?: string;
  tags?: string[];
  interests?: string[];
  community_count?: number;
  post_count?: number;
  created_at: string;
}

// 인증 타입
export interface AuthResponse {
  user: User;
  token: string;
  is_new_user?: boolean;
}

// 태그 타입
export interface Tag {
  id: string;
  name: string;
  category: string;
  usage_count: number;
}

// 관심사 타입
export interface Interest {
  id: string;
  name: string;
  icon: string;
}

// 커뮤니티 타입
export interface Community {
  id: string;
  name: string;
  description: string;
  cover_image_url?: string;
  category: string;
  type: 'open' | 'approval';
  member_count: number;
  post_count: number;
  tags: string[];
  is_joined: boolean;
  my_role?: 'admin' | 'moderator' | 'member';
  creator: {
    id: string;
    nickname: string;
  };
  created_at: string;
}

// 게시글 타입
export interface Post {
  id: string;
  community_id: string;
  author: {
    id: string;
    nickname: string;
    profile_image_url?: string;
  };
  title: string;
  content: string;
  image_urls?: string[];
  like_count: number;
  comment_count: number;
  view_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
}

// 댓글 타입
export interface Comment {
  id: string;
  post_id: string;
  author: {
    id: string;
    nickname: string;
    profile_image_url?: string;
  };
  content: string;
  parent_id?: string;
  like_count: number;
  is_liked: boolean;
  replies?: Comment[];
  created_at: string;
  updated_at: string;
}

// 이벤트 타입
export interface Event {
  id: string;
  title: string;
  description: string;
  interest: {
    id: string;
    name: string;
  };
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date: string;
  image_urls: string[];
  link_url?: string;
  price?: string;
  organizer?: string;
  is_bookmarked: boolean;
  bookmark_count: number;
  created_at: string;
}

