import { contextBridge } from 'electron';
import { dbMetaInvoker } from '@/backend/db_meta/DBMetaController';
import { dbConfigInvoker } from '@/backend/db_config/DBConfigController';
import { desensitizationConfigInvoker } from '@/backend/desensitization_config/DesensitizationConfigController';

contextBridge.exposeInMainWorld('dbMetaAPI', dbMetaInvoker);
contextBridge.exposeInMainWorld('dbConfigAPI', dbConfigInvoker);
contextBridge.exposeInMainWorld('desensitizationConfigAPI', desensitizationConfigInvoker);
