import React from 'react';

import { useAuth } from './context/auth-context';
import { AuthenticatedApp } from './components/AuthenticatedApp/AuthenticatedApp';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';

export const App = () => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
