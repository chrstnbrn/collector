import { CollectorConfiguration } from './../models/collector-configuration';
import settings from '../settings.json';

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

export async function createConfiguration(): Promise<string> {
  const client = await getDriveClient();
  const fileMetadata: gapi.client.drive.File = {
    name: settings.configFileName,
    parents: ['appDataFolder']
  };
  const response = await client.files.create({
    resource: fileMetadata,
    fields: 'id'
  });
  return response.result.id as string;
}

export function updateConfiguration(fileId: string, configuration: CollectorConfiguration) {
  return gapi.client.request({
    path: `/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: {
      uploadType: 'media'
    },
    body: JSON.stringify(configuration)
  });
}

async function getDriveClient(): Promise<typeof gapi.client.drive> {
  if (!gapi.client.drive) {
    await gapi.client.load('drive', 'v3');
  }
  return gapi.client.drive;
}
