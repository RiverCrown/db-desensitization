<template>
  <el-container>
    <el-aside>
      <el-button type="primary" @click="openDBConfigDialog">
        +
      </el-button>
      <el-tree
        lazy
        :load="expandDBNode"
        :data="dbConfigs"
        :expand-on-click-node="false"
        :props="{
          children: 'children',
          class: 'db_tree_node'
        }"
      >
        <template #default="{ node }">
          <div :style="{
            display: 'flex',
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'center',
          }">
            <div>{{ node.data.name }}</div>
            <div v-if="node.level === 1">
              <el-icon class="el-icon--left" @click="() => openDBConfigDialog(node.data)">
                <span :class="`iconfont icon-edit`"></span>
              </el-icon>
              <el-icon class="el-icon--left">
                <span :class="`iconfont icon-delete`"></span>
              </el-icon>
            </div>
            <div v-if="node.level !== 1">
              <el-tooltip placement="top-start">
                <template #content>
                  <pre>{{node.data}}</pre>
                </template>
                <el-icon class="el-icon--left">
                  <span :class="`iconfont icon-info-circle`"></span>
                </el-icon>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-tree>
      <el-dialog v-model="dbConfigDialogVisible" title="数据库配置">
        <el-form :model="dbConfigInDialog" label-width="100px">
          <el-form-item label="连接名">
            <el-input v-model="dbConfigInDialog.name" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="dbConfigInDialog.desc" />
          </el-form-item>
          <el-form-item label="别名">
            <el-select v-model="dbConfigInDialog.dbType">
              <el-option
                v-for="dbType in DB_TYPE_CONSTANTS"
                :key="dbType"
                :label="dbType"
                :value="dbType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务器地址">
            <el-input v-model="dbConfigInDialog.host" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="dbConfigInDialog.port" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="dbConfigInDialog.user" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="dbConfigInDialog.password" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="closeDBConfigDialog">取消</el-button>
          <el-button type="primary" @click="confirmDBConfig">确认</el-button>
        </template>
      </el-dialog>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  toRaw,
  onMounted,
  computed,
} from 'vue';
import { IDBConfig, DBType, DB_TYPE_CONSTANTS } from '@/backend/db_config/DBConfigType';
import '@/assets/iconfont/iconfont.css';

export default defineComponent({
  name: 'HomeView',
  setup(props, ctx) {
    const { dbMetaAPI, dbConfigAPI } = window;
    // 获取所有的数据库配置
    const dbConfigs = reactive([] as Array<IDBConfig>);
    onMounted(async () => {
      dbConfigs.push(...(await dbConfigAPI.getAll()));
    });
    // 数据库连接配置对话框
    const dbConfigInDialog = reactive({
      name: '',
      desc: '',
      dbType: 'MYSQL' as DBType,
      host: '',
      port: 3306,
      user: '',
      password: '',
    } as IDBConfig);
    const dbConfigDialogVisible = ref(false);
    const openDBConfigDialog = (dbConfig: IDBConfig) => {
      Object.assign(dbConfigInDialog, dbConfig);
      dbConfigDialogVisible.value = true;
    };
    const closeDBConfigDialog = () => {
      dbConfigDialogVisible.value = false;
    };
    const confirmDBConfig = () => {
      dbConfigAPI.save(toRaw(dbConfigInDialog));
      closeDBConfigDialog();
    };
    // 数据库导航树
    const expandDBNode = async (node: any, resolve: any) => {
      switch (node.level) {
        // 数据库配置节点
        case 1:
          await dbMetaAPI.openDB(toRaw(node.data));
          return resolve(await dbMetaAPI.getAllSchema());
        // schema 节点
        case 2:
          return resolve(await dbMetaAPI.getAllDatabase(toRaw(node.data)));
        // database 节点
        case 3:
          return resolve(await dbMetaAPI.getAllTable(toRaw(node.data)));
        // table 节点
        case 4:
          return resolve(await dbMetaAPI.getAllField(toRaw(node.data)));
        default:
          return resolve([]);
      }
    };
    return {
      DB_TYPE_CONSTANTS,
      dbConfigs,
      dbConfigInDialog,
      dbConfigDialogVisible,
      openDBConfigDialog,
      closeDBConfigDialog,
      confirmDBConfig,
      expandDBNode,
    };
  },
  // async mounted() {
  //   const { dbMetaAPI } = window;
  //   await dbMetaAPI.openDB({
  //     host: '127.0.0.1',
  //     port: 3306,
  //     maxSize: 10,
  //     password: 'root',
  //     user: 'root',
  //   });
  //   const schemas = await dbMetaAPI.getAllSchema();
  //   console.log(schemas);
  //   const databases = await dbMetaAPI.getAllDatabase(schemas[0]);
  //   console.log(databases);
  //   const tables = await dbMetaAPI.getAllTable({
  //     name: 'dynamic_table',
  //     schema: schemas[0],
  //   });
  //   console.log(tables);
  //   const fields = await dbMetaAPI.getAllField(tables[0]);
  //   console.log(fields);
  // },
});
</script>

<style>
.db_tree_node {
}

.db_tree_node > .el-tree-node__content {
  height: 48px;
}
</style>
