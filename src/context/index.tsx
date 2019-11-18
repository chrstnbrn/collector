import React from 'react';

import { AuthProvider } from './auth-context';

export function AppProviders({ children }: { children: any }) {
  return <AuthProvider>{children}</AuthProvider>;
}
