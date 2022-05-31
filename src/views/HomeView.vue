<template>
  <el-container>
    <el-aside>
      <el-button type="primary" @click="() => openDBConfigDialog('ADD')">
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
              <el-icon class="el-icon--left" @click="() => openDBConfigDialog('MODIFY', node.data)">
                <span :class="`iconfont icon-edit`"></span>
              </el-icon>
              <el-icon class="el-icon--left" @click="() => removeDBConfig(node.data)">
                <span :class="`iconfont icon-delete`"></span>
              </el-icon>
            </div>
            <div v-if="node.level !== 1">
              <el-tooltip placement="bottom-start">
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
          <el-form-item label="数据库类型">
            <el-select v-model="dbConfigInDialog.dbType">
              <el-option
                v-for="dbType in DB_TYPE_CONSTANTS"
                :key="dbType"
                :label="dbType"
                :value="dbType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址">
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
    <el-main>
      <el-table :data="dConfigsInTable">
        <el-table-column prop="field.name" label="名称"/>
        <el-table-column prop="field.type" label="类型"/>
        <el-table-column prop="field.desc" label="描述"/>
        <el-table-column>
          <template #header>
            脱敏变换公式
            <el-tooltip
              placement="top-start"
              content="变换公式中 x 代表字段原先的值"
            >
              <el-icon class="el-icon--right">
                <span :class="`iconfont icon-info-circle`"></span>
              </el-icon>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <el-input
              v-model="row.transformFormula"
              @blur="() => upsertDConfig(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-main>
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
import Node from 'element-plus/es/components/tree/src/model/node';
import { TreeData } from 'element-plus/es/components/tree/src/tree.type';
import {
  IPoolConfig, ISchema, IDatabase, ITable, IField,
} from '@/backend/db_meta/DBMetaType';
import { ElMessage, ElMessageBox } from 'element-plus';
import { IDesensitizationConfig } from '@/backend/desensitization_config/DesensitizationConfigType';

export default defineComponent({
  name: 'HomeView',
  setup(props, ctx) {
    const { dbMetaAPI, dbConfigAPI, desensitizationConfigAPI } = window;
    // 获取所有的数据库配置
    const dbConfigs = ref([] as Array<IDBConfig>);
    onMounted(async () => {
      dbConfigs.value = await dbConfigAPI.getAll();
    });
    // 数据库连接配置对话框
    const defaultDBConfig: IDBConfig = {
      name: '',
      desc: '',
      dbType: 'MYSQL' as DBType,
      host: '',
      port: 3306,
      user: '',
      password: '',
    };
    const dbConfigInDialog = ref(defaultDBConfig);
    const dbConfigDialogMode = ref('');
    const dbConfigDialogVisible = ref(false);
    const openDBConfigDialog = (mode: string, dbConfig: IDBConfig) => {
      dbConfigDialogMode.value = mode;
      switch (dbConfigDialogMode.value) {
        case 'ADD':
          dbConfigInDialog.value = defaultDBConfig;
          break;
        case 'MODIFY':
          dbConfigInDialog.value = dbConfig;
          break;
        default:
          break;
      }
      dbConfigDialogVisible.value = true;
    };
    const closeDBConfigDialog = () => {
      dbConfigDialogVisible.value = false;
    };
    const confirmDBConfig = async () => {
      switch (dbConfigDialogMode.value) {
        case 'ADD':
          await dbConfigAPI.save(toRaw(dbConfigInDialog.value));
          break;
        case 'MODIFY':
          await dbConfigAPI.modify(toRaw(dbConfigInDialog.value));
          break;
        default:
          break;
      }
      ElMessage.success('成功');
      dbConfigs.value = await dbConfigAPI.getAll();
      closeDBConfigDialog();
    };
    // 主界面
    const dConfigsInTable = ref([] as Array<IDesensitizationConfig>);
    // 数据库导航树
    const removeDBConfig = async (dbConfig: IDBConfig) => {
      try {
        await ElMessageBox.confirm(
          '确认删除？',
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          },
        );
        await dbConfigAPI.remove(toRaw(dbConfig));
        ElMessage.success('删除成功');
        dbConfigs.value = await dbConfigAPI.getAll();
      } catch (err) {
        ElMessage.info('已取消');
      }
    };
    const expandDBNode = async (node: Node, resolve: (data: TreeData) => void) => {
      switch (node.level) {
        // 数据库配置节点
        case 1:
          await dbMetaAPI.openDB(toRaw(node.data) as IPoolConfig);
          return resolve(await dbMetaAPI.getAllSchema());
        // schema 节点
        case 2:
          return resolve(await dbMetaAPI.getAllDatabase(toRaw(node.data) as ISchema));
        // database 节点
        case 3:
          return resolve(await dbMetaAPI.getAllTable(toRaw(node.data) as IDatabase));
        // table 节点
        case 4: {
          const fieldsInTable = await dbMetaAPI.getAllField(toRaw(node.data) as ITable);
          dConfigsInTable.value = await desensitizationConfigAPI.getByFields(fieldsInTable);
          return resolve(fieldsInTable);
        }
        default:
          return resolve([]);
      }
    };
    // 脱敏配置
    const upsertDConfig = (dConfig: IDesensitizationConfig) => {
      desensitizationConfigAPI.upsert(toRaw(dConfig));
    };
    return {
      DB_TYPE_CONSTANTS,
      dbConfigs,
      dbConfigInDialog,
      dbConfigDialogVisible,
      openDBConfigDialog,
      closeDBConfigDialog,
      confirmDBConfig,
      removeDBConfig,
      expandDBNode,
      dConfigsInTable,
      upsertDConfig,
    };
  },
});
</script>

<style>
.db_tree_node {
}

.db_tree_node > .el-tree-node__content {
  height: 48px;
}
</style>
