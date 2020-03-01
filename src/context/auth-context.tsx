import React, { useEffect, useState } from 'react';

import settings from '../settings.json';

interface AuthContextValue {
  isSignedIn: boolean;
  getAccessToken: () => string;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: any) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          clientId: settings.clientId,
          discoveryDocs: settings.discoveryDocs,
          scope: settings.scopes.join(' ')
        })
        .then(
          () => {
            // Listen for sign-in state changes.
            gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(signInState => setIsSignedIn(signInState));

            // Handle the initial sign-in state.
            const signInState = gapi.auth2.getAuthInstance().isSignedIn.get();
            setIsSignedIn(signInState);
          },
          error => {
            console.log(error);
          }
        );
    }

    gapi.load('client:auth2', initClient);
  }, []);

  const getAccessToken = () => gapi.client.getToken().access_token;
  const signIn = () => gapi.auth2.getAuthInstance().signIn();
  const signOut = () => gapi.auth2.getAuthInstance().signOut();

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
