import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './styles/main.scss';

// 创建 Vue 应用
const app = createApp(App);

// 使用 Pinia 状态管理
app.use(createPinia());

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app');

// 开发环境日志
if (process.env.NODE_ENV !== 'production') {
  console.log('[Dev] Vue 应用已启动');
}
