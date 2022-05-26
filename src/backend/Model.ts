import { IDBMeta } from '@/backend/db_meta/DBMetaType';
import { IDBConfig } from '@/backend/db_config/DBConfigType';

export interface Model {
  dbMeta: IDBMeta[];
  dbConfig: IDBConfig[];
  desensitizationConfig: string[];
}
