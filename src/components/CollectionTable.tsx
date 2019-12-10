import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React from 'react';

import { Collection } from '../models/collection';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
});

export const CollectionTable = (props: CollectionTableProps) => {
  const classes = useStyles();

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {props.collection.keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.collection.entries.map(entry => (
          <TableRow key={entry.id}>
            {props.collection.keys.map(key => (
              <TableCell component="th" scope="row" key={key}>
                {entry[key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface CollectionTableProps {
  collection: Collection;
}
