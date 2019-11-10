import './App.css';

import React, { useEffect, useState } from 'react';

import settings from './settings.json';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [spreadsheetName, setSpreadsheetName] = useState('');

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

  function loadData() {
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
      <button style={{ display: isSignedIn ? 'none' : 'block' }} onClick={signIn}>
        Authorize
      </button>
      <button style={{ display: isSignedIn ? 'block' : 'none' }} onClick={signOut}>
        Sign Out
      </button>
      {isSignedIn ? (
        <div>
          <label>
            Spreadsheet Id:
            <input
              type="text"
              value={spreadsheetId}
              onChange={event => setSpreadsheetId(event.target.value)}
            />
          </label>
          <label>
            Spreadsheet Name:
            <input
              type="text"
              value={spreadsheetName}
              onChange={event => setSpreadsheetName(event.target.value)}
            />
          </label>
          <button type="button" onClick={loadData}>
            Load Data
          </button>
          {entries.map(entry => (
            <div key={entry.id}>{entry.Name}</div>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;

interface Entry {
  id: string;
  [key: string]: string;
}
