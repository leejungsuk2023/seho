import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getRelativeTime, flattenCategories } from '../data/mockData';
import { usersApi, postsApi, commentsApi, blogsApi, categoriesApi } from '../../lib/supabase-api';
import { authApi } from '../../lib/auth';
import type { User, Post, Comment, Blog, Category } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Users, FileText, MessageSquare, EyeOff, LayoutDashboard, BookOpen, Plus, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import Pagination from '../components/Pagination';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);

  const POSTS_PER_PAGE = 10;
  const COMMENTS_PER_PAGE = 10;

  useEffect(() => {
    authApi.getCurrentUser().then((u) => {
      setCurrentUser(u ?? null);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!authChecked || currentUser === null) return;
    if (currentUser.role !== 'ADMIN') {
      toast.error('관리자 권한이 필요합니다');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, postsData, commentsData, blogsData] = await Promise.all([
          usersApi.getAll(),
          postsApi.getAll({ limit: 500 }),
          commentsApi.getAll(500),
          blogsApi.getAll(),
        ]);

        setUsers(usersData);
        setPosts(postsData);
        setComments(commentsData);
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('데이터를 불러오는 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, authChecked, navigate]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">로그인 확인 중...</p>
      </div>
    );
  }
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  // Calculate KPIs
  const totalUsers = users.length;
  const activePosts = posts.filter((p) => p.status === 'PUBLISHED').length;
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentComments = comments.filter(
    (c) => new Date(c.createdAt) > oneDayAgo
  ).length;
  const hiddenItems = posts.filter((p) => p.status === 'HIDDEN').length;

  // Recent posts
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Recent comments
  const latestComments = [...comments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const getUserById = (id: string) => users.find((u) => u.id === id);

  const handleTogglePostStatus = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const newStatus = post.status === 'HIDDEN' ? 'PUBLISHED' : 'HIDDEN';
    const updatedPost = await postsApi.update(postId, { status: newStatus });

    if (updatedPost) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
      toast.success(
        newStatus === 'HIDDEN' ? '게시글을 숨겼습니다' : '게시글을 복구했습니다'
      );
    } else {
      toast.error('게시글 상태 변경에 실패했습니다');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const success = await commentsApi.delete(commentId);
    if (success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('댓글이 삭제되었습니다');
    } else {
      toast.error('댓글 삭제에 실패했습니다');
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: 'VIEWER' | 'WRITER' | 'ADMIN') => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedUser = await usersApi.update(userId, { role: newRole });
    if (updatedUser) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast.success(`${user.nickname}님의 권한이 ${newRole}로 변경되었습니다`);
    } else {
      toast.error('사용자 권한 변경에 실패했습니다');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('이 포스트를 완전히 삭제하시겠습니까? 삭제된 댓글도 함께 삭제됩니다.')) return;
    const success = await postsApi.delete(postId);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('포스트가 삭제되었습니다');
    } else {
      toast.error('포스트 삭제에 실패했습니다');
    }
  };

  // Pagination
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const totalPostsPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE) || 1;
  const totalCommentsPages = Math.ceil(sortedComments.length / COMMENTS_PER_PAGE) || 1;
  const paginatedPostsForTable = sortedPosts.slice(
    (postsPage - 1) * POSTS_PER_PAGE,
    postsPage * POSTS_PER_PAGE
  );
  const paginatedCommentsForTable = sortedComments.slice(
    (commentsPage - 1) * COMMENTS_PER_PAGE,
    commentsPage * COMMENTS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen text-white p-6">
          <h1 className="text-2xl font-bold mb-8">관리자</h1>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'users' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'posts' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'comments' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Comments
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${
                activeTab === 'blogs' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blogs
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Dashboard */}
            <TabsContent value="dashboard">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">전체 사용자</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">활성 포스트</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{activePosts}</p>
                    </div>
                    <FileText className="w-10 h-10 text-green-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">최근 24시간 댓글</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{recentComments}</p>
                    </div>
                    <MessageSquare className="w-10 h-10 text-purple-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">숨김 아이템</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{hiddenItems}</p>
                    </div>
                    <EyeOff className="w-10 h-10 text-orange-500" />
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Posts */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">최근 포스트</h3>
                  <div className="space-y-3">
                    {recentPosts.slice(0, 5).map((post) => {
                      const author = getUserById(post.authorId);
                      return (
                        <div key={post.id} className="flex items-start justify-between pb-3 border-b last:border-0">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {author?.nickname} • {getRelativeTime(post.createdAt)}
                            </p>
                          </div>
                          <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Recent Comments */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">최근 댓글</h3>
                  <div className="space-y-3">
                    {latestComments.slice(0, 5).map((comment) => {
                      const author = getUserById(comment.authorId);
                      return (
                        <div key={comment.id} className="pb-3 border-b last:border-0">
                          <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                            {comment.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {author?.nickname} • {getRelativeTime(comment.createdAt)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">사용자 관리</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>사용자</TableHead>
                      <TableHead>아이디</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>권한</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.profileImage && (
                              <img
                                src={user.profileImage}
                                alt={user.nickname}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="font-medium">{user.nickname}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === 'ADMIN'
                                ? 'destructive'
                                : user.role === 'WRITER'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleChangeUserRole(
                                user.id,
                                e.target.value as 'VIEWER' | 'WRITER' | 'ADMIN'
                              )
                            }
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="VIEWER">VIEWER</option>
                            <option value="WRITER">WRITER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Posts */}
            <TabsContent value="posts">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">포스트 관리</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제목</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPostsForTable.map((post) => {
                      const author = getUserById(post.authorId);
                      return (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{author?.nickname}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === 'PUBLISHED'
                                  ? 'default'
                                  : post.status === 'HIDDEN'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTogglePostStatus(post.id)}
                              >
                                {post.status === 'HIDDEN' ? '복구' : '숨김'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="p-4 border-t">
                  <Pagination
                    currentPage={postsPage}
                    totalPages={totalPostsPages}
                    onPageChange={setPostsPage}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Comments */}
            <TabsContent value="comments">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">댓글 관리</h2>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>내용</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCommentsForTable.map((comment) => {
                      const author = getUserById(comment.authorId);
                      return (
                        <TableRow key={comment.id}>
                          <TableCell className="max-w-md truncate">
                            {comment.content}
                          </TableCell>
                          <TableCell>{author?.nickname}</TableCell>
                          <TableCell>
                            {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              삭제
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="p-4 border-t">
                  <Pagination
                    currentPage={commentsPage}
                    totalPages={totalCommentsPages}
                    onPageChange={setCommentsPage}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Blogs */}
            <TabsContent value="blogs">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">블로그 관리</h2>
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <BlogEditCard
                    key={blog.id}
                    blog={blog}
                    onUpdate={() => {
                      blogsApi.getById(blog.id).then((b) => {
                        if (b) setBlogs((prev) => prev.map((bl) => (bl.id === blog.id ? b : bl)));
                      });
                    }}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// 블로그 편집 카드 (설정 + 카테고리 CRUD)
function BlogEditCard({ blog, onUpdate }: { blog: Blog; onUpdate: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(blog.name);
  const [nameKo, setNameKo] = useState(blog.nameKo);
  const [description, setDescription] = useState(blog.description);
  const [coverImage, setCoverImage] = useState(blog.coverImage);
  const [logoImage, setLogoImage] = useState(blog.logoImage || '');
  const [primaryColor, setPrimaryColor] = useState(blog.primaryColor);
  const [categories, setCategories] = useState<Category[]>(() => flattenCategories(blog.categories));
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameKo, setNewCatNameKo] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(blog.name);
    setNameKo(blog.nameKo);
    setDescription(blog.description);
    setCoverImage(blog.coverImage);
    setLogoImage(blog.logoImage || '');
    setPrimaryColor(blog.primaryColor);
    setCategories(flattenCategories(blog.categories));
  }, [blog]);

  const handleSaveBlog = async () => {
    setSaving(true);
    const updated = await blogsApi.update(blog.id, {
      name,
      nameKo,
      description,
      coverImage,
      logoImage: logoImage || undefined,
      primaryColor,
    });
    setSaving(false);
    if (updated) {
      onUpdate();
      toast.success('블로그 설정이 저장되었습니다');
      setOpen(false);
    } else {
      toast.error('저장에 실패했습니다');
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim() || !newCatNameKo.trim()) {
      toast.error('카테고리 이름(영문/한글)을 입력하세요');
      return;
    }
    const created = await categoriesApi.create({
      name: newCatName.trim(),
      nameKo: newCatNameKo.trim(),
      blogId: blog.id,
    });
    if (created) {
      setCategories((prev) => [...prev, created]);
      setNewCatName('');
      setNewCatNameKo('');
      onUpdate();
      toast.success('카테고리가 추가되었습니다');
    } else {
      toast.error('카테고리 추가에 실패했습니다 (이름 중복 가능)');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;
    const ok = await categoriesApi.delete(categoryId);
    if (ok) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      onUpdate();
      toast.success('카테고리가 삭제되었습니다');
    } else {
      toast.error('카테고리 삭제에 실패했습니다');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {blog.coverImage && (
            <img src={blog.coverImage} alt="" className="w-20 h-12 object-cover rounded" />
          )}
          <div>
            <h3 className="font-semibold text-lg" style={{ color: blog.primaryColor }}>
              {blog.nameKo}
            </h3>
            <p className="text-sm text-gray-500">{blog.slug}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">설정 편집</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>블로그 설정: {blog.nameKo}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>이름 (영문)</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>이름 (한글)</Label>
                <Input value={nameKo} onChange={(e) => setNameKo(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>설명</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>커버 이미지 URL</Label>
                <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>로고 이미지 URL (선택)</Label>
                <Input value={logoImage} onChange={(e) => setLogoImage(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>대표 색상</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="border-t pt-4">
                <Label className="mb-2 block">카테고리</Label>
                <ul className="space-y-1 mb-3">
                  {categories.map((cat) => (
                    <li key={cat.id} className="flex items-center justify-between text-sm">
                      <span>{cat.nameKo} ({cat.name})</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    placeholder="영문 이름"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="한글 이름"
                    value={newCatNameKo}
                    onChange={(e) => setNewCatNameKo(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddCategory}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
              <Button onClick={handleSaveBlog} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
