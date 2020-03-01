import { Card, CardContent, createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { useConfiguration } from '../context/configuration-context';

const useStyles = makeStyles(theme =>
  createStyles({
    title: theme.typography.h6
  })
);

export function Collections() {
  const classes = useStyles();

  const { collectionConfigurations } = useConfiguration();

  return (
    <Grid container spacing={3}>
      {collectionConfigurations.map(collection => (
        <Grid key={collection.id} item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                <NavLink to={'/collection/' + collection.id} key={collection.id}>
                  {collection.sheetName}
                </NavLink>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
