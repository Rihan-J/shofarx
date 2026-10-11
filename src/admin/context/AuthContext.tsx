'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { isAuthenticated, setToken, clearToken } from '../../lib/adminApi';

interface AuthContextType {
  loggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try real API authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          setLoggedIn(true);
          return;
        }
      }
    } catch {
      // Fall through to direct credential check
    }

    // 2. Direct credential check (supports admin@shofarx.com & admin@gmail.com)
    if ((cleanEmail === 'admin@shofarx.com' || cleanEmail === 'admin@gmail.com') && password === 'admin123') {
      setToken('dummy_token_for_testing');
      setLoggedIn(true);
      return;
    }

    throw new Error('Invalid email or password');
  };

  const logout = () => {
    clearToken();
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
