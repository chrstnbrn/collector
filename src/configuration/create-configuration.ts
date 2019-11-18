import settings from '../settings.json';
import { getDriveClient } from './get-drive-client';

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
