import { IDBMeta } from '@/backend/db_meta/DBMetaType';
import { IDBConfig } from '@/backend/db_config/DBConfigType';
import { IDesensitizationConfig } from '@/backend/desensitization_config/DesensitizationConfigType';

export interface Model {
  dbMeta: IDBMeta[];
  dbConfig: IDBConfig[];
  desensitizationConfig: IDesensitizationConfig[];
}
