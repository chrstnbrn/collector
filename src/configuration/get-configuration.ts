import settings from '../settings.json';
import { CollectorConfiguration } from './../models/collector-configuration';
import { getDriveClient } from './get-drive-client';

export async function getConfiguration(): Promise<CollectorConfiguration | null> {
  const client = await getDriveClient();
  const response = await client.files.list({
    spaces: 'appDataFolder',
    fields: 'nextPageToken, files(id, name)',
    pageSize: 100
  });

  if (!response.result.files) {
    throw new Error('Error loading files');
  }

  const configFile = response.result.files.find(file => file.name === settings.configFileName);

  if (!configFile || !configFile.id) {
    return null;
  }

  const res = await client.files.get({ fileId: configFile.id, alt: 'media' });
  return res.result as CollectorConfiguration | null;
}
