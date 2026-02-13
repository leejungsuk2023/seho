import { useParams, useNavigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { flattenCategories } from '../data/mockData';
import { blogsApi, postsApi } from '../../lib/supabase-api';
import { authApi } from '../../lib/auth';
import type { Blog, Post } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';

export default function WritePost() {
  const { slug, postId } = useParams<{ slug: string; postId?: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [existingPost, setExistingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    authApi.getCurrentUser().then((u) => {
      setCurrentUser(u ?? null);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !authChecked) return;

      if (!currentUser || (currentUser.role !== 'WRITER' && currentUser.role !== 'ADMIN')) {
        toast.error('작성 권한이 없습니다');
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const blogData = await blogsApi.getBySlug(slug);
        if (!blogData) {
          toast.error('블로그를 찾을 수 없습니다');
          navigate('/');
          return;
        }
        setBlog(blogData);

        if (postId) {
          const postData = await postsApi.getById(postId);
          if (postData) {
            setExistingPost(postData);
            setTitle(postData.title);
            setContent(postData.content);
            setCategoryId(postData.categoryId || '');
            setTags(postData.tags.join(', '));
            setStatus(postData.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
            setThumbnailUrl(postData.thumbnailImage || '');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('데이터를 불러오는 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, postId, currentUser, authChecked, navigate]);

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

  const flatCategories = flattenCategories(blog.categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }
    if (!content.trim()) {
      toast.error('내용을 입력해주세요');
      return;
    }
    if (!currentUser) {
      toast.error('로그인이 필요합니다');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, 5);

    const excerpt = content.substring(0, 100) + (content.length > 100 ? '...' : '');
    const postSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now()}`;

    try {
      if (existingPost) {
        // Update existing post
        const updatedPost = await postsApi.update(existingPost.id, {
          title,
          content,
          excerpt,
          categoryId: categoryId || undefined,
          tags: tagsArray,
          status,
          thumbnailImage: thumbnailUrl || undefined,
        });

        if (updatedPost) {
          toast.success('게시글이 수정되었습니다');
          navigate(`/blogs/${slug}/post/${existingPost.id}`);
        } else {
          toast.error('게시글 수정에 실패했습니다');
        }
      } else {
        // Create new post
        const newPost = await postsApi.create({
          title,
          slug: postSlug,
          content,
          excerpt,
          authorId: currentUser.id,
          blogId: blog.id,
          categoryId: categoryId || undefined,
          tags: tagsArray,
          status,
          thumbnailImage: thumbnailUrl || undefined,
        });

        if (newPost) {
          toast.success('게시글이 발행되었습니다');
          navigate(`/blogs/${slug}/post/${newPost.id}`);
        } else {
          toast.error('게시글 발행에 실패했습니다');
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('게시글 저장 중 오류가 발생했습니다');
    }
  };

  const handleSaveDraft = () => {
    setStatus('DRAFT');
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {existingPost ? '게시글 수정' : '새 게시글 작성'}
        </h1>
        <p className="text-gray-600">{blog.nameKo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">제목 *</Label>
          <Input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Category */}
        {flatCategories.length > 0 && (
          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="카테고리 선택 (선택사항)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">선택 안 함</SelectItem>
                {flatCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.parentId ? '  └ ' : ''}
                    {cat.nameKo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tags */}
        <div>
          <Label htmlFor="tags">태그</Label>
          <Input
            id="tags"
            type="text"
            placeholder="쉼표로 구분하여 입력 (최대 5개)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">예: 레시피, 브런치, 홈메이드</p>
        </div>

        {/* Thumbnail URL */}
        <div>
          <Label htmlFor="thumbnail">썸네일 이미지 URL (선택사항)</Label>
          <Input
            id="thumbnail"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="content">본문 *</Label>
          <Textarea
            id="content"
            placeholder="내용을 입력하세요 (Markdown 지원)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 min-h-[400px] font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Markdown 문법을 사용할 수 있습니다. 예: # 제목, **굵게**, *기울임*
          </p>
        </div>

        {/* Status */}
        <div>
          <Label>상태</Label>
          <RadioGroup value={status} onValueChange={(val) => setStatus(val as 'DRAFT' | 'PUBLISHED')} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PUBLISHED" id="status-published" />
              <Label htmlFor="status-published" className="cursor-pointer">
                발행
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DRAFT" id="status-draft" />
              <Label htmlFor="status-draft" className="cursor-pointer">
                임시저장
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" style={{ backgroundColor: blog.primaryColor }}>
            {existingPost ? '수정 완료' : '발행'}
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveDraft}>
            임시저장
          </Button>
          <Button type="button" variant="ghost" asChild>
            <Link to={`/blogs/${slug}`}>취소</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
