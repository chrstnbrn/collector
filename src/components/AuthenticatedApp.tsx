import { Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, useParams } from 'react-router-dom';

import { createConfiguration } from '../configuration/create-configuration';
import { getConfiguration } from '../configuration/get-configuration';
import { updateConfiguration } from '../configuration/update-configuration';
import { useAuth } from '../context/auth-context';
import { Collection } from '../models/collection';
import { CollectionConfiguration } from '../models/collection-configuration';
import { CollectorConfiguration } from '../models/collector-configuration';
import { loadCollection } from '../spreadsheet/load-collection';
import { CollectionTable } from './CollectionTable';
import { Header } from './Header';
import { Setup } from './Setup';

export function AuthenticatedApp() {
  const { signIn, signOut, getAccessToken } = useAuth();
  const [configuration, setConfiguration] = useState<CollectorConfiguration | null>(null);

  useEffect(() => {
    async function getConfig(): Promise<CollectorConfiguration> {
      let config = await getConfiguration();

      if (config) {
        return config;
      }

      const configId = await createConfiguration();
      return { fileId: configId, collections: [] };
    }

    async function setConfig() {
      const config = await getConfig();
      setConfiguration(config);
    }

    setConfig();
  }, []);

  async function handleSetupCompleted(spreadsheetId: string, spreadsheetName: string) {
    if (!configuration) {
      return;
    }

    const newCollection: CollectionConfiguration = {
      id: spreadsheetId,
      sheetName: spreadsheetName
    };
    const updatedConfiguration: CollectorConfiguration = {
      ...configuration,
      collections: [...configuration.collections, newCollection]
    };
    await updateConfiguration(updatedConfiguration.fileId, updatedConfiguration);
    setConfiguration(updatedConfiguration);
  }

  function CollectionDetails() {
    const { id } = useParams();
    const [collection, setCollection] = useState<Collection | null>(null);

    const config = configuration && configuration.collections.find(c => c.id === id);

    useEffect(() => {
      async function load() {
        if (!config) {
          return;
        }

        const accessToken = getAccessToken();
        const loadedCollection = await loadCollection(accessToken, config.id, config.sheetName);
        setCollection(loadedCollection);
      }
      load();
    }, [config]);

    return collection ? <CollectionTable collection={collection}></CollectionTable> : null;
  }

  function Collections({ collections }: { collections: CollectionConfiguration[] }) {
    return (
      <>
        {collections.map(collection => (
          <Link to={'/collection/' + collection.id} key={collection.id}>
            {collection.sheetName}
          </Link>
        ))}
      </>
    );
  }

  return (
    <Router>
      <Header isLoggedIn={true} handleLogin={signIn} handleLogout={signOut}></Header>
      <Container maxWidth="lg">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create-collection">Create Collection</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/collection/:id">
            <CollectionDetails />
          </Route>
          <Route path="/create-collection">
            <Setup accessToken={getAccessToken()} handleSetupCompleted={handleSetupCompleted} />
          </Route>
          <Route path="/">
            <Collections collections={configuration ? configuration.collections : []} />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}
