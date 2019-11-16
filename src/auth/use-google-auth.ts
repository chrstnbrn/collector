import { useEffect, useState } from 'react';

import { AuthConfiguration } from './auth-configuration';

export function useGoogleAuth(configuration: AuthConfiguration) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          clientId: configuration.clientId,
          discoveryDocs: configuration.discoveryDocs,
          scope: configuration.scope
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
  }, [configuration]);

  return { isSignedIn, signIn, signOut, getAccessToken };
}

function signIn() {
  gapi.auth2.getAuthInstance().signIn();
}

function signOut() {
  gapi.auth2.getAuthInstance().signOut();
}

function getAccessToken() {
  return gapi.client.getToken().access_token;
}
