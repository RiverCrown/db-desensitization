import { IDBMetaAPI } from '@/backend/controller/DBMetaController';

declare global {
  interface Window {
    dbMetaAPI: IDBMetaAPI
  }
}
