export async function getDriveClient(): Promise<typeof gapi.client.drive> {
  if (!gapi.client.drive) {
    await gapi.client.load('drive', 'v3');
  }
  return gapi.client.drive;
}
