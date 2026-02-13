import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { authApi } from '../../lib/auth';
import { usersApi } from '../../lib/supabase-api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    email: '',
    birthdate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = '아이디는 필수입니다';
    }

    if (!formData.email?.trim()) {
      newErrors.email = '이메일은 필수입니다 (로그인에 사용됩니다)';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호는 필수입니다';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다';
    }

    // Password confirm validation
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    // Nickname validation
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임은 필수입니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { level: '약함', color: 'bg-red-500' };
    if (strength <= 2) return { level: '보통', color: 'bg-yellow-500' };
    return { level: '강함', color: 'bg-green-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('입력 정보를 확인해주세요');
      return;
    }

    const email = formData.email?.trim() ?? '';
    const username = formData.username.trim();
    const nickname = formData.nickname.trim();

    const existing = await usersApi.getByUsername(username);
    if (existing) {
      setErrors((prev) => ({ ...prev, username: '이미 사용 중인 아이디입니다' }));
      toast.error('이미 사용 중인 아이디입니다');
      return;
    }

    setLoading(true);
    const { user, error } = await authApi.signUp(email, formData.password, {
      username,
      nickname,
    });
    setLoading(false);

    if (error || !user) {
      toast.error(error?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    toast.success('회원가입이 완료되었습니다!');
    navigate('/auth/login');
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">세호의 일원이 되어보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <Label htmlFor="username">아이디 *</Label>
            <Input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1"
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">비밀번호 *</Label>
            <Input
              id="password"
              type="password"
              placeholder="최소 8자, 영문+숫자"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1"
            />
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{
                        width:
                          passwordStrength.level === '약함'
                            ? '33%'
                            : passwordStrength.level === '보통'
                            ? '66%'
                            : '100%',
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{passwordStrength.level}</span>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Password Confirm */}
          <div>
            <Label htmlFor="passwordConfirm">비밀번호 확인 *</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              className="mt-1"
            />
            {errors.passwordConfirm && (
              <p className="text-xs text-red-600 mt-1">{errors.passwordConfirm}</p>
            )}
          </div>

          {/* Nickname */}
          <div>
            <Label htmlFor="nickname">닉네임 *</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="mt-1"
            />
            {errors.nickname && (
              <p className="text-xs text-red-600 mt-1">{errors.nickname}</p>
            )}
          </div>

          {/* Email (필수 - 로그인에 사용) */}
          <div>
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Birthdate (Optional) */}
          <div>
            <Label htmlFor="birthdate">생년월일 (선택)</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
