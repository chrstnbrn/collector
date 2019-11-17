import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import React, { useState } from 'react';

import { DriveFile } from '../models/drive-file';
import { FilePicker } from './FilePicker';

const useStyles = makeStyles(theme => ({
  file: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  fileIcon: {
    marginRight: theme.spacing(1)
  },
  textField: {
    display: 'flex',
    maxWidth: 400
  },
  button: {
    marginTop: theme.spacing(3)
  }
}));

function getSteps() {
  return ['Select spreadsheet', 'Select sheet', 'Configure table'];
}

export const Setup = (props: SetupProps) => {
  const classes = useStyles();

  const [file, setFile] = useState<DriveFile | null>(null);
  const [spreadsheetName, setSpreadsheetName] = useState('');
  const [availableSheetNames, setAvailableSheetNames] = useState<string[]>([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  async function handleSelectFile(file: DriveFile) {
    setFile(file);
    loadSpreadsheetMetadata(file.id);
    handleNext();
  }

  function handleSelectSpreadsheet(name: string) {
    setSpreadsheetName(name);
    handleNext();
  }

  async function loadSpreadsheetMetadata(spreadsheetId: string) {
    const sheetNames = await getSheetNames(spreadsheetId);
    setAvailableSheetNames(sheetNames);
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

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <SelectSpreadsheet></SelectSpreadsheet>;
      case 1:
        return <SelectSheet></SelectSheet>;
      case 2:
        return <ConfigureTable></ConfigureTable>;
      default:
        return null;
    }
  }

  function SelectSpreadsheet() {
    return (
      <>
        <FilePicker
          accessToken={props.accessToken}
          handleSelectFile={handleSelectFile}
        ></FilePicker>
        {file ? (
          <div className={classes.file}>
            <img src={file.iconUrl} alt="" className={classes.fileIcon}></img>
            {file.name}
          </div>
        ) : null}
      </>
    );
  }

  function SelectSheet() {
    return (
      <FormControl className={classes.textField}>
        <InputLabel id="select-sheet-label">Sheet Name</InputLabel>
        <Select
          labelId="select-sheet-label"
          id="select-sheet"
          value={spreadsheetName}
          disabled={availableSheetNames.length === 0}
          onChange={event => handleSelectSpreadsheet(event.target.value as string)}
        >
          {availableSheetNames.map(sheetName => (
            <MenuItem key={sheetName} value={sheetName}>
              {sheetName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  function ConfigureTable() {
    return (
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => props.handleLoadData(file ? file.id : '', spreadsheetName)}
      >
        Load Data
      </Button>
    );
  }

  return (
    <>
      <h2>Create Collection</h2>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(label => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
              <StepContent>{getStepContent(activeStep)}</StepContent>
            </Step>
          );
        })}
      </Stepper>
    </>
  );
};

interface SetupProps {
  accessToken: string;
  handleLoadData: (spreadsheetId: string, spreadsheetName: string) => void;
}
