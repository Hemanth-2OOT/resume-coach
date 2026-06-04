import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/auth/me');
          if (!cancelled) setUser(res.data);
        } catch (e) {
          // Token invalid or expired — clear it
          localStorage.removeItem('token');
          if (!cancelled) {
            setToken(null);
            setUser(null);
          }
        }
      }
      // Always resolve loading — this was the stuck-spinner bug
      if (!cancelled) setIsLoading(false);
    })();

    return () => { cancelled = true; };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && (res.data.token || res.data.access_token)) {
      const t = res.data.token || res.data.access_token;
      localStorage.setItem('token', t);
      setToken(t);
      setAuthToken(t);
      const me = await api.get('/auth/me');
      setUser(me.data);
      return res.data.redirect_to || '/';
    }
    throw new Error('Login failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.is_admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}