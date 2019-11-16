import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import { FilePicker } from './FilePicker';

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
  const [availableSheetNames, setAvailableSheetNames] = useState<string[]>([]);
  const classes = useStyles();

  async function handleFileSelected(id: string) {
    setSpreadsheetId(id);
    loadSpreadsheetMetadata(id);
  }

  async function loadSpreadsheetMetadata(spreadsheetId: string) {
    const sheetNames = await getSheetNames(spreadsheetId);
    setAvailableSheetNames(sheetNames);
    setSpreadsheetName(sheetNames[0]);
  }

  async function getSheetNames(spreadsheetId: string) {
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        access_token: props.accessToken,
        spreadsheetId: spreadsheetId
      });
      if (response.result.sheets) {
        return response.result.sheets
          .map(sheet => (sheet.properties ? sheet.properties.title : null))
          .filter(title => !!title) as string[];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  return (
    <div>
      <h2>Create Collection</h2>
      <FilePicker
        accessToken={props.accessToken}
        handleSelectFile={handleFileSelected}
      ></FilePicker>
      <TextField
        id="spreadsheet-id"
        className={classes.textField}
        label="Spreadsheet Id"
        margin="normal"
        variant="filled"
        value={spreadsheetId}
        onChange={event => setSpreadsheetId(event.target.value)}
      />
      <FormControl className={classes.textField}>
        <InputLabel id="demo-simple-select-label">Sheet Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={spreadsheetName}
          disabled={availableSheetNames.length === 0}
          onChange={event => setSpreadsheetName(event.target.value as string)}
        >
          {availableSheetNames.map(sheetName => (
            <MenuItem key={sheetName} value={sheetName}>
              {sheetName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
  accessToken: string;
  handleLoadData: (spreadsheetId: string, spreadsheetName: string) => void;
}
