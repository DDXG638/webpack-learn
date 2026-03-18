<template>
  <div class="container">
    <div class="header">
      <h1>Module Federation - Host 应用</h1>
      <p class="subtitle">消费来自 Remote 应用的可复用模块</p>
    </div>

    <div class="info">
      <h2>应用架构</h2>
      <div class="arch">
        <div class="box host">
          <h3>Host (主应用)</h3>
          <p>端口: 3000</p>
          <p>角色: 消费者</p>
        </div>
        <div class="arrow">→</div>
        <div class="box remote">
          <h3>Remote (远程应用)</h3>
          <p>端口: 3001</p>
          <p>角色: 提供者</p>
        </div>
      </div>
    </div>

    <div class="modules">
      <h2>远程模块展示</h2>
      <p class="hint">以下是 Remote 应用提供的组件（动态加载）：</p>

      <div class="module-section">
        <h3>1. Button 组件</h3>
        <Button text="点击我" @click="handleClick" />
      </div>

      <div class="module-section">
        <h3>2. Header 组件</h3>
        <Header title="欢迎使用模块联邦" />
      </div>

      <div class="module-section">
        <h3>3. Counter 组件</h3>
        <Counter />
      </div>

      <div class="module-section">
        <h3>4. 工具函数</h3>
        <div class="utils-demo">
          <p>格式化日期: {{ formattedDate }}</p>
          <p>格式化金额: {{ formattedMoney }}</p>
          <p>版本号: {{ version }}</p>
        </div>
      </div>
    </div>

    <div class="description">
      <h2>模块联邦说明</h2>
      <ul>
        <li><strong>Remote</strong>: 提供可复用的组件和工具</li>
        <li><strong>Host</strong>: 消费远程模块，如同本地模块一样使用</li>
        <li><strong>共享依赖</strong>: Vue 只加载一次，多个应用共享</li>
        <li><strong>独立部署</strong>: Remote 可以独立部署，不影响 Host</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';

// 使用 defineAsyncComponent 动态导入远程组件
// 这样不需要 eager: true，共享模块会在运行时异步加载
const Button = defineAsyncComponent(() => import('remoteApp/Button'));
const Header = defineAsyncComponent(() => import('remoteApp/Header'));
const Counter = defineAsyncComponent(() => import('remoteApp/Counter'));

// 工具函数 - 使用 ref 存储，onMounted 中动态加载
const formattedDate = ref('');
const formattedMoney = ref('');
const version = ref('');

onMounted(async () => {
  const utils = await import('remoteApp/utils');
  const now = new Date();
  formattedDate.value = utils.formatDate(now);
  formattedMoney.value = utils.formatCurrency(1234.56);
  version.value = utils.VERSION;
});

const handleClick = () => {
  alert('按钮被点击了！');
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #42b983;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.info h2 {
  margin-bottom: 15px;
  color: #333;
}

.arch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.box {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 150px;
}

.box.host {
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.box.remote {
  background: #e8f5e9;
  border: 2px solid #4caf50;
}

.box h3 {
  margin-bottom: 10px;
}

.arrow {
  font-size: 24px;
  color: #666;
}

.modules {
  margin-bottom: 30px;
}

.modules h2 {
  margin-bottom: 10px;
}

.hint {
  color: #666;
  margin-bottom: 20px;
}

.module-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.module-section h3 {
  margin-bottom: 15px;
  color: #42b983;
}

.utils-demo {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

.utils-demo p {
  margin: 8px 0;
}

.description {
  background: #fff3e0;
  padding: 20px;
  border-radius: 8px;
}

.description h2 {
  margin-bottom: 15px;
  color: #e65100;
}

.description ul {
  padding-left: 20px;
}

.description li {
  margin: 10px 0;
  line-height: 1.6;
}
</style>
