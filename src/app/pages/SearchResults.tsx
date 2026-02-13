import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import { blogsApi, postsApi } from '../../lib/supabase-api';
import type { Blog, Post } from '../data/mockData';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import { Settings2 } from 'lucide-react';
import { Card } from '../components/ui/card';

const POSTS_PER_PAGE = 12;

interface FontSettings {
  size: number;
  color: string;
}

const colorOptions = [
  { name: '기본', value: '#1F2937' },
  { name: '파랑', value: '#2563EB' },
  { name: '초록', value: '#059669' },
  { name: '보라', value: '#7C3AED' },
  { name: '빨강', value: '#DC2626' },
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('latest');
  const [showFontSettings, setShowFontSettings] = useState(false);

  // Load font settings from localStorage
  const [fontSettings, setFontSettings] = useState<FontSettings>(() => {
    const saved = localStorage.getItem('searchFontSettings');
    return saved
      ? JSON.parse(saved)
      : { size: 16, color: '#1F2937' };
  });

  // Save font settings to localStorage
  useEffect(() => {
    localStorage.setItem('searchFontSettings', JSON.stringify(fontSettings));
  }, [fontSettings]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const blogsData = await blogsApi.getAll();
        setBlogs(blogsData);
        
        // 초기 선택: 모든 블로그 선택
        if (blogsData.length > 0 && selectedBlogs.length === 0) {
          setSelectedBlogs(blogsData.map(b => b.id));
        }
        
        // 검색 쿼리가 있으면 검색, 없으면 모든 포스트 가져오기
        if (query) {
          const searchResults = await postsApi.search(query, {
            limit: 1000, // 충분히 큰 수
          });
          setPosts(searchResults);
        } else {
          const allPosts = await postsApi.getAll({ status: 'PUBLISHED' });
          setPosts(allPosts);
        }
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  // Filter posts by selected blogs
  let filteredPosts = posts.filter(
    (post) => selectedBlogs.length === 0 || selectedBlogs.includes(post.blogId)
  );

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);

    switch (sortBy) {
      case 'latest':
        return bDate.getTime() - aDate.getTime();
      case 'views':
        return b.views - a.views;
      case 'comments':
        return b.commentCount - a.commentCount;
      case 'title':
        return a.title.localeCompare(b.title, 'ko');
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const toggleBlog = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId) ? prev.filter((id) => id !== blogId) : [...prev, blogId]
    );
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">검색 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {query ? `'${query}' 검색 결과` : '모든 게시글'}
        </h1>
        <p className="text-gray-600">{filteredPosts.length}개의 게시글을 찾았습니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Blog Filter */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">블로그 필터</h3>
              <div className="space-y-2">
                {blogs.map((blog) => (
                  <div key={blog.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`search-blog-${blog.id}`}
                      checked={selectedBlogs.includes(blog.id)}
                      onCheckedChange={() => toggleBlog(blog.id)}
                    />
                    <Label
                      htmlFor={`search-blog-${blog.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {blog.nameKo}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sort Options */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">정렬</h3>
              <RadioGroup value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="latest" id="search-sort-latest" />
                  <Label htmlFor="search-sort-latest" className="text-sm cursor-pointer">
                    최신순
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="views" id="search-sort-views" />
                  <Label htmlFor="search-sort-views" className="text-sm cursor-pointer">
                    조회수순
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comments" id="search-sort-comments" />
                  <Label htmlFor="search-sort-comments" className="text-sm cursor-pointer">
                    댓글수순
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="title" id="search-sort-title" />
                  <Label htmlFor="search-sort-title" className="text-sm cursor-pointer">
                    제목순
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            {/* Font Settings */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">폰트 설정</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFontSettings(!showFontSettings)}
                >
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>

              {showFontSettings && (
                <div className="space-y-4">
                  {/* Font Size */}
                  <div>
                    <Label className="text-sm mb-2 block">
                      폰트 크기: {fontSettings.size}px
                    </Label>
                    <Slider
                      value={[fontSettings.size]}
                      onValueChange={([value]) =>
                        setFontSettings({ ...fontSettings, size: value })
                      }
                      min={12}
                      max={20}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Font Color */}
                  <div>
                    <Label className="text-sm mb-2 block">폰트 색상</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setFontSettings({ ...fontSettings, color: option.value })
                          }
                          className={`p-2 text-xs border rounded ${
                            fontSettings.color === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          style={{ color: option.value }}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSettings({ size: 16, color: '#1F2937' })}
                    className="w-full"
                  >
                    초기화
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {paginatedPosts.length > 0 ? (
            <>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                style={{
                  fontSize: `${fontSettings.size}px`,
                  color: fontSettings.color,
                }}
              >
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} showBlogBadge />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-sm mt-2">
                다른 검색어로 시도해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
