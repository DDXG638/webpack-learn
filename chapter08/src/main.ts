import { createApp } from 'vue';
import App from './App.vue';

console.log(`应用名称: ${__APP_NAME__}`);
console.log(`版本号: ${__APP_VERSION__}`);

const app = createApp(App);
app.mount('#app');
