<template>
  <el-container>
    <el-aside>
      <el-button type="primary" @click="openDBConfigDialog">
        连接数据库
      </el-button>
      <el-dialog v-model="dbConfigDialogVisible" title="数据库配置">
        <el-form :model="dbConfig">
          <el-form-item label="服务器地址">
            <el-input v-model="dbConfig.host" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="dbConfig.port" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="dbConfig.user" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="dbConfig.password" />
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
  computed,
} from 'vue';

export default defineComponent({
  name: 'HomeView',
  setup(props, ctx) {
    const { dbMetaAPI } = window;
    // 数据库连接配置对话框
    const dbConfig = reactive({
      host: '127.0.0.1',
      port: 3306,
      maxSize: 10,
      password: 'root',
      user: 'root',
    });
    const dbConfigDialogVisible = ref(false);
    const openDBConfigDialog = () => {
      dbConfigDialogVisible.value = true;
    };
    const closeDBConfigDialog = () => {
      dbConfigDialogVisible.value = false;
    };
    const confirmDBConfig = () => {
      dbMetaAPI.openDB(toRaw(dbConfig));
      closeDBConfigDialog();
    };
    return {
      dbConfig,
      dbConfigDialogVisible,
      openDBConfigDialog,
      closeDBConfigDialog,
      confirmDBConfig,
    };
  },
  async mounted() {
    const { dbMetaAPI } = window;
    await dbMetaAPI.openDB({
      host: '127.0.0.1',
      port: 3306,
      maxSize: 10,
      password: 'root',
      user: 'root',
    });
    const schemas = await dbMetaAPI.getAllSchema();
    console.log(schemas);
    const databases = await dbMetaAPI.getAllDatabase(schemas[0]);
    console.log(databases);
    const tables = await dbMetaAPI.getAllTable({
      name: 'dynamic_table',
      schema: schemas[0],
    });
    console.log(tables);
    const fields = await dbMetaAPI.getAllField(tables[0]);
    console.log(fields);
  },
});
</script>
