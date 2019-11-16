import { Button } from '@material-ui/core';
import React from 'react';

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

  function pickerCallback({ action, docs }: { action: string; docs: { id: string }[] }) {
    if (action === 'picked') {
      const id = docs[0].id;
      props.handleSelectFile(id);
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
  handleSelectFile: (id: string) => void;
}
