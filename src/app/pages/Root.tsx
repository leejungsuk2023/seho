import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
