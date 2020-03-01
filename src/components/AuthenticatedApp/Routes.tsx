import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CollectionDetails } from '../CollectionDetails';
import { Setup } from '../Setup';
import { Collections } from '../Collections';

export const Routes = () => (
  <Switch>
    <Route path="/collection/:id">
      <CollectionDetails />
    </Route>
    <Route path="/create-collection">
      <Setup />
    </Route>
    <Route path="/">
      <Collections />
    </Route>
  </Switch>
);
