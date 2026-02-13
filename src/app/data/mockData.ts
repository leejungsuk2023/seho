// Mock data for the SEHO platform

export type UserRole = 'VIEWER' | 'WRITER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  birthdate?: string;
  profileImage?: string;
  bio?: string;
  role: UserRole;
  createdAt: string;
}

export interface Blog {
  id: string;
  slug: string;
  name: string;
  nameKo: string;
  description: string;
  coverImage: string;
  logoImage?: string;
  primaryColor: string;
  categories: Category[];
  postCount: number;
}

export interface Category {
  id: string;
  name: string;
  nameKo: string;
  blogId: string;
  parentId?: string;
  children?: Category[];
}

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  blogId: string;
  categoryId?: string;
  tags: string[];
  status: PostStatus;
  views: number;
  commentCount: number;
  thumbnailImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    nickname: '관리자',
    email: 'admin@ch0435.com',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
    bio: '세호 플랫폼 관리자입니다.',
    role: 'ADMIN',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'writer1',
    nickname: '카페지기',
    email: 'writer1@ch0435.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    bio: '세렌 카페의 작성자입니다.',
    role: 'WRITER',
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'writer2',
    nickname: 'CPA전문가',
    email: 'writer2@ch0435.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    bio: '회계 전문 컨텐츠를 작성합니다.',
    role: 'WRITER',
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: '4',
    username: 'writer3',
    nickname: '스윙러',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
    bio: '자유롭게 생각을 나눕니다.',
    role: 'WRITER',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: '5',
    username: 'booklover',
    nickname: '책벌레',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
    bio: '책과 이야기를 사랑합니다.',
    role: 'WRITER',
    createdAt: '2025-02-05T00:00:00Z',
  },
];

// Mock Blogs
export const mockBlogs: Blog[] = [
  {
    id: 'blog1',
    slug: 'serein-cafe',
    name: 'Serein Cafe',
    nameKo: '세렌 카페',
    description: '다양한 작성자가 참여하는 따뜻한 블로그 공간입니다.',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop',
    primaryColor: '#D97706',
    postCount: 42,
    categories: [
      { id: 'cat1', name: 'Hostmade', nameKo: '홈메이드', blogId: 'blog1' },
      { id: 'cat2', name: 'Potluck', nameKo: '포틀럭', blogId: 'blog1' },
      { id: 'cat3', name: 'Catered event', nameKo: '케이터링 이벤트', blogId: 'blog1' },
    ],
  },
  {
    id: 'blog2',
    slug: 'studio-cpa',
    name: 'Studio CPA',
    nameKo: '스튜디오 CPA',
    description: '회계 전문가들의 지식을 공유하는 공간입니다.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
    primaryColor: '#2563EB',
    postCount: 28,
    categories: [
      {
        id: 'cat4',
        name: 'Accounting',
        nameKo: '회계학',
        blogId: 'blog2',
        children: [
          {
            id: 'cat5',
            name: 'Financial Accounting',
            nameKo: '재무회계',
            blogId: 'blog2',
            parentId: 'cat4',
            children: [
              { id: 'cat6', name: 'Cost Accounting', nameKo: '원가회계', blogId: 'blog2', parentId: 'cat5' },
              { id: 'cat7', name: 'Management Accounting', nameKo: '관리회계', blogId: 'blog2', parentId: 'cat5' },
            ],
          },
          { id: 'cat8', name: 'Tax Accounting', nameKo: '세무회계', blogId: 'blog2', parentId: 'cat4' },
        ],
      },
    ],
  },
  {
    id: 'blog3',
    slug: 'swing-company',
    name: 'Swing Company',
    nameKo: '스윙 컴퍼니',
    description: '자유로운 생각과 이야기를 나누는 게시판 형태의 블로그입니다.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
    primaryColor: '#059669',
    postCount: 156,
    categories: [],
  },
  {
    id: 'blog4',
    slug: 'bookstore',
    name: 'Bookstore (Story Cellar)',
    nameKo: '북스토어 (스토리 셀러)',
    description: '책과 이야기가 있는 특별한 공간입니다.',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=500&fit=crop',
    primaryColor: '#7C3AED',
    postCount: 35,
    categories: [
      { id: 'cat9', name: 'Fiction', nameKo: '소설', blogId: 'blog4' },
      { id: 'cat10', name: 'Non-Fiction', nameKo: '논픽션', blogId: 'blog4' },
      { id: 'cat11', name: 'Reviews', nameKo: '서평', blogId: 'blog4' },
    ],
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: 'post1',
    title: '완벽한 홈메이드 브런치 레시피',
    content: '주말 아침, 집에서 만드는 특별한 브런치 레시피를 소개합니다.\n\n## 재료\n- 계란 3개\n- 베이컨 4줄\n- 빵 2조각\n- 토마토 1개\n\n## 만드는 법\n1. 팬을 달궈주세요.\n2. 베이컨을 노릇하게 구워주세요.\n3. 계란을 프라이로 만들어주세요.\n4. 빵을 토스트해서 함께 담아내면 완성!',
    excerpt: '주말 아침, 집에서 만드는 특별한 브런치 레시피를 소개합니다. 계란, 베이컨, 빵으로 만드는 간단하지만 맛있는 브런치...',
    authorId: '2',
    blogId: 'blog1',
    categoryId: 'cat1',
    tags: ['레시피', '브런치', '홈메이드'],
    status: 'PUBLISHED',
    views: 245,
    commentCount: 12,
    thumbnailImage: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&h=400&fit=crop',
    createdAt: '2026-02-10T09:30:00Z',
  },
  {
    id: 'post2',
    title: '재무회계의 기초: 복식부기의 이해',
    content: '# 복식부기란?\n\n복식부기는 모든 거래를 차변과 대변으로 나누어 기록하는 방법입니다.\n\n## 차변과 대변\n- 차변(Debit): 자산의 증가, 부채의 감소, 비용의 발생\n- 대변(Credit): 자산의 감소, 부채의 증가, 수익의 발생\n\n## 분개의 예시\n현금으로 상품을 구입한 경우:\n```\n(차변) 상품 100,000 / (대변) 현금 100,000\n```',
    excerpt: '복식부기는 모든 거래를 차변과 대변으로 나누어 기록하는 방법입니다. 회계의 가장 기본이 되는 원리를 쉽게 설명합니다.',
    authorId: '3',
    blogId: 'blog2',
    categoryId: 'cat5',
    tags: ['회계', '복식부기', '재무회계'],
    status: 'PUBLISHED',
    views: 189,
    commentCount: 8,
    thumbnailImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    createdAt: '2026-02-09T14:20:00Z',
  },
  {
    id: 'post3',
    title: '오늘의 단상: 봄이 오는 소리',
    content: '창밖을 보니 봄이 오고 있다.\n\n새들이 지저귀고, 나무에 새싹이 돋아나기 시작했다.\n\n겨울이 길었지만, 이제 봄이다.\n\n모든 것이 새로워지는 계절.\n\n우리도 새로운 마음으로 시작해보자.',
    excerpt: '창밖을 보니 봄이 오고 있다. 새들이 지저귀고, 나무에 새싹이 돋아나기 시작했다...',
    authorId: '4',
    blogId: 'blog3',
    tags: ['일상', '봄', '단상'],
    status: 'PUBLISHED',
    views: 432,
    commentCount: 23,
    createdAt: '2026-02-11T18:45:00Z',
  },
  {
    id: 'post4',
    title: '최근 읽은 책: "밤의 문턱"',
    content: '# 밤의 문턱\n\n작가: 김소연\n\n## 감상\n\n시집이지만 소설처럼 읽힌다. 각 시마다 하나의 이야기가 담겨 있고, 그 이야기들이 모여 더 큰 이야기를 만든다.\n\n특히 "밤의 문턱에서" 라는 시가 인상적이었다.\n\n> "우리는 모두 밤의 문턱에 서 있다"\n\n이 구절이 계속 머릿속을 맴돈다.\n\n## 평점\n⭐⭐⭐⭐⭐ 5/5',
    excerpt: '시집이지만 소설처럼 읽힌다. 각 시마다 하나의 이야기가 담겨 있고, 그 이야기들이 모여 더 큰 이야기를 만든다...',
    authorId: '5',
    blogId: 'blog4',
    categoryId: 'cat11',
    tags: ['시집', '서평', '김소연'],
    status: 'PUBLISHED',
    views: 167,
    commentCount: 5,
    thumbnailImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
    createdAt: '2026-02-08T16:00:00Z',
  },
  {
    id: 'post5',
    title: '포틀럭 파티 준비 완벽 가이드',
    content: '포틀럭 파티를 준비하시나요? 완벽한 포틀럭을 위한 팁을 공유합니다.\n\n## 메뉴 선택\n- 운반이 쉬운 음식 선택하기\n- 상온에서도 괜찮은 음식\n- 리히팅이 간단한 음식\n\n## 준비물\n- 적절한 용기\n- 서빙 도구\n- 네임 태그\n\n## 주의사항\n알레르기 정보를 미리 공유하세요!',
    excerpt: '포틀럭 파티를 준비하시나요? 완벽한 포틀럭을 위한 팁을 공유합니다. 메뉴 선택부터 준비물까지...',
    authorId: '2',
    blogId: 'blog1',
    categoryId: 'cat2',
    tags: ['포틀럭', '파티', '준비'],
    status: 'PUBLISHED',
    views: 312,
    commentCount: 18,
    thumbnailImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    createdAt: '2026-02-11T10:15:00Z',
  },
  {
    id: 'post6',
    title: '원가회계: 제조원가의 구성',
    content: '# 제조원가의 구성\n\n제조원가는 크게 3가지로 구성됩니다.\n\n## 1. 직접재료비\n- 제품 생산에 직접 사용되는 재료의 비용\n- 예: 목재, 철강 등\n\n## 2. 직접노무비\n- 제품 생산에 직접 투입되는 노동력의 비용\n- 예: 생산직 근로자 급여\n\n## 3. 제조간접비\n- 제품 생산과 관련된 간접 비용\n- 예: 공장 임대료, 감가상각비 등',
    excerpt: '제조원가는 크게 3가지로 구성됩니다. 직접재료비, 직접노무비, 제조간접비에 대해 알아봅니다.',
    authorId: '3',
    blogId: 'blog2',
    categoryId: 'cat6',
    tags: ['원가회계', '제조원가', '회계'],
    status: 'PUBLISHED',
    views: 156,
    commentCount: 4,
    createdAt: '2026-02-07T11:00:00Z',
  },
  {
    id: 'post7',
    title: '오늘 아침의 커피',
    content: '오늘 아침, 새로운 원두를 샀다.\n\n에티오피아 예가체프.\n\n향이 정말 좋다.\n\n꽃향기와 과일향이 섞여 있다.\n\n아침을 여는 완벽한 커피.',
    excerpt: '오늘 아침, 새로운 원두를 샀다. 에티오피아 예가체프. 향이 정말 좋다...',
    authorId: '4',
    blogId: 'blog3',
    tags: ['커피', '일상', '아침'],
    status: 'PUBLISHED',
    views: 523,
    commentCount: 31,
    createdAt: '2026-02-12T08:30:00Z',
  },
  {
    id: 'post8',
    title: '케이터링 이벤트 성공 사례: 기업 행사',
    content: '지난주 진행한 기업 행사 케이터링 후기입니다.\n\n## 행사 정보\n- 인원: 100명\n- 장소: 서울 강남구 컨벤션 센터\n- 메뉴: 핑거푸드, 샌드위치, 디저트\n\n## 준비 과정\n1. 사전 미팅 (2주 전)\n2. 메뉴 확정 (1주 전)\n3. 재료 준비 (3일 전)\n4. 당일 세팅 (행사 2시간 전)\n\n## 결과\n고객 만족도 98%!',
    excerpt: '지난주 진행한 기업 행사 케이터링 후기입니다. 100명 규모의 행사를 성공적으로 마쳤습니다.',
    authorId: '2',
    blogId: 'blog1',
    categoryId: 'cat3',
    tags: ['케이터링', '이벤트', '기업행사'],
    status: 'PUBLISHED',
    views: 278,
    commentCount: 9,
    createdAt: '2026-02-06T15:30:00Z',
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    authorId: '4',
    content: '레시피 정말 좋네요! 주말에 꼭 만들어봐야겠어요.',
    createdAt: '2026-02-10T10:15:00Z',
  },
  {
    id: 'comment2',
    postId: 'post1',
    authorId: '5',
    content: '베이컨은 어떤 브랜드 쓰시나요?',
    createdAt: '2026-02-10T11:30:00Z',
  },
  {
    id: 'comment3',
    postId: 'post2',
    authorId: '2',
    content: '복식부기 설명 이해하기 쉽게 잘 써주셨네요. 감사합니다!',
    createdAt: '2026-02-09T15:00:00Z',
  },
  {
    id: 'comment4',
    postId: 'post3',
    authorId: '2',
    content: '봄이 오니 기분이 좋아지네요 ㅎㅎ',
    createdAt: '2026-02-11T19:00:00Z',
  },
  {
    id: 'comment5',
    postId: 'post3',
    authorId: '5',
    content: '글 잘 읽었습니다. 저도 봄이 기다려져요.',
    createdAt: '2026-02-11T20:15:00Z',
  },
];

// Helper function to get user by id
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get blog by slug
export const getBlogBySlug = (slug: string): Blog | undefined => {
  return mockBlogs.find(blog => blog.slug === slug);
};

// Helper function to get blog by id
export const getBlogById = (id: string): Blog | undefined => {
  return mockBlogs.find(blog => blog.id === id);
};

// Helper function to get posts by blog
export const getPostsByBlogId = (blogId: string): Post[] => {
  return mockPosts.filter(post => post.blogId === blogId && post.status === 'PUBLISHED');
};

// Helper function to get post by id
export const getPostById = (id: string): Post | undefined => {
  return mockPosts.find(post => post.id === id);
};

// Helper function to get comments by post
export const getCommentsByPostId = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};

// Helper function to flatten categories (for Studio CPA hierarchical structure)
export const flattenCategories = (categories: Category[]): Category[] => {
  const result: Category[] = [];
  const flatten = (cats: Category[]) => {
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children) {
        flatten(cat.children);
      }
    });
  };
  flatten(categories);
  return result;
};

// Helper function to get relative time
export const getRelativeTime = (dateString: string): string => {
  const now = new Date('2026-02-12T12:00:00Z'); // Current time for mock
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
};
