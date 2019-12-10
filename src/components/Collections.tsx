import { Card, CardContent, createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { CollectionConfiguration } from '../models/collection-configuration';

const useStyles = makeStyles(theme =>
  createStyles({
    title: theme.typography.h6
  })
);

export function Collections(props: CollectionsProps) {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={3}>
        {props.collections.map(collection => (
          <Grid item xs={12} md={3}>
            <Card key={collection.id}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  <NavLink to={'/collection/' + collection.id} key={collection.id}>
                    {collection.sheetName}
                  </NavLink>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

interface CollectionsProps {
  collections: CollectionConfiguration[];
}
