import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { authApi } from '../../lib/auth';
import { usersApi, postsApi, commentsApi, blogsApi } from '../../lib/supabase-api';
import type { User, Post, Comment, Blog } from '../data/mockData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, MessageCircle, Calendar, LogOut, KeyRound } from 'lucide-react';
import Pagination from '../components/Pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { toast } from 'sonner';

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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }
    setPasswordChanging(true);
    const { error } = await authApi.updatePassword(newPassword);
    setPasswordChanging(false);
    if (error) {
      toast.error(error.message || '비밀번호 변경에 실패했습니다');
      return;
    }
    toast.success('비밀번호가 변경되었습니다');
    setPasswordDialogOpen(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    await authApi.signOut();
    navigate('/');
  };

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
            <div className="flex-shrink-0 flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)} className="gap-2">
                <KeyRound className="w-4 h-4" />
                비밀번호 변경
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </Card>

      {isOwnPage && (
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>비밀번호 변경</DialogTitle>
              <DialogDescription className="sr-only">새 비밀번호를 입력하세요</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8자 이상, 영문+숫자"
                  className="mt-1"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력"
                  className="mt-1"
                  autoComplete="new-password"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit" disabled={passwordChanging}>
                  {passwordChanging ? '변경 중...' : '변경하기'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

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
