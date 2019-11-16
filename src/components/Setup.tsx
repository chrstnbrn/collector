import { Button, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    display: 'flex',
    maxWidth: 400
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5)
  }
}));

export const Setup = (props: SetupProps) => {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [spreadsheetName, setSpreadsheetName] = useState('');
  const classes = useStyles();

  return (
    <div>
      <TextField
        id="spreadsheet-id"
        className={classes.textField}
        label="Spreadsheet Id"
        margin="normal"
        variant="filled"
        value={spreadsheetId}
        onChange={event => setSpreadsheetId(event.target.value)}
      />
      <TextField
        id="spreadsheet-name"
        className={classes.textField}
        label="Spreadsheet Name"
        margin="normal"
        variant="filled"
        value={spreadsheetName}
        onChange={event => setSpreadsheetName(event.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => props.handleLoadData(spreadsheetId, spreadsheetName)}
      >
        Load Data
      </Button>
    </div>
  );
};

interface SetupProps {
  handleLoadData: (spreadsheetId: string, spreadsheetName: string) => void;
}
