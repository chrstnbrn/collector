import { Entry } from './entry';

export interface Collection {
  name: string;
  keys: string[];
  entries: Entry[];
}
