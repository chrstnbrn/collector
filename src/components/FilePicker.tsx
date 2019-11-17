import { Button } from '@material-ui/core';
import React from 'react';

import { DriveFile } from '../models/drive-file';

export const FilePicker = (props: FilePickerProps) => {
  function openFilePicker() {
    gapi.load('picker', { callback: createPicker });
    function createPicker() {
      const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS);
      const picker = new google.picker.PickerBuilder()
        .setOAuthToken(props.accessToken)
        .addView(view)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  }

  function pickerCallback(response: any) {
    if (response[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
      const document = response[google.picker.Response.DOCUMENTS][0];
      const file: DriveFile = {
        id: document[google.picker.Document.ID],
        name: document[google.picker.Document.NAME],
        url: document[google.picker.Document.URL],
        iconUrl: document[google.picker.Document.ICON_URL]
      };
      props.handleSelectFile(file);
    }
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => openFilePicker()}>
        Select File
      </Button>
    </div>
  );
};

interface FilePickerProps {
  accessToken: string;
  handleSelectFile: (file: DriveFile) => void;
}
