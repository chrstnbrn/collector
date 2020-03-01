import React, { useEffect, useState } from 'react';

import { createConfiguration } from '../configuration/create-configuration';
import { updateConfiguration } from '../configuration/update-configuration';
import { getConfiguration } from '../configuration/get-configuration';
import { CollectorConfiguration } from '../models/collector-configuration';
import { CollectionConfiguration } from '../models/collection-configuration';

interface ConfigurationContextValue {
  collectionConfigurations: CollectionConfiguration[];
  addCollection: (collectionConfiguration: CollectionConfiguration) => void;
}

const ConfigurationContext = React.createContext<ConfigurationContextValue | undefined>(undefined);

export function ConfigurationProvider(props: any) {
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
      let config = await getConfig();
      setConfiguration(config);
    }

    setConfig();
  }, []);

  async function addCollection(collectionConfiguration: CollectionConfiguration) {
    if (!configuration) {
      return;
    }

    const updatedConfiguration: CollectorConfiguration = {
      ...configuration,
      collections: [...configuration.collections, collectionConfiguration]
    };
    await updateConfiguration(updatedConfiguration.fileId, updatedConfiguration);
    setConfiguration(updatedConfiguration);
  }

  return (
    <ConfigurationContext.Provider
      value={{
        collectionConfigurations: configuration ? configuration.collections : [],
        addCollection
      }}
      {...props}
    />
  );
}

export function useConfiguration() {
  const context = React.useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error(`useConfiguration must be used within a ConfigurationProvider`);
  }
  return context;
}
