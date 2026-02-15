import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../app/data/mockData';
import { authApi } from './auth';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = authApi.onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);
    });
    const sub = data?.subscription;
    return () => sub?.unsubscribe?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
