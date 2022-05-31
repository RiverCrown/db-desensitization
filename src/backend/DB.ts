import { JSONFile, Low } from 'lowdb';
import { Model } from '@/backend/Model';
import { IDBConfig } from '@/backend/db_config/DBConfigType';
import { IDBMeta } from '@/backend/db_meta/DBMetaType';
import { IDesensitizationConfig } from '@/backend/desensitization_config/DesensitizationConfigType';

const adapter = new JSONFile<Model>('db.json');
const db = new Low(adapter);
db.read().then(() => {
  // 初始化数据
  db.data = db.data || {
    dbConfig: [] as IDBConfig[],
    dbMeta: [] as IDBMeta[],
    desensitizationConfig: [] as IDesensitizationConfig[],
  } as Model;
});

export { db };
