import { IDBMetaAPI } from '@/backend/db_meta/DBMetaController';
import { IDBConfigAPI } from '@/backend/db_config/DBConfigController';

declare global {
  interface Window {
    dbMetaAPI: IDBMetaAPI;
    dbConfigAPI: IDBConfigAPI;
  }
}
