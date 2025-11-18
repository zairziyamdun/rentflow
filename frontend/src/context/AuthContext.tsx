'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  name: string;
  role: 'tenant' | 'landlord' | 'admin';
  exp: number;
}

interface AuthContextType {
  user: { id: string; name: string; role: DecodedToken['role'] } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({ id: decoded.userId, name: decoded.name, role: decoded.role });
      } catch {
        logout();
      }
    }
  }, [logout]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<DecodedToken>(token);
    setUser({ id: decoded.userId, name: decoded.name, role: decoded.role });

    if (decoded.role === 'tenant') router.push('/properties');
    else if (decoded.role === 'landlord') router.push('/my-properties');
    else if (decoded.role === 'admin') router.push('/admin/users');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
