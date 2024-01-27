'use client';

import React from 'react';

interface AuthContextProps {
  token?: string;
  logined: boolean;
  login(): void;
  logout(): void;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [token, setToken] = React.useState<string>();
  const logined = React.useMemo(() => token != null, [token]);

  const login = React.useCallback(() => {}, []);

  const logout = React.useCallback(() => {}, []);

  const values = React.useMemo(() => {
    return {
      token,
      logined,
      login,
      logout,
    };
  }, [token, logined, login, logout]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
