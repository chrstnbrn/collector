import React from 'react';

import { Entry } from '../models/entry';

export const Entries = (props: EntriesProps) => {
  return (
    <div>
      {props.entries.map(entry => (
        <div key={entry.id}>{entry.Name}</div>
      ))}
    </div>
  );
};

interface EntriesProps {
  entries: Entry[];
}
