import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto' }}>
          <h1 style={{ color: '#dc2626' }}>오류가 발생했습니다</h1>
          <p>
            페이지를 불러오는 중 문제가 생겼습니다. Vercel 환경 변수(
            <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>)가
            설정되어 있는지 확인한 뒤 다시 배포해보세요.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            개발자 도구(F12) 콘솔에서 자세한 오류를 확인할 수 있습니다.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
