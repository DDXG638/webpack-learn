import { createApp } from 'vue';
import HostApp from './HostApp.vue';

// 创建应用并挂载
const app = createApp(HostApp);
app.mount('#app');

console.log('[Host] 应用已启动');
console.log('[Host] 正在加载远程模块...');
