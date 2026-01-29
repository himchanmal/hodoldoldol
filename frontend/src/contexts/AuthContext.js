import React, {createContext, useContext, useState, useEffect} from 'react';

const AuthContext = createContext(null);

const WRITE_ALLOWED_TOKENS = ['hodol', 'doldol'];

export function AuthProvider({children}) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '');

  const isAuthenticated = !!token;
  const canWrite = WRITE_ALLOWED_TOKENS.includes(token);

  useEffect(() => {
    const stored = localStorage.getItem('auth_token') || '';
    setToken(stored);
  }, []);

  const setAuth = (authenticated, newToken = '') => {
    const value = authenticated ? newToken : '';
    setToken(value);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, canWrite, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
