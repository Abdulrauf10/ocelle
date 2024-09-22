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
  getLoginedMe,
  logout,
  children,
}: React.PropsWithChildren<{
  getLoginedMe: typeof getClientLoginedMe;
  logout(): Promise<void>;
}>) {
  const [me, setMe] = React.useState<LoginedMeReturn>();
  const values = React.useMemo(() => ({ me, logout }), [me, logout]);

  React.useEffect(() => {
    getLoginedMe().then(setMe);
  }, [getLoginedMe]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
