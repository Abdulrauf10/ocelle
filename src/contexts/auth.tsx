'use client';

import React from 'react';

import { getClientLoginedMe } from '@/actions';

type LoginedMeReturn = Awaited<ReturnType<typeof getClientLoginedMe>>;

interface AuthContextProps {
  me?: LoginedMeReturn;
  logout(): Promise<void>;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({
  me,
  logout,
  children,
}: React.PropsWithChildren<{
  me?: LoginedMeReturn;
  logout(): Promise<void>;
}>) {
  const values = React.useMemo(() => ({ me, logout }), [me, logout]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
