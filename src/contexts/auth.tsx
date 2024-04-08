'use client';

import { getLoginedMeOrNull } from '@/actions';
import React from 'react';

type LoginedMeReturn = Awaited<ReturnType<typeof getLoginedMeOrNull>>;

interface AuthContextProps {
  me?: LoginedMeReturn;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ me, children }: React.PropsWithChildren<{ me?: LoginedMeReturn }>) {
  const values = React.useMemo(() => ({ me }), [me]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
