import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.css';
import './styles/variables.scss';

// 创建Vue应用
const app = createApp(App);

// 挂载到DOM
app.mount('#app');

console.log('Webpack5 Loader 学习 Demo 已启动');
