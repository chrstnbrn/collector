import './App.css';

import React from 'react';

import { useAuth } from '../context/auth-context';
import { AuthenticatedApp } from './AuthenticatedApp';
import { UnauthenticatedApp } from './UnauthenticatedApp';

export const App = () => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};
