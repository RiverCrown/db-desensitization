<template>
  <div>
    <el-input>

    </el-input>
    <el-button type="primary">数据脱敏</el-button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  computed,
} from 'vue';

export default defineComponent({
  name: 'HomeView',
  // setup(props, ctx) {
  //   const a = 1;
  //   return
  // },
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
    const tables = await dbMetaAPI.getAllTable({ name: 'dynamic_table', schema: schemas[0] });
    console.log(tables);
    const fields = await dbMetaAPI.getAllField(tables[0]);
    console.log(fields);
  },
});
</script>
