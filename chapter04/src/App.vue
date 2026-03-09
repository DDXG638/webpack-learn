<template>
  <div class="app-container">
    <h1>Webpack5 开发环境配置</h1>
    <div class="info">
      <p>当前环境: <strong>{{ mode }}</strong></p>
      <p>版本号: <strong>{{ version }}</strong></p>
    </div>
    <div class="demo">
      <h2>功能演示</h2>
      <button @click="showMessage">点击测试热更新</button>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
    <div class="features">
      <h2>开发环境特性</h2>
      <ul>
        <li>热模块替换 (HMR)</li>
        <li>Source Map 支持</li>
        <li>开发代理</li>
        <li>自动打开浏览器</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mode = process.env.NODE_ENV || 'development';
const version = __APP_VERSION__;
const message = ref('');

const showMessage = () => {
  message.value = '热模块更新成功！页面无需刷新即可看到变化';
  setTimeout(() => {
    message.value = '';
  }, 3000);
};
</script>

<style scoped lang="scss">
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

.info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.demo {
  margin: 30px 0;

  button {
    background: #42b983;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background: #359268;
    }
  }

  .message {
    margin-top: 15px;
    color: #42b983;
    font-weight: bold;
  }
}

.features {
  h2 {
    color: #333;
  }

  ul {
    li {
      margin: 10px 0;
      line-height: 1.6;
    }
  }
}
</style>
