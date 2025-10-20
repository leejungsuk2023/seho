import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">
            세호 (SEHO) 🎨
          </h1>
          <p className="text-xl text-text-light mb-8">
            취향 공동체를 위한 복합 문화 플랫폼
          </p>
          <p className="text-lg text-text-lighter mb-12">
            당신의 취향, 우리의 연결
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">시작하기</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">로그인</Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card hover>
            <CardHeader>
              <CardTitle>🎯 취향 기반 연결</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                비슷한 취향을 가진 사람들과 의미 있는 만남을 경험하세요
              </CardDescription>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>🎨 문화 정보 큐레이션</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                전시, 공연, 이벤트 정보를 한눈에 확인하세요
              </CardDescription>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>💬 활발한 커뮤니티</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                온라인에서 오프라인으로 이어지는 문화 활동
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>🚀 개발 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Phase 1: 프로젝트 초기 설정</span>
                  <span className="text-sm text-primary">67%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[67%]"></div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-text-light">
                  ✅ Frontend 초기 설정 완료<br />
                  ✅ Backend 초기 설정 완료<br />
                  ✅ Database 마이그레이션 완료<br />
                  ✅ 디자인 시스템 구축 완료<br />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
