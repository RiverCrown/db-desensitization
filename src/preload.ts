import { contextBridge } from 'electron';
import { dbMetaInvoker } from '@/backend/db_meta/DBMetaController';
import { dbConfigInvoker } from '@/backend/db_config/DBConfigController';

contextBridge.exposeInMainWorld('dbMetaAPI', dbMetaInvoker);
contextBridge.exposeInMainWorld('dbConfigAPI', dbConfigInvoker);
