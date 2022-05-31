import { ipcMain } from 'electron';
import { IDesensitizationConfig } from '@/backend/desensitization_config/DesensitizationConfigType';
import { IField } from '@/backend/db_meta/DBMetaType';
import { db } from '@/backend/DB';

const getFieldFullName = (field: IField) => (`${field.table.database.schema.name
}.${field.table.database.name
}.${field.table.name
}.${field.name}`);

export function desensitizationConfigHandler() {
  ipcMain.handle(
    '/desensitization/upsert',
    (event, newConfig: IDesensitizationConfig) => {
      let updateIndex;
      db.data?.desensitizationConfig.forEach((config, index) => {
        if (getFieldFullName(newConfig.field) === getFieldFullName(config.field)) {
          updateIndex = index;
        }
      });
      if (updateIndex !== undefined) {
        db.data?.desensitizationConfig.splice(updateIndex, 1, newConfig);
      } else {
        db.data?.desensitizationConfig.push(newConfig);
      }
      return db.write();
    },
  );
  ipcMain.handle(
    '/desensitization/getByFields',
    (event, fields: IField[]) => {
      const dConfigs = fields.map((field) => {
        let transformFormula = '';
        db.data?.desensitizationConfig.some((dConfig) => {
          if (getFieldFullName(dConfig.field) === getFieldFullName(field)) {
            transformFormula = dConfig.transformFormula;
            return true;
          }
          return false;
        });
        return {
          field,
          transformFormula,
        } as IDesensitizationConfig;
      });
      if (dConfigs) {
        return dConfigs;
      }
      return Promise.reject(new Error('不存在脱敏规则'));
    },
  );
}
