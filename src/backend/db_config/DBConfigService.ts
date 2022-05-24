import { ipcMain } from 'electron';
import { writeFile, readFile } from 'fs/promises';

const DB_CONFIG_FILE_PATH = './db_config.json';

export function dbConfigHandler() {
  ipcMain.handle(
    'getAll',
    async () => {
      const dbConfigBuffer = await readFile(DB_CONFIG_FILE_PATH);
      return JSON.parse(dbConfigBuffer.toString());
    },
  );

  ipcMain.handle(
    'save',
    async (event, dbConfig) => {
      let dbConfigStr;
      try {
        dbConfigStr = (await readFile(DB_CONFIG_FILE_PATH)).toString();
      } catch (err) {
        console.log(err);
        dbConfigStr = '[]';
      }
      const dbConfigs = JSON.parse(dbConfigStr);
      dbConfigs.push(dbConfig);
      await writeFile(DB_CONFIG_FILE_PATH, JSON.stringify(dbConfigs));
    },
  );
}
