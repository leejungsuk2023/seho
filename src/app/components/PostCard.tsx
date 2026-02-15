import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { Post, getRelativeTime } from '../data/mockData';
import type { User, Blog } from '../data/mockData';
import { usersApi, blogsApi } from '../../lib/supabase-api';
import { Badge } from './ui/badge';

interface PostCardProps {
  post: Post;
  showBlogBadge?: boolean;
  /** 사전 조회된 author (제공 시 API 호출 생략) */
  author?: User | null;
  /** 사전 조회된 blog (제공 시 API 호출 생략) */
  blog?: Blog | null;
}

export default function PostCard({ post, showBlogBadge = false, author: authorProp, blog: blogProp }: PostCardProps) {
  const [author, setAuthor] = useState<User | null>(authorProp ?? null);
  const [blog, setBlog] = useState<Blog | null>(blogProp ?? null);

  useEffect(() => {
    if (authorProp !== undefined && blogProp !== undefined) {
      setAuthor(authorProp);
      setBlog(blogProp);
      return;
    }
    async function fetchData() {
      const [authorData, blogData] = await Promise.all([
        usersApi.getById(post.authorId),
        blogsApi.getById(post.blogId),
      ]);
      setAuthor(authorData);
      setBlog(blogData);
    }
    fetchData();
  }, [post.authorId, post.blogId, authorProp, blogProp]);

  if (!author || !blog) {
    return (
      <div className="block group bg-white rounded-lg border p-6">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <Link
      to={`/blogs/${blog.slug}/post/${post.id}`}
      className="block group bg-white rounded-lg border hover:shadow-md transition-all duration-200"
    >
      <div className="p-6">
        {/* Blog Badge (for On Air page) */}
        {showBlogBadge && (
          <div className="mb-3">
            <Badge
              className="text-xs"
              style={{ backgroundColor: blog.primaryColor, color: 'white' }}
            >
              {blog.nameKo}
            </Badge>
          </div>
        )}

        {/* Thumbnail Image */}
        {post.thumbnailImage && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img
              src={post.thumbnailImage}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {author.profileImage && (
              <img
                src={author.profileImage}
                alt={author.nickname}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{author.nickname}</span>
              <span className="text-xs text-gray-500">{getRelativeTime(post.createdAt)}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
