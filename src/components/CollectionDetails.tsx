import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../context/auth-context';
import { useConfiguration } from '../context/configuration-context';
import { Collection } from '../models/collection';
import { loadCollection } from '../spreadsheet/load-collection';
import { CollectionTable } from './CollectionTable';

export function CollectionDetails() {
  const { id } = useParams();
  const { collectionConfigurations } = useConfiguration();
  const [collection, setCollection] = useState<Collection | null>(null);
  const { getAccessToken } = useAuth();

  const config = collectionConfigurations.find(c => c.id === id);

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
  }, [config, getAccessToken]);

  return <CollectionTable collection={collection} isLoading={collection == null}></CollectionTable>;
}
