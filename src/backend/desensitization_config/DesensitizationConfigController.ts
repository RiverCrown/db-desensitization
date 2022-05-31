import { ipcRenderer } from 'electron';
import { IDesensitizationConfig } from '@/backend/desensitization_config/DesensitizationConfigType';
import { IField } from '@/backend/db_meta/DBMetaType';

export interface IDesensitizationConfigAPI {
  upsert: (config: IDesensitizationConfig) => Promise<void>;
  getByFields: (fields: IField[]) => Promise<Array<IDesensitizationConfig>>;
}

export const desensitizationConfigInvoker = {
  upsert: (config: IDesensitizationConfig) => ipcRenderer.invoke('/desensitization/upsert', config),
  getByFields: (fields: IField[]) => ipcRenderer.invoke('/desensitization/getByFields', fields),
};
