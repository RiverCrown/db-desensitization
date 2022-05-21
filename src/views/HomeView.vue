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
  mounted() {
    console.log(window.myAPI);
  },
});
</script>
