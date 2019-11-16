import './App.css';

import { Container } from '@material-ui/core';
import React, { useState } from 'react';

import { AuthConfiguration } from '../auth/auth-configuration';
import { useGoogleAuth } from '../auth/use-google-auth';
import { Collection } from '../models/collection';
import settings from '../settings.json';
import { loadCollection } from '../spreadsheet/load-collection';
import { CollectionTable } from './CollectionTable';
import { Header } from './Header';
import { Login } from './Login';
import { Setup } from './Setup';

export const App = () => {
  const [collection, setCollection] = useState<Collection | null>(null);

  const authConfiguration: AuthConfiguration = {
    clientId: settings.clientId,
    discoveryDocs: settings.discoveryDocs,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.file'
    ]
  };
  const { isSignedIn, signIn, signOut, getAccessToken } = useGoogleAuth(authConfiguration);

  async function loadData(spreadsheetId: string, spreadsheetName: string) {
    const accessToken = getAccessToken();
    const collection = await loadCollection(accessToken, spreadsheetId, spreadsheetName);
    setCollection(collection);
  }

  return (
    <div className="App">
      <Header isLoggedIn={isSignedIn} handleLogin={signIn} handleLogout={signOut}></Header>
      <Container maxWidth="lg">
        {isSignedIn ? (
          <div>
            <Setup accessToken={getAccessToken()} handleLoadData={loadData}></Setup>
            {collection ? <CollectionTable collection={collection}></CollectionTable> : null}
          </div>
        ) : (
          <Login handleLogin={signIn}></Login>
        )}
      </Container>
    </div>
  );
};
