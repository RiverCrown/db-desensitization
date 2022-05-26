import { createApp } from 'vue';
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.config.errorHandler = (err) => {
  ElMessage.error({
    message: `${err}`,
    showClose: true,
  });
};
app.use(router).use(ElementPlus).mount('#app');
