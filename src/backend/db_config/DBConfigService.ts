import { ipcMain } from 'electron';
import { db } from '@/backend/DB';
import { IDBConfig } from '@/backend/db_config/DBConfigType';

export function dbConfigHandler() {
  ipcMain.handle(
    'getAll',
    async () => db.data?.dbConfig,
  );

  ipcMain.handle(
    'save',
    async (event, newDBConfig: IDBConfig) => {
      const isDuplicated = db.data?.dbConfig.some((dbConfig) => dbConfig.name === newDBConfig.name);
      if (isDuplicated) {
        return Promise.reject(new Error('duplicate db config'));
      }
      db.data?.dbConfig.push(newDBConfig);
      return db.write();
    },
  );

  ipcMain.handle(
    'modify',
    async (event, newDBConfig: IDBConfig) => {
      let replaceIndex;
      db.data?.dbConfig.forEach((dbConfig, index) => {
        if (dbConfig.name === newDBConfig.name) {
          replaceIndex = index;
        }
      });
      if (replaceIndex !== undefined) {
        db.data?.dbConfig.splice(replaceIndex, 1, newDBConfig);
        return db.write();
      }
      return Promise.reject(new Error('can not find same db config to update'));
    },
  );

  ipcMain.handle(
    'remove',
    async (event, removeDBConfig: IDBConfig) => {
      let removeIndex;
      db.data?.dbConfig.forEach((dbConfig, index) => {
        if (dbConfig.name === removeDBConfig.name) {
          removeIndex = index;
        }
      });
      if (removeIndex !== undefined) {
        db.data?.dbConfig.splice(removeIndex, 1);
        return db.write();
      }
      return Promise.reject(new Error('can not delete db config with same name'));
    },
  );
}
