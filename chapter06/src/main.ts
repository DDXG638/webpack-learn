import { createApp } from 'vue';
import App from './App.vue';
import router from './utils/router';

// 创建 Vue 应用实例
const app = createApp(App);

// 使用路由
app.use(router);

// 挂载到 DOM
app.mount('#app');

// 打印 Webpack 代码分割信息
console.log('%c🚀 Webpack5 代码分割 Demo', 'font-size: 20px; font-weight: bold; color: #ff6b6b;');
console.log('%c本 Demo 演示了以下代码分割技术:', 'font-size: 14px; color: #666;');
console.log('%c1. splitChunks: 将 node_modules 和公共代码分割到独立 chunk', 'color: #666;');
console.log('%c2. 动态导入: 使用 import() 实现路由级代码分割', 'color: #666;');
console.log('%c3. runtimeChunk: 将 webpack 运行时代码抽取到单独文件', 'color: #666;');
console.log('%c运行 npm run build 查看分割效果', 'color: #ff6b6b;');
