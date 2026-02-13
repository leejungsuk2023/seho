import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { blogsApi, postsApi } from '../../lib/supabase-api';
import type { Blog } from '../data/mockData';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        // getAll()이 이미 포스트 수를 포함하여 반환
        const data = await blogsApi.getAll();
        setBlogs(data);
      } catch (err) {
        setError('블로그를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            4개의 특별한 공간
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            세호(SEHO)는 각기 다른 개성을 가진 4개의 블로그 공간을 제공합니다.
            <br />
            당신의 이야기를 시작해보세요.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.coverImage}
                  alt={blog.nameKo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                  style={{ backgroundColor: `${blog.primaryColor}20` }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: blog.primaryColor }}
                >
                  {blog.nameKo}
                </h2>
                <p className="text-sm text-gray-600 mb-1">{blog.name}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {blog.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    포스트 {blog.postCount}개
                  </span>
                  <Button
                    asChild
                    size="sm"
                    style={{ backgroundColor: blog.primaryColor }}
                    className="group-hover:shadow-md transition-shadow"
                  >
                    <Link to={`/blogs/${blog.slug}`} className="gap-1">
                      보러가기
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* On Air CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            모든 블로그의 최신 소식을 한눈에
          </h2>
          <p className="text-gray-600 mb-8">
            On Air 페이지에서 4개 블로그의 최신 포스트를 모두 확인하세요
          </p>
          <Button asChild size="lg">
            <Link to="/on-air" className="gap-2">
              On Air 보러가기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
