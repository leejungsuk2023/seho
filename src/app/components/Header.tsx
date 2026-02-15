import { Link, useNavigate } from 'react-router';
import { Search, Menu, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { authApi } from '../../lib/auth';
import { useAuth } from '../../lib/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await authApi.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gray-900">ch0435</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            홈
          </Link>
          <Link to="/on-air" className="text-sm font-medium hover:text-blue-600 transition-colors">
            On Air
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-sm font-medium hover:text-blue-600 transition-colors">
                블로그
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/blogs/serein-cafe">세렌 카페</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blogs/studio-cpa">스튜디오 CPA</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blogs/swing-company">스윙 컴퍼니</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blogs/bookstore">북스토어</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search and Auth */}
        <div className="flex items-center gap-4">
          {/* Search Form - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Auth Buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => navigate('/my-page')}>
                  마이페이지
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem onSelect={() => navigate('/admin')}>
                    관리자 대시보드
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => handleLogout()}>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
              <Link to="/auth/login">로그인</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="text-sm font-medium hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  홈
                </Link>
                <Link
                  to="/on-air"
                  className="text-sm font-medium hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  On Air
                </Link>
                <div className="border-t pt-2">
                  <p className="text-xs font-semibold text-gray-500 mb-2">블로그</p>
                  <Link
                    to="/blogs/serein-cafe"
                    className="block text-sm py-1 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    세렌 카페
                  </Link>
                  <Link
                    to="/blogs/studio-cpa"
                    className="block text-sm py-1 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    스튜디오 CPA
                  </Link>
                  <Link
                    to="/blogs/swing-company"
                    className="block text-sm py-1 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    스윙 컴퍼니
                  </Link>
                  <Link
                    to="/blogs/bookstore"
                    className="block text-sm py-1 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    북스토어
                  </Link>
                </div>
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="border-t pt-4">
                  <input
                    type="text"
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>
                {/* Mobile Auth */}
                <div className="border-t pt-4">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-500">{user.nickname}님</p>
                      <Button variant="outline" asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <Link to="/my-page">마이페이지</Link>
                      </Button>
                      {user.role === 'ADMIN' && (
                        <Button variant="outline" asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/admin">관리자 대시보드</Link>
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        로그인
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
