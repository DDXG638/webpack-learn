// src/main.ts - 应用入口
import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.css';

const app = createApp(App);
app.mount('#app');

console.log('应用初始化完成');
console.log('应用名称:', __APP_NAME__);
console.log('应用版本:', __APP_VERSION__);
console.log('构建时间:', __BUILD_TIME__);
console.log('环境变量 NODE_ENV:', process.env.NODE_ENV);
console.log('环境变量 DEBUG:', process.env.DEBUG);
console.log('功能开关:', __FEATURE_FLAGS__);
