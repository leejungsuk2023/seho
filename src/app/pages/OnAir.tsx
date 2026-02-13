import { useState, useEffect } from 'react';
import { blogsApi, postsApi } from '../../lib/supabase-api';
import { flattenCategories } from '../data/mockData';
import type { Blog, Post } from '../data/mockData';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const POSTS_PER_PAGE = 12;

export default function OnAir() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');

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
        
        // 모든 포스트 가져오기
        const postsData = await postsApi.getAll({ status: 'PUBLISHED' });
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter posts by selected blogs
  let filteredPosts = posts.filter(
    (post) => selectedBlogs.length === 0 || selectedBlogs.includes(post.blogId)
  );

  // Filter by category if selected
  if (selectedCategory !== 'all') {
    filteredPosts = filteredPosts.filter((post) => post.categoryId === selectedCategory);
  }

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    // Special handling for Swing Company: 24-hour priority
    const swingBlog = blogs.find((bl) => bl.slug === 'swing-company');
    const isSwing = (post: Post) => post.blogId === swingBlog?.id;

    const now = new Date();
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);
    const aDiff = now.getTime() - aDate.getTime();
    const bDiff = now.getTime() - bDate.getTime();
    const is24Hours = 24 * 60 * 60 * 1000;

    // Prioritize Swing Company posts within 24 hours
    const aIsRecentSwing = isSwing(a) && aDiff < is24Hours;
    const bIsRecentSwing = isSwing(b) && bDiff < is24Hours;

    if (aIsRecentSwing && !bIsRecentSwing) return -1;
    if (!aIsRecentSwing && bIsRecentSwing) return 1;

    // Then apply selected sorting
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

  // Get all categories from selected blogs
  const selectedBlogObjects = blogs.filter((blog) => selectedBlogs.includes(blog.id));
  const allCategories = selectedBlogObjects.flatMap((blog) => flattenCategories(blog.categories));

  const toggleBlog = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId) ? prev.filter((id) => id !== blogId) : [...prev, blogId]
    );
    setCurrentPage(1);
    setSelectedCategory('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black/40 backdrop-blur-sm flex items-center justify-center">
        <p className="text-white text-lg">로딩 중...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop)',
      }}
    >
      {/* Overlay */}
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">ch0435</h1>
            <p className="text-lg text-white/90">On Air - 모든 블로그의 최신 소식</p>
          </div>

          {/* Filters */}
          <div className="bg-white/95 backdrop-blur rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Blog Selection */}
              <div>
                <h3 className="font-semibold mb-3">블로그 선택</h3>
                <div className="space-y-2">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`blog-${blog.id}`}
                        checked={selectedBlogs.includes(blog.id)}
                        onCheckedChange={() => toggleBlog(blog.id)}
                      />
                      <Label
                        htmlFor={`blog-${blog.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {blog.nameKo}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <h3 className="font-semibold mb-3">카테고리</h3>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameKo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-3">정렬</h3>
                <RadioGroup value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="latest" id="sort-latest" />
                    <Label htmlFor="sort-latest" className="text-sm cursor-pointer">
                      최신순
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="views" id="sort-views" />
                    <Label htmlFor="sort-views" className="text-sm cursor-pointer">
                      조회수순
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comments" id="sort-comments" />
                    <Label htmlFor="sort-comments" className="text-sm cursor-pointer">
                      댓글수순
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="title" id="sort-title" />
                    <Label htmlFor="sort-title" className="text-sm cursor-pointer">
                      제목순
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Posts */}
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id} post={post} showBlogBadge />
                ))}
              </div>

              {/* Pagination */}
              <div className="bg-white/95 backdrop-blur rounded-lg p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="bg-white/95 backdrop-blur rounded-lg p-16 text-center">
              <p className="text-gray-500">선택한 조건에 맞는 게시글이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
