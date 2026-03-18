import { createApp } from 'vue';
import RemoteApp from './RemoteApp.vue';

// 创建应用并挂载
const app = createApp(RemoteApp);
app.mount('#app');

console.log('[Remote] 应用已启动');
console.log('[Remote] 以下模块已暴露:');
console.log('  - ./Button');
console.log('  - ./Header');
console.log('  - ./Counter');
console.log('  - ./utils');
