import { Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

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
  const [collection, setCollection] = useState<Collection | null>(null);

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

    const accessToken = getAccessToken();
    const collection = await loadCollection(accessToken, spreadsheetId, spreadsheetName);
    setCollection(collection);
  }

  return (
    <div className="App">
      <Header isLoggedIn={true} handleLogin={signIn} handleLogout={signOut}></Header>
      <Container maxWidth="lg">
        <Setup accessToken={getAccessToken()} handleSetupCompleted={handleSetupCompleted}></Setup>
        {collection ? <CollectionTable collection={collection}></CollectionTable> : null}
      </Container>
    </div>
  );
}
