import { CollectorConfiguration } from '../models/collector-configuration';

export function updateConfiguration(fileId: string, configuration: CollectorConfiguration) {
  return gapi.client.request({
    path: '/upload/drive/v3/files/' + fileId,
    method: 'PATCH',
    params: {
      uploadType: 'media'
    },
    body: JSON.stringify(configuration)
  });
}
