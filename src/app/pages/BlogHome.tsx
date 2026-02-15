import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { blogsApi, postsApi, usersApi } from '../../lib/supabase-api';
import { useAuth } from '../../lib/AuthContext';
import { flattenCategories } from '../data/mockData';
import type { Blog, Post } from '../data/mockData';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { PenSquare } from 'lucide-react';

const POSTS_PER_PAGE = 9;

export default function BlogHome() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorsMap, setAuthorsMap] = useState<Record<string, import('../data/mockData').User>>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const blogData = await blogsApi.getBySlug(slug);
        if (!blogData) {
          setLoading(false);
          return;
        }
        
        setBlog(blogData);

        const postsData = await postsApi.getByBlogId(blogData.id, {
          status: 'PUBLISHED',
        });
        setPosts(postsData);

        const authorIds = [...new Set(postsData.map((p) => p.authorId))];
        const users = await usersApi.getByIds(authorIds);
        setAuthorsMap(users);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">블로그를 찾을 수 없습니다</h1>
      </div>
    );
  }

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => post.categoryId === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const flatCategories = flattenCategories(blog.categories);

  const canWrite = currentUser && (currentUser.role === 'WRITER' || currentUser.role === 'ADMIN');

  return (
    <div className="w-full">
      {/* Blog Header */}
      <div
        className="relative h-64 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${blog.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.nameKo}</h1>
          <p className="text-lg md:text-xl max-w-2xl">{blog.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter & Write Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Categories */}
          {blog.categories.length > 0 && (
            <div className="w-full md:w-auto">
              {/* For Serein Cafe and Bookstore: Tabs */}
              {(blog.slug === 'serein-cafe' || blog.slug === 'bookstore') && (
                <Tabs
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1);
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="all">전체</TabsTrigger>
                    {blog.categories.map((cat) => (
                      <TabsTrigger key={cat.id} value={cat.id}>
                        {cat.nameKo}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}

              {/* For Studio CPA: Hierarchical Dropdown */}
              {blog.slug === 'studio-cpa' && (
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {flatCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.parentId ? '  └ ' : ''}
                        {cat.nameKo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Write Button */}
          {canWrite && (
            <Button asChild style={{ backgroundColor: blog.primaryColor }}>
              <Link to={`/blogs/${blog.slug}/write`} className="gap-2">
                <PenSquare className="w-4 h-4" />
                글쓰기
              </Link>
            </Button>
          )}
        </div>

        {/* Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={authorsMap[post.authorId] ?? null}
                  blog={blog}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">아직 게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
