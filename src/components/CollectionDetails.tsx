import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../context/auth-context';
import { Collection } from '../models/collection';
import { CollectorConfiguration } from '../models/collector-configuration';
import { loadCollection } from '../spreadsheet/load-collection';
import { CollectionTable } from './CollectionTable';

interface CollectionDetailsProps {
  configuration: CollectorConfiguration | null;
}

export function CollectionDetails(props: CollectionDetailsProps) {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const { getAccessToken } = useAuth();

  const config = props.configuration && props.configuration.collections.find(c => c.id === id);

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

  return collection ? <CollectionTable collection={collection}></CollectionTable> : null;
}
