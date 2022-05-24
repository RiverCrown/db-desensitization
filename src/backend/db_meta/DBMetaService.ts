import { ipcMain } from 'electron';
import mysqlAPI from '@/backend/db_meta/MySQLAPI';

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
