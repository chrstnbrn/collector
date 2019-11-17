import { Collection } from '../models/collection';
import { Entry } from '../models/entry';

export async function loadCollection(
  accessToken: string,
  spreadsheetId: string,
  spreadsheetName: string
): Promise<Collection> {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: spreadsheetName,
    access_token: accessToken
  });

  if (!response.result.values) {
    throw new Error('No values');
  }

  const nonEmptyRows = response.result.values.filter(row => row && row.length > 0);

  const [rowMetadata, ...rowData] = nonEmptyRows;
  const entries = rowData.map((row, index) => toEntry(row, rowMetadata, index));

  return {
    name: spreadsheetName,
    keys: rowMetadata,
    entries: entries
  };
}

function toEntry(rowData: string[], rowMetadata: string[], index: number): Entry {
  const entry: Entry = {
    id: index.toString()
  };

  rowData.forEach((value, index) => {
    const key = rowMetadata[index];
    entry[key] = value;
  });

  return entry;
}
