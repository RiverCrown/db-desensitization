import { contextBridge } from 'electron';
import { dbMetaInvoker } from '@/backend/controller/DBMetaController';

contextBridge.exposeInMainWorld('dbMetaAPI', dbMetaInvoker);
