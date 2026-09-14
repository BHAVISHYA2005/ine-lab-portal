import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, signup as signupRequest } from '../api/auth.js';
import { AUTH_STORAGE_KEY } from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = AUTH_STORAGE_KEY;

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const value = useMemo(() => ({
    token: session?.token ?? null,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.token),
    login: async (credentials) => {
      const next = await loginRequest(credentials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSession(next);
      return next;
    },
    signup: async (credentials) => {
      const next = await signupRequest(credentials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSession(next);
      return next;
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
    },
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
