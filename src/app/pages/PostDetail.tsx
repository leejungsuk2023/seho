import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { postsApi, usersApi, blogsApi, commentsApi } from '../../lib/supabase-api';
import { authApi } from '../../lib/auth';
import { getRelativeTime } from '../data/mockData';
import type { Post, User, Blog, Comment } from '../data/mockData';
import { Eye, MessageCircle, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export default function PostDetail() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<Map<string, User>>(new Map());
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    authApi.getCurrentUser().then(setCurrentUser);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await postsApi.getById(id);
        if (!postData) {
          setLoading(false);
          return;
        }
        
        setPost(postData);
        
        // 조회수 증가
        await postsApi.incrementViews(id);
        
        // 작성자와 블로그 정보 가져오기
        const [authorData, blogData, commentsData] = await Promise.all([
          usersApi.getById(postData.authorId),
          blogsApi.getById(postData.blogId),
          commentsApi.getByPostId(id),
        ]);
        
        setAuthor(authorData);
        setBlog(blogData);
        setComments(commentsData);
        
        // 댓글 작성자 정보 가져오기
        const authorMap = new Map<string, User>();
        await Promise.all(
          commentsData.map(async (comment) => {
            const author = await usersApi.getById(comment.authorId);
            if (author) {
              authorMap.set(comment.authorId, author);
            }
          })
        );
        setCommentAuthors(authorMap);
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!post || !author || !blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">게시글을 찾을 수 없습니다</h1>
        <Button asChild className="mt-4">
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  const canEdit = currentUser && (currentUser.id === post.authorId || currentUser.role === 'ADMIN');

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('댓글을 작성하려면 로그인이 필요합니다');
      return;
    }
    if (!commentText.trim()) {
      toast.error('댓글 내용을 입력해주세요');
      return;
    }

    try {
      const newComment = await commentsApi.create({
        postId: post.id,
        authorId: currentUser.id,
        content: commentText,
      });

      if (newComment) {
        setComments([...comments, newComment]);
        const author = await usersApi.getById(currentUser.id);
        if (author) {
          setCommentAuthors(new Map(commentAuthors).set(currentUser.id, author));
        }
        setCommentText('');
        toast.success('댓글이 작성되었습니다');
      } else {
        toast.error('댓글 작성에 실패했습니다');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('댓글 작성 중 오류가 발생했습니다');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      try {
        const success = await commentsApi.delete(commentId);
        if (success) {
          setComments(comments.filter((c) => c.id !== commentId));
          toast.success('댓글이 삭제되었습니다');
        } else {
          toast.error('댓글 삭제에 실패했습니다');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('댓글 삭제 중 오류가 발생했습니다');
      }
    }
  };

  const handleDeletePost = async () => {
    if (confirm('게시글을 삭제하시겠습니까?')) {
      try {
        const success = await postsApi.delete(post.id);
        if (success) {
          toast.success('게시글이 삭제되었습니다');
          navigate(`/blogs/${slug}`);
        } else {
          toast.error('게시글 삭제에 실패했습니다');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('게시글 삭제 중 오류가 발생했습니다');
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-gray-900">
              홈
            </Link>
            <span>/</span>
            <Link to={`/blogs/${blog.slug}`} className="hover:text-gray-900">
              {blog.nameKo}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{post.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <Link
              to={`/user/${author.id}`}
              className="flex items-center gap-2 hover:text-gray-900"
            >
              {author.profileImage && (
                <img
                  src={author.profileImage}
                  alt={author.nickname}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <span className="font-medium">{author.nickname}</span>
            </Link>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{getRelativeTime(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Edit/Delete Buttons */}
          {canEdit && (
            <div className="flex gap-2 mt-4">
              <Button asChild size="sm" variant="outline">
                <Link to={`/blogs/${slug}/edit/${post.id}`} className="gap-2">
                  <Edit className="w-4 h-4" />
                  수정
                </Link>
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDeletePost} className="gap-2">
                <Trash2 className="w-4 h-4" />
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </article>

        {/* Comments Section */}
        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">댓글 {comments.length}개</h2>

          {/* Comment Form */}
          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                placeholder="댓글을 작성해주세요..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-2"
                rows={4}
              />
              <div className="flex justify-end">
                <Button type="submit">댓글 작성</Button>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-2">댓글을 작성하려면 로그인이 필요합니다</p>
              <Button asChild size="sm">
                <Link to="/auth/login">로그인</Link>
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => {
              const commentAuthor = commentAuthors.get(comment.authorId);
              const canDeleteComment =
                currentUser && (currentUser.id === comment.authorId || currentUser.role === 'ADMIN');

              return (
                <div key={comment.id} className="flex gap-4">
                  {commentAuthor?.profileImage && (
                    <img
                      src={commentAuthor.profileImage}
                      alt={commentAuthor.nickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{commentAuthor?.nickname || '익명'}</span>
                      <span className="text-xs text-gray-500">
                        {getRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    {canDeleteComment && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="mt-2 text-red-600 hover:text-red-700"
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {comments.length === 0 && (
              <p className="text-center text-gray-500 py-8">첫 댓글을 작성해보세요!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
