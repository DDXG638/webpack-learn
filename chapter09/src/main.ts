import { createApp } from 'vue';
import App from './App.vue';
import { formatSize, formatTime, generateId } from './utils/format';

console.log(`应用名称: ${__APP_NAME__}`);
console.log(`版本号: ${__APP_VERSION__}`);

// 测试工具函数
const testSize = formatSize(1024 * 1024);
const testTime = formatTime(1500);
const testId = generateId();

console.log(`格式化大小: ${testSize}`);
console.log(`格式化时间: ${testTime}`);
console.log(`生成ID: ${testId}`);

const app = createApp(App);
app.mount('#app');
