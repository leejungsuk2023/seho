import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            © 2026 ch0435.com. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link to="#" className="hover:text-gray-900">
              이용약관
            </Link>
            <Link to="#" className="hover:text-gray-900">
              개인정보처리방침
            </Link>
            <Link to="#" className="hover:text-gray-900">
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
