import { createApp } from 'vue';
import App from './App.vue';

// 创建 Vue 应用
const app = createApp(App);

// 开发环境启用 Vue Devtools
if (process.env.NODE_ENV !== 'production') {
  console.log('[Dev] Vue 应用已启动');
}

app.mount('#app');
