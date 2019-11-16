import './App.css';

import React, { useEffect, useState } from 'react';

import { Entry } from '../models/entry';
import settings from '../settings.json';
import { Entries } from './Entries';
import { Header } from './Header';
import { Login } from './Login';
import { Setup } from './Setup';

export const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

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

  function loadData(spreadsheetId: string, spreadsheetName: string) {
    const accessToken = gapi.client.getToken().access_token;
    loadSpreadsheetData(accessToken, spreadsheetId, spreadsheetName);
  }

  function loadSpreadsheetData(
    accessToken: string,
    spreadsheetId: string,
    spreadsheetName: string
  ) {
    gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: spreadsheetId,
        range: spreadsheetName,
        access_token: accessToken
      })
      .then(
        function(response) {
          if (response.result.values) {
            const [rowMetadata, ...rowData] = response.result.values as string[][];
            const entries = rowData.map((row, index) => toEntry(row, rowMetadata, index));
            setEntries(entries);
          }
        },
        function(response) {
          console.log(response);
        }
      );
  }

  function toEntry(rowData: string[], rowMetadata: string[], index: number): Entry {
    const entry: Entry = {
      id: index.toString()
    };

    rowData.forEach((value, index) => {
      const key = rowMetadata[index];
      entry[key] = value;
    });

    return entry;
  }

  return (
    <div className="App">
      <Header isLoggedIn={isSignedIn} handleLogin={signIn} handleLogout={signOut}></Header>
      {isSignedIn ? (
        <div>
          <Setup handleLoadData={loadData}></Setup>
          <Entries entries={entries}></Entries>
        </div>
      ) : (
        <Login handleLogin={signIn}></Login>
      )}
    </div>
  );
};
