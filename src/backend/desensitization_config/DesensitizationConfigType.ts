import { IField } from '@/backend/db_meta/DBMetaType';

export interface IDesensitizationConfig {
  field: IField;
  transformFormula: string;
}
