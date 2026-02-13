-- Multi-Blog Platform PRD 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location features (if needed in future)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- 1. USERS 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  birthdate DATE,
  profile_image TEXT,
  bio TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'VIEWER' CHECK (role IN ('VIEWER', 'WRITER', 'ADMIN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- 인덱스
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT nickname_length CHECK (char_length(nickname) >= 1)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. BLOGS 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_ko VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  logo_image TEXT,
  primary_color VARCHAR(7) NOT NULL DEFAULT '#000000',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_name ON blogs(name);

-- ============================================
-- 3. CATEGORIES 테이블 (계층 구조 지원)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  name_ko VARCHAR(100) NOT NULL,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 같은 블로그 내에서 같은 이름의 카테고리는 중복 불가
  CONSTRAINT unique_category_per_blog UNIQUE (blog_id, name)
);

CREATE INDEX idx_categories_blog_id ON categories(blog_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- ============================================
-- 4. POSTS 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'HIDDEN')),
  views INTEGER NOT NULL DEFAULT 0,
  thumbnail_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- 같은 블로그 내에서 같은 slug는 중복 불가
  CONSTRAINT unique_post_slug_per_blog UNIQUE (blog_id, slug),
  CONSTRAINT title_length CHECK (char_length(title) >= 1),
  CONSTRAINT excerpt_length CHECK (char_length(excerpt) >= 1)
);

CREATE INDEX idx_posts_blog_id ON posts(blog_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_blog_status_created ON posts(blog_id, status, created_at DESC);

-- Full-text search를 위한 인덱스
CREATE INDEX idx_posts_title_search ON posts USING GIN(to_tsvector('english', title));
CREATE INDEX idx_posts_content_search ON posts USING GIN(to_tsvector('english', content));

-- ============================================
-- 5. COMMENTS 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  CONSTRAINT content_length CHECK (char_length(content) >= 1)
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- 포스트 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_post_views(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET views = views + 1 WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql;

-- 포스트의 댓글 수를 계산하는 함수
CREATE OR REPLACE FUNCTION get_post_comment_count(post_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM comments WHERE post_id = post_uuid);
END;
$$ LANGUAGE plpgsql;

-- 블로그의 포스트 수를 계산하는 함수
CREATE OR REPLACE FUNCTION get_blog_post_count(blog_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM posts WHERE blog_id = blog_uuid AND status = 'PUBLISHED');
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS) 설정
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users: 모든 사용자는 자신의 정보를 읽을 수 있음
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users: 모든 사용자는 공개 프로필 정보를 볼 수 있음
CREATE POLICY "Anyone can view public user profiles" ON users
  FOR SELECT USING (true);

-- Users: 인증된 사용자는 자신의 정보를 업데이트할 수 있음
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Blogs: 모든 사용자는 블로그를 볼 수 있음
CREATE POLICY "Anyone can view blogs" ON blogs
  FOR SELECT USING (true);

-- Blogs: ADMIN만 블로그를 생성/수정/삭제할 수 있음
CREATE POLICY "Only admins can manage blogs" ON blogs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Categories: 모든 사용자는 카테고리를 볼 수 있음
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Categories: ADMIN만 카테고리를 관리할 수 있음
CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Posts: 모든 사용자는 발행된 포스트를 볼 수 있음
CREATE POLICY "Anyone can view published posts" ON posts
  FOR SELECT USING (status = 'PUBLISHED' OR 
    author_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Posts: WRITER 이상은 포스트를 작성할 수 있음
CREATE POLICY "Writers can create posts" ON posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('WRITER', 'ADMIN')
    )
  );

-- Posts: 작성자와 ADMIN만 포스트를 수정/삭제할 수 있음
CREATE POLICY "Authors and admins can update posts" ON posts
  FOR UPDATE USING (
    author_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Authors and admins can delete posts" ON posts
  FOR DELETE USING (
    author_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- Comments: 모든 사용자는 댓글을 볼 수 있음
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- Comments: 인증된 사용자는 댓글을 작성할 수 있음
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

-- Comments: 작성자와 ADMIN만 댓글을 수정/삭제할 수 있음
CREATE POLICY "Authors and admins can update comments" ON comments
  FOR UPDATE USING (
    author_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Authors and admins can delete comments" ON comments
  FOR DELETE USING (
    author_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'ADMIN'
    )
  );

-- ============================================
-- 8. 초기 데이터 삽입 (선택사항)
-- ============================================

-- 초기 블로그 데이터 (선택사항 - 필요시 주석 해제)
/*
INSERT INTO blogs (slug, name, name_ko, description, cover_image, primary_color) VALUES
('serein-cafe', 'Serein Cafe', '세렌 카페', '다양한 작성자가 참여하는 따뜻한 블로그 공간입니다.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop', '#D97706'),
('studio-cpa', 'Studio CPA', '스튜디오 CPA', '회계 전문가들의 지식을 공유하는 공간입니다.', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop', '#2563EB'),
('swing-company', 'Swing Company', '스윙 컴퍼니', '자유로운 생각과 이야기를 나누는 게시판 형태의 블로그입니다.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop', '#059669'),
('bookstore', 'Bookstore (Story Cellar)', '북스토어 (스토리 셀러)', '책과 이야기가 있는 특별한 공간입니다.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=500&fit=crop', '#7C3AED')
ON CONFLICT (slug) DO NOTHING;
*/
