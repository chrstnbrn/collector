import './App.css';

import { Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { Collection } from '../models/collection';
import settings from '../settings.json';
import { loadCollection } from '../spreadsheet/load-collection';
import { CollectionTable } from './CollectionTable';
import { Header } from './Header';
import { Login } from './Login';
import { Setup } from './Setup';

export const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

    function initClient() {
      gapi.client
        .init({
          clientId: settings.clientId,
          discoveryDocs: settings.discoveryDocs,
          scope: SCOPES
        })
        .then(
          function() {
            // Listen for sign-in state changes.
            gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(signInState => setIsSignedIn(signInState));

            // Handle the initial sign-in state.
            const signInState = gapi.auth2.getAuthInstance().isSignedIn.get();
            setIsSignedIn(signInState);
          },
          function(error) {
            console.log(error);
          }
        );
    }

    gapi.load('client:auth2', initClient);
  }, []);

  function signIn() {
    gapi.auth2.getAuthInstance().signIn();
  }

  function signOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  async function loadData(spreadsheetId: string, spreadsheetName: string) {
    const accessToken = gapi.client.getToken().access_token;
    const collection = await loadCollection(accessToken, spreadsheetId, spreadsheetName);
    setCollection(collection);
  }

  return (
    <div className="App">
      <Header isLoggedIn={isSignedIn} handleLogin={signIn} handleLogout={signOut}></Header>
      <Container maxWidth="lg">
        {isSignedIn ? (
          <div>
            <Setup handleLoadData={loadData}></Setup>
            {collection ? <CollectionTable collection={collection}></CollectionTable> : null}
          </div>
        ) : (
          <Login handleLogin={signIn}></Login>
        )}
      </Container>
    </div>
  );
};
