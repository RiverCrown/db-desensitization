import { IDBMetaAPI } from '@/backend/db_meta/DBMetaController';
import { IDBConfigAPI } from '@/backend/db_config/DBConfigController';
import {
  IDesensitizationConfigAPI,
} from '@/backend/desensitization_config/DesensitizationConfigController';

declare global {
  interface Window {
    dbMetaAPI: IDBMetaAPI;
    dbConfigAPI: IDBConfigAPI;
    desensitizationConfigAPI: IDesensitizationConfigAPI;
  }
}
