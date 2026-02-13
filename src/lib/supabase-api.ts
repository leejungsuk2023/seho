import { supabase, forceCleanSession } from './supabase';
import type { User, Blog, Category, Post, Comment, PostStatus, UserRole } from '../app/data/mockData';
import { retryOnAbortError } from './supabase-retry';

function mapCategoryFromDb(dbCat: any): Category {
  return {
    id: dbCat.id,
    name: dbCat.name,
    nameKo: dbCat.name_ko,
    blogId: dbCat.blog_id,
    parentId: dbCat.parent_id,
  };
}

// ============================================
// Users API
// ============================================

export const usersApi = {
  // 모든 사용자 조회
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data.map(mapUserFromDb);
  },

  // 사용자 ID로 조회
  async getById(id: string): Promise<User | null> {
    // 재시도 로직 제거 - 일반적인 조회는 빠르게 처리
    // maybeSingle()을 사용하여 결과가 없어도 에러가 발생하지 않도록 함
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    // PGRST116은 "not found" 에러로 정상적인 경우임
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      return null;
    }

    return data ? mapUserFromDb(data) : null;
  },

  // 사용자명으로 조회
  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    // PGRST116은 "not found" 에러로 정상적인 경우임
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by username:', error);
      return null;
    }

    return data ? mapUserFromDb(data) : null;
  },

  // 현재 로그인한 사용자 조회 (빠른 버전 - getSession 사용)
  async getCurrentUser(): Promise<User | null> {
    try {
      // 빠른 로컬 세션 확인 (서버 요청 없음)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        return null;
      }

      // 배포 환경에서도 안전하게 처리하기 위해 에러 처리 강화
      const result = await this.getById(session.user.id);
      
      // 세션은 있지만 users 테이블에 사용자가 없으면 세션 무효화하고 null 반환
      if (!result) {
        // 잘못된 세션 정리 (배포 환경에서도 작동하도록)
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          // signOut 실패 시 (403/401) localStorage에서 세션 강제 제거
          console.warn('Failed to sign out, force cleaning session:', signOutError);
          forceCleanSession();
        }
        return null;
      }
      
      return result;
    } catch (error) {
      // 배포 환경에서 발생할 수 있는 예상치 못한 에러 처리
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // 사용자 생성 (id 지정 시 Supabase Auth 사용자와 동기화용)
  async create(userData: {
    id?: string;
    username: string;
    nickname: string;
    email?: string;
    birthdate?: string;
    profileImage?: string;
    bio?: string;
    role?: UserRole;
  }): Promise<User | null> {
    try {
      const insertData: Record<string, unknown> = {
        username: userData.username,
        nickname: userData.nickname,
        email: userData.email || null,
        birthdate: userData.birthdate || null,
        profile_image: userData.profileImage || null,
        bio: userData.bio || null,
        role: userData.role || 'VIEWER',
      };
      if (userData.id) insertData.id = userData.id;

      // 재시도 로직 적용 (중요한 작업)
      const { data, error } = await retryOnAbortError(() =>
        supabase
          .from('users')
          .insert(insertData)
          .select()
          .single()
      );

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data ? mapUserFromDb(data) : null;
    } catch (error) {
      console.error('Error creating user (after retry):', error);
      return null;
    }
  },

  // 사용자 업데이트
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update({
        nickname: updates.nickname,
        email: updates.email,
        birthdate: updates.birthdate,
        profile_image: updates.profileImage,
        bio: updates.bio,
        role: updates.role,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data ? mapUserFromDb(data) : null;
  },
};

// ============================================
// Blogs API
// ============================================

export const blogsApi = {
  // 모든 블로그 조회 (포스트 수 포함)
  async getAll(): Promise<Blog[]> {
    try {
      // 블로그와 카테고리를 한 번에 조회
      const { data: blogsData, error: blogsError } = await retryOnAbortError(() =>
        supabase
          .from('blogs')
          .select(`
            *,
            categories (*)
          `)
          .order('created_at', { ascending: false })
      );

      if (blogsError) {
        console.error('Error fetching blogs:', blogsError);
        return [];
      }

      if (!blogsData || blogsData.length === 0) {
        return [];
      }

      // 모든 블로그의 포스트 수를 한 번의 쿼리로 조회
      const blogIds = blogsData.map(blog => blog.id);
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('blog_id')
        .eq('status', 'PUBLISHED')
        .in('blog_id', blogIds);

      // blog_id별로 포스트 수 계산
      const postCounts: Record<string, number> = {};
      if (postsData) {
        postsData.forEach(post => {
          postCounts[post.blog_id] = (postCounts[post.blog_id] || 0) + 1;
        });
      }

      // 블로그 데이터에 포스트 수 추가
      return blogsData.map(blog => {
        const blogWithCount = mapBlogFromDb(blog);
        blogWithCount.postCount = postCounts[blog.id] || 0;
        return blogWithCount;
      });
    } catch (error) {
      console.error('Error fetching blogs (after retry):', error);
      return [];
    }
  },

  // Slug로 블로그 조회
  async getBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        categories (*)
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog by slug:', error);
      return null;
    }

    return data ? mapBlogFromDb(data) : null;
  },

  // ID로 블로그 조회
  async getById(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        categories (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog by id:', error);
      return null;
    }

    return data ? mapBlogFromDb(data) : null;
  },

  // 블로그 수정 (관리자용)
  async update(id: string, updates: Partial<Pick<Blog, 'name' | 'nameKo' | 'description' | 'coverImage' | 'logoImage' | 'primaryColor'>>): Promise<Blog | null> {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.nameKo !== undefined) updateData.name_ko = updates.nameKo;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
    if (updates.logoImage !== undefined) updateData.logo_image = updates.logoImage;
    if (updates.primaryColor !== undefined) updateData.primary_color = updates.primaryColor;

    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (*)
      `)
      .single();

    if (error) {
      console.error('Error updating blog:', error);
      return null;
    }

    return data ? mapBlogFromDb(data) : null;
  },
};

// ============================================
// Categories API (관리자용 카테고리 CRUD)
// ============================================

export const categoriesApi = {
  async getByBlogId(blogId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data.map(mapCategoryFromDb);
  },

  async create(category: { name: string; nameKo: string; blogId: string; parentId?: string }): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        name_ko: category.nameKo,
        blog_id: category.blogId,
        parent_id: category.parentId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data ? mapCategoryFromDb(data) : null;
  },

  async update(id: string, updates: { name?: string; nameKo?: string }): Promise<Category | null> {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.nameKo !== undefined) updateData.name_ko = updates.nameKo;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return data ? mapCategoryFromDb(data) : null;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  },
};

// ============================================
// Posts API
// ============================================

export const postsApi = {
  // 블로그 ID로 포스트 조회
  async getByBlogId(blogId: string, options?: {
    categoryId?: string;
    status?: PostStatus;
    limit?: number;
    offset?: number;
  }): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('blog_id', blogId);

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    } else {
      // 기본적으로 발행된 포스트만
      query = query.eq('status', 'PUBLISHED');
    }

    query = query.order('created_at', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return data.map(mapPostFromDb);
  },

  // 작성자 ID로 포스트 조회 (마이페이지용)
  async getByAuthorId(authorId: string, options?: { limit?: number }): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts by author:', error);
      return [];
    }

    return data.map(mapPostFromDb);
  },

  // 포스트 ID로 조회
  async getById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data ? mapPostFromDb(data) : null;
  },

  // 모든 블로그의 포스트 조회 (On Air 피드용)
  async getAll(options?: {
    blogIds?: string[];
    categoryId?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'latest' | 'views' | 'comments';
  }): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'PUBLISHED');

    if (options?.blogIds && options.blogIds.length > 0) {
      query = query.in('blog_id', options.blogIds);
    }

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }

    // 정렬
    const orderBy = options?.sortBy === 'views' ? 'views' : 
                    options?.sortBy === 'comments' ? 'created_at' : 
                    'created_at';
    query = query.order(orderBy, { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all posts:', error);
      return [];
    }

    return data.map(mapPostFromDb);
  },

  // 검색
  async search(query: string, options?: {
    blogIds?: string[];
    limit?: number;
  }): Promise<Post[]> {
    let supabaseQuery = supabase
      .from('posts')
      .select('*')
      .eq('status', 'PUBLISHED')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);

    if (options?.blogIds && options.blogIds.length > 0) {
      supabaseQuery = supabaseQuery.in('blog_id', options.blogIds);
    }

    supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

    if (options?.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching posts:', error);
      return [];
    }

    return data.map(mapPostFromDb);
  },

  // 포스트 생성
  async create(postData: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    authorId: string;
    blogId: string;
    categoryId?: string;
    tags?: string[];
    status?: PostStatus;
    thumbnailImage?: string;
  }): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        author_id: postData.authorId,
        blog_id: postData.blogId,
        category_id: postData.categoryId || null,
        tags: postData.tags || [],
        status: postData.status || 'DRAFT',
        thumbnail_image: postData.thumbnailImage || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data ? mapPostFromDb(data) : null;
  },

  // 포스트 업데이트
  async update(id: string, updates: Partial<Post>): Promise<Post | null> {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.thumbnailImage !== undefined) updateData.thumbnail_image = updates.thumbnailImage;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data ? mapPostFromDb(data) : null;
  },

  // 포스트 삭제
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  },

  // 조회수 증가
  async incrementViews(id: string): Promise<void> {
    await supabase.rpc('increment_post_views', { post_uuid: id });
  },
};

// ============================================
// Comments API
// ============================================

export const commentsApi = {
  // 모든 댓글 조회 (관리자용)
  async getAll(limit?: number): Promise<Comment[]> {
    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all comments:', error);
      return [];
    }

    return data.map(mapCommentFromDb);
  },

  // 작성자 ID로 댓글 조회 (마이페이지용)
  async getByAuthorId(authorId: string, limit?: number): Promise<Comment[]> {
    let query = supabase
      .from('comments')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching comments by author:', error);
      return [];
    }

    return data.map(mapCommentFromDb);
  },

  // 포스트 ID로 댓글 조회
  async getByPostId(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data.map(mapCommentFromDb);
  },

  // 댓글 생성
  async create(commentData: {
    postId: string;
    authorId: string;
    content: string;
  }): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: commentData.postId,
        author_id: commentData.authorId,
        content: commentData.content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return null;
    }

    return data ? mapCommentFromDb(data) : null;
  },

  // 댓글 업데이트
  async update(id: string, content: string): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return null;
    }

    return data ? mapCommentFromDb(data) : null;
  },

  // 댓글 삭제
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  },
};

// ============================================
// Helper Functions: Database to Domain Mapping
// ============================================

function mapUserFromDb(dbUser: any): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
    nickname: dbUser.nickname,
    email: dbUser.email,
    birthdate: dbUser.birthdate,
    profileImage: dbUser.profile_image,
    bio: dbUser.bio,
    role: dbUser.role,
    createdAt: dbUser.created_at,
  };
}

function mapBlogFromDb(dbBlog: any): Blog {
  // 카테고리를 계층 구조로 변환
  const categories = buildCategoryTree(dbBlog.categories || []);

  return {
    id: dbBlog.id,
    slug: dbBlog.slug,
    name: dbBlog.name,
    nameKo: dbBlog.name_ko,
    description: dbBlog.description,
    coverImage: dbBlog.cover_image,
    logoImage: dbBlog.logo_image,
    primaryColor: dbBlog.primary_color,
    categories,
    postCount: 0, // 별도로 조회 필요
  };
}

function mapPostFromDb(dbPost: any): Post {
  return {
    id: dbPost.id,
    title: dbPost.title,
    content: dbPost.content,
    excerpt: dbPost.excerpt,
    authorId: dbPost.author_id,
    blogId: dbPost.blog_id,
    categoryId: dbPost.category_id,
    tags: dbPost.tags || [],
    status: dbPost.status,
    views: dbPost.views || 0,
    commentCount: 0, // 별도로 조회 필요
    thumbnailImage: dbPost.thumbnail_image,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
  };
}

function mapCommentFromDb(dbComment: any): Comment {
  return {
    id: dbComment.id,
    postId: dbComment.post_id,
    authorId: dbComment.author_id,
    content: dbComment.content,
    createdAt: dbComment.created_at,
    updatedAt: dbComment.updated_at,
  };
}

function buildCategoryTree(categories: any[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // 모든 카테고리를 맵에 추가
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      nameKo: cat.name_ko,
      blogId: cat.blog_id,
      parentId: cat.parent_id,
      children: [],
    });
  });

  // 계층 구조 구성
  categoryMap.forEach((category) => {
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(category);
      }
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
}
