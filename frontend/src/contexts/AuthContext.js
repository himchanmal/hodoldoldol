import React, {createContext, useContext, useState, useEffect} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('auth_token');
  });

  // 토큰이 있으면 인증된 것으로 간주
  // 실제 인증은 API 호출 시 401 에러로 확인
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    // 실제 인증 확인은 API 호출 시 에러로 판단
    setIsAuthenticated(true);
    return true;
  };

  const setAuth = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  return (
    <AuthContext.Provider value={{isAuthenticated, checkAuth, setAuth}}>
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
