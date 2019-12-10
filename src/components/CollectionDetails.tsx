import { Card, CardContent, createStyles, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../context/auth-context';
import { Collection } from '../models/collection';
import { CollectorConfiguration } from '../models/collector-configuration';
import { loadCollection } from '../spreadsheet/load-collection';
import { CollectionTable } from './CollectionTable';

const useStyles = makeStyles(theme =>
  createStyles({
    title: theme.typography.h4
  })
);

export function CollectionDetails(props: CollectionDetailsProps) {
  const { id } = useParams();
  const classes = useStyles();
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

  return (
    <Card>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {config ? config.sheetName : null}
        </Typography>
        {collection ? <CollectionTable collection={collection}></CollectionTable> : null}
      </CardContent>
    </Card>
  );
}

interface CollectionDetailsProps {
  configuration: CollectorConfiguration | null;
}
