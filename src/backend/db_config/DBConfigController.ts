import { ipcRenderer } from 'electron';
import { IDBConfig } from '@/backend/db_config/DBConfigType';

export interface IDBConfigAPI {
  getAll: () => Promise<Array<IDBConfig>>;
  save: (dbConfig: IDBConfig) => Promise<void>;
  modify: (dbConfig: IDBConfig) => Promise<void>;
  remove: (dbConfig: IDBConfig) => Promise<void>;
}

export const dbConfigInvoker = {
  getAll: () => ipcRenderer.invoke('getAll'),
  save: (dbConfig: IDBConfig) => ipcRenderer.invoke('save', dbConfig),
  modify: (dbConfig: IDBConfig) => ipcRenderer.invoke('modify', dbConfig),
  remove: (dbConfig: IDBConfig) => ipcRenderer.invoke('remove', dbConfig),
};
