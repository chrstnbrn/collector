import React from 'react';

import { useAuth } from '../context/auth-context';
import { Login } from './Login';

export function UnauthenticatedApp() {
  const { signIn } = useAuth();
  return <Login handleLogin={signIn}></Login>;
}
