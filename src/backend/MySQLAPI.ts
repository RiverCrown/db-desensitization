import mysql, { Pool, RowDataPacket } from 'mysql2';
import {
  IDBMeta, IField, ISchema, IDatabase, ITable, DBType, IPoolConfig,
} from '@/backend/DBInterface';

let mysqlPool: Pool;

const mysqlAPI: IDBMeta = {
  initPool(poolConfig: IPoolConfig): Promise<void> {
    return new Promise((resolve) => {
      // TODO 深入了解 nodejs 运作方式以保证这里不需要对并发做控制
      // 重复初始化的时候，要把之前的连接池释放
      mysqlPool?.end();
      mysqlPool = mysql.createPool({
        host: poolConfig.host,
        port: poolConfig.port,
        user: poolConfig.user,
        password: poolConfig.password,
        connectionLimit: poolConfig.maxSize,
      });
      resolve();
    });
  },
  getAllSchema(): Promise<Array<ISchema>> {
    return new Promise((resolve) => {
      resolve([
        {
          name: 'default',
          desc: 'default',
        },
      ]);
    });
  },
  getAllDatabase(schema: ISchema): Promise<Array<IDatabase>> {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        'show databases',
        (error, databases: RowDataPacket[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(databases.map((row) => ({
              schema,
              name: row?.Database,
            })));
          }
        },
      );
    });
  },
  getAllTable(database: IDatabase): Promise<Array<ITable>> {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        `select TABLE_NAME, TABLE_COMMENT from information_schema.TABLES where TABLE_SCHEMA='${database.name}'`,
        (err, tables: RowDataPacket[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(tables.map((table) => ({
              schema: database.schema,
              database,
              name: table?.TABLE_NAME,
              desc: table?.TABLE_COMMENT,
            })));
          }
        },
      );
    });
  },
  getAllField(table: ITable): Promise<Array<IField>> {
    return new Promise((resolve, reject) => {
      mysqlPool.query(
        `select COLUMN_NAME, COLUMN_TYPE, COLUMN_COMMENT from information_schema.columns
                where TABLE_SCHEMA='${table.database.name}' and TABLE_NAME='${table.name}'`,
        (err, fields:RowDataPacket[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(fields.map((field) => ({
              schema: table.schema,
              database: table.database,
              table,
              name: field.COLUMN_NAME,
              type: field.COLUMN_TYPE,
              desc: field.COLUMN_COMMENT,
            })));
          }
        },
      );
    });
  },
};

export default mysqlAPI;
