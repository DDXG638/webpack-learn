import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.css';

const app = createApp(App);
app.mount('#app');

console.log('应用已启动');
console.log('环境:', process.env.NODE_ENV);
console.log('版本:', __APP_VERSION__);
