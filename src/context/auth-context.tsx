import React from 'react';

import { useGoogleAuth } from '../auth/use-google-auth';
import settings from '../settings.json';

interface AuthContextValue {
  isSignedIn: boolean;
  getAccessToken: () => string;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: any) {
  const { getAccessToken, isSignedIn, signIn, signOut } = useGoogleAuth({
    clientId: settings.clientId,
    discoveryDocs: settings.discoveryDocs,
    scopes: settings.scopes
  });

  return (
    <AuthContext.Provider value={{ isSignedIn, getAccessToken, signIn, signOut }} {...props} />
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
