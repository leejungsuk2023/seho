import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { authApi } from '../../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    const { user, error } = await authApi.signIn(email.trim(), password);

    setLoading(false);
    if (error) {
      toast.error(error.message || '로그인에 실패했습니다');
      return;
    }

    if (user) {
      toast.success(`${user.nickname}님, 환영합니다!`);
      navigate('/');
    } else {
      toast.error('사용자 정보를 불러올 수 없습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-600">세호에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/auth/register" className="text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            <Link to="#" className="hover:underline">
              비밀번호 찾기
            </Link>
          </p>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Supabase 로그인</p>
          <p className="text-xs text-blue-800">
            회원가입 후 이메일/비밀번호로 로그인하세요. 시드 데이터의 사용자는 Supabase Auth에 없으므로 새로 가입한 계정으로만 로그인할 수 있습니다.
          </p>
        </div>
      </Card>
    </div>
  );
}
