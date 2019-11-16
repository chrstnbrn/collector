import React, { useState } from 'react';

export const Setup = (props: SetupProps) => {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [spreadsheetName, setSpreadsheetName] = useState('');

  return (
    <div>
      <label>
        Spreadsheet Id:
        <input
          type="text"
          value={spreadsheetId}
          onChange={event => setSpreadsheetId(event.target.value)}
        />
      </label>
      <label>
        Spreadsheet Name:
        <input
          type="text"
          value={spreadsheetName}
          onChange={event => setSpreadsheetName(event.target.value)}
        />
      </label>
      <button type="button" onClick={() => props.handleLoadData(spreadsheetId, spreadsheetName)}>
        Load Data
      </button>
    </div>
  );
};

interface SetupProps {
  handleLoadData: (spreadsheetId: string, spreadsheetName: string) => void;
}
