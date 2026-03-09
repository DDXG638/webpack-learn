import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.css';

const app = createApp(App);
app.mount('#app');

console.log('环境:', process.env.NODE_ENV);
