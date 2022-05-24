export type DBType = 'MYSQL' | 'POSTGRESQL';
export const DB_TYPE_CONSTANTS = ['MYSQL', 'POSTGRESQL'];

export interface IDBConfig {
  name: string;
  desc: string;
  dbType: DBType;
  host: string;
  port: number;
  user: string;
  password: string;
}
