import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{ 
    (async ()=>{
      if(token){ 
        setAuthToken(token); 
        try{ 
          const res = await api.get('/auth/me'); 
          setUser(res.data); 
        }catch(e){ 
          localStorage.removeItem('token'); 
          setToken(null); 
        }
      }
      setIsLoading(false);
    })(); 
  }, [token]);

  const login = async (email, password) =>{
    const res = await api.post('/auth/login', { email, password });
    if(res.data && res.data.token){
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      const me = await api.get('/auth/me');
      setUser(me.data);
      return res.data.redirect_to || '/';
    }
    throw new Error('Login failed');
  };

  const logout = ()=>{ 
    localStorage.removeItem('token'); 
    setToken(null); 
    setUser(null); 
    setAuthToken(null); 
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAuthenticated: !!token, isAdmin: user?.is_admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  const context = useContext(AuthContext);
  if(!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
