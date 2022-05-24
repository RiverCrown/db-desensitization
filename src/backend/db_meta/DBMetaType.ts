export type DataType = 'STRING' | 'INT' | 'DECIMAL' | 'DATETIME'

export interface IPoolConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  maxSize: number;
}

export interface ISchema {
  name: string;
  desc: string;
}

export interface IDatabase {
  schema: ISchema;
  name: string;
}

export interface ITable {
  schema: ISchema;
  database: IDatabase;
  name: string;
  desc: string;
}

export interface IField {
  table: ITable;
  name: string;
  type: DataType,
  desc: string,
}

export interface IDBMeta {
  initPool: (poolConfig: IPoolConfig) => Promise<void>;
  getAllSchema: () => Promise<Array<ISchema>>;
  getAllDatabase: (schema: ISchema) => Promise<Array<IDatabase>>;
  getAllTable: (database: IDatabase) => Promise<Array<ITable>>;
  getAllField: (table: ITable) => Promise<Array<IField>>;
}
