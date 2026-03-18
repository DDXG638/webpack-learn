<template>
  <div class="container">
    <div class="header">
      <h1>Module Federation - Remote 应用</h1>
      <p class="subtitle">提供可复用的组件和工具</p>
    </div>

    <div class="info">
      <h2>已暴露模块</h2>
      <div class="modules-list">
        <div class="module-item">
          <h3>./Button</h3>
          <p>可自定义文本的按钮组件</p>
          <Button text="示例按钮" @click="handleClick" />
        </div>

        <div class="module-item">
          <h3>./Header</h3>
          <p>页面头部组件</p>
          <Header title="Remote 头部组件" />
        </div>

        <div class="module-item">
          <h3>./Counter</h3>
          <p>计数器组件</p>
          <Counter />
        </div>

        <div class="module-item">
          <h3>./utils</h3>
          <p>工具函数集合</p>
          <div class="utils-demo">
            <p>formatDate: {{ formattedDate }}</p>
            <p>formatCurrency: {{ formattedMoney }}</p>
            <p>VERSION: {{ version }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="tips">
      <h2>模块联邦优势</h2>
      <ul>
        <li><strong>独立部署</strong>: Remote 应用可以独立部署更新</li>
        <li><strong>按需加载</strong>: 只加载需要的模块</li>
        <li><strong>共享依赖</strong>: 减少重复代码</li>
        <li><strong>微前端架构</strong>: 支持大型应用的分布式开发</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from './components/Button.vue';
import Header from './components/Header.vue';
import Counter from './components/Counter.vue';
import { formatDate, formatCurrency, VERSION } from './utils/shared';

const handleClick = () => {
  console.log('Remote 按钮被点击');
};

const now = new Date();
const formattedDate = computed(() => formatDate(now));
const formattedMoney = computed(() => formatCurrency(9999.99));
const version = VERSION;
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #4caf50;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info h2 {
  margin-bottom: 20px;
  color: #333;
}

.modules-list {
  display: grid;
  gap: 20px;
}

.module-item {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.module-item h3 {
  color: #4caf50;
  margin-bottom: 8px;
}

.module-item p {
  color: #666;
  margin-bottom: 15px;
}

.utils-demo {
  background: white;
  padding: 10px;
  border-radius: 4px;
}

.utils-demo p {
  margin: 5px 0;
  font-family: monospace;
}

.tips {
  background: #e8f5e9;
  padding: 20px;
  border-radius: 8px;
}

.tips h2 {
  margin-bottom: 15px;
  color: #2e7d32;
}

.tips ul {
  padding-left: 20px;
}

.tips li {
  margin: 10px 0;
  line-height: 1.6;
}
</style>
