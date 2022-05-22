import { ipcMain, ipcRenderer } from 'electron';
import mysqlAPI from '@/backend/MySQLAPI';
import {
  IDatabase, IField, IPoolConfig, ISchema, ITable,
} from '@/backend/DBInterface';

export interface IDBMetaAPI {
  openDB: (poolConfig: IPoolConfig) => Promise<void>;
  getAllSchema: () => Promise<Array<ISchema>>;
  getAllDatabase: (schema: ISchema) => Promise<Array<IDatabase>>;
  getAllTable: (database: IDatabase) => Promise<Array<ITable>>;
  getAllField: (table: ITable) => Promise<Array<IField>>;
}

export function dbMetaHandler() {
  ipcMain.handle(
    'openDB',
    (event, poolConfig) => mysqlAPI.initPool(poolConfig),
  );

  ipcMain.handle(
    'getAllSchema',
    () => mysqlAPI.getAllSchema(),
  );

  ipcMain.handle(
    'getAllDatabase',
    (event, schema) => mysqlAPI.getAllDatabase(schema),
  );

  ipcMain.handle(
    'getAllTable',
    (event, database) => mysqlAPI.getAllTable(database),
  );

  ipcMain.handle(
    'getAllField',
    (event, table) => mysqlAPI.getAllField(table),
  );
}

export const dbMetaInvoker = {
  // ipcRenderer.invoke 调用的结果如果不是 Promise，则会自动包上 Promise
  openDB: (poolConfig: IPoolConfig) => ipcRenderer.invoke('openDB', poolConfig),
  getAllSchema: () => ipcRenderer.invoke('getAllSchema'),
  getAllDatabase: (schema: ISchema) => ipcRenderer.invoke('getAllDatabase', schema),
  getAllTable: (database: IDatabase) => ipcRenderer.invoke('getAllTable', database),
  getAllField: (table: ITable) => ipcRenderer.invoke('getAllField', table),
};
