import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { usersApi, postsApi, commentsApi, blogsApi } from '../../lib/supabase-api';
import type { User, Post, Comment, Blog } from '../data/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Eye, MessageCircle, Calendar } from 'lucide-react';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

export default function MyPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('posts');
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);

  const { user: currentUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (authLoading) return;

      if (!currentUser && !id) {
        setLoading(false);
        return;
      }

      const targetId = id || currentUser?.id;
      if (!targetId) {
        setLoading(false);
        return;
      }

      const [userData, postsData, commentsData] = await Promise.all([
        usersApi.getById(targetId),
        postsApi.getByAuthorId(targetId),
        commentsApi.getByAuthorId(targetId, 500),
      ]);

      setUser(userData || null);
      setUserPosts(postsData);
      setUserComments(commentsData);
      setLoading(false);
    };

    load();
  }, [id, currentUser, authLoading]);

  useEffect(() => {
    if (!currentUser && !id && !loading) {
      navigate('/auth/login');
    }
  }, [currentUser, id, loading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">사용자를 찾을 수 없습니다</h1>
        <Button asChild className="mt-4">
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  const isOwnPage = currentUser?.id === user.id;

  const totalPostsPages = Math.ceil(userPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = userPosts.slice(
    (postsPage - 1) * ITEMS_PER_PAGE,
    postsPage * ITEMS_PER_PAGE
  );

  const totalCommentsPages = Math.ceil(userComments.length / ITEMS_PER_PAGE) || 1;
  const paginatedComments = userComments.slice(
    (commentsPage - 1) * ITEMS_PER_PAGE,
    commentsPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.nickname}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">{user.nickname.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.nickname}</h1>
            <p className="text-gray-600 mb-1">@{user.username}</p>
            {user.bio && <p className="text-gray-700 mt-3">{user.bio}</p>}
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="text-sm">
                <span className="font-semibold">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">게시글</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">{userComments.length}</span>
                <span className="text-gray-600 ml-1">댓글</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">{user.role}</span>
                <span className="text-gray-600 ml-1">권한</span>
              </div>
            </div>
          </div>
          {isOwnPage && (
            <div className="flex-shrink-0">
              <Button variant="outline">프로필 수정</Button>
            </div>
          )}
        </div>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts">내 포스트</TabsTrigger>
          <TabsTrigger value="comments">내 댓글</TabsTrigger>
          <TabsTrigger value="bookmarks" disabled>
            북마크 (준비중)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {paginatedPosts.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedPosts.map((post) => (
                  <MyPagePostCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination
                currentPage={postsPage}
                totalPages={totalPostsPages}
                onPageChange={setPostsPage}
              />
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>작성한 게시글이 없습니다</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments">
          {paginatedComments.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedComments.map((comment) => (
                  <MyPageCommentCard key={comment.id} comment={comment} />
                ))}
              </div>
              <Pagination
                currentPage={commentsPage}
                totalPages={totalCommentsPages}
                onPageChange={setCommentsPage}
              />
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p>작성한 댓글이 없습니다</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarks">
          <div className="text-center py-16 text-gray-500">
            <p>북마크 기능은 곧 제공될 예정입니다</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MyPagePostCard({ post }: { post: Post }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  useEffect(() => {
    blogsApi.getById(post.blogId).then(setBlog);
  }, [post.blogId]);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <Link to={`/blogs/${blog?.slug ?? ''}/post/${post.id}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="font-medium" style={{ color: blog?.primaryColor }}>
                {blog?.nameKo}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.commentCount}
              </div>
            </div>
          </div>
          {post.thumbnailImage && (
            <img
              src={post.thumbnailImage}
              alt={post.title}
              className="w-24 h-24 rounded object-cover"
            />
          )}
        </div>
      </Link>
    </Card>
  );
}

function MyPageCommentCard({ comment }: { comment: Comment }) {
  const [post, setPost] = useState<Post | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    postsApi.getById(comment.postId).then((p) => {
      setPost(p ?? null);
      if (p) blogsApi.getById(p.blogId).then(setBlog);
    });
  }, [comment.postId]);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-700 mb-3">{comment.content}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>댓글 작성:</span>
          {post && blog && (
            <Link
              to={`/blogs/${blog.slug}/post/${post.id}`}
              className="text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
          )}
          <span className="ml-auto">
            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>
    </Card>
  );
}
