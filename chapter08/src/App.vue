<template>
  <div class="container">
    <h1>Webpack5 Tapable 基础使用 Demo</h1>
    <div class="info">
      <p>应用名称: {{ appName }}</p>
      <p>版本号: {{ appVersion }}</p>
    </div>
    <div class="content">
      <h2>Tapable 钩子类型演示</h2>
      <ul>
        <li><strong>SyncHook</strong>: 同步钩子，按注册顺序执行</li>
        <li><strong>SyncBailHook</strong>: 同步保险钩子，遇到返回值停止</li>
        <li><strong>AsyncSeriesHook</strong>: 异步串行钩子，按顺序执行</li>
        <li><strong>AsyncParallelHook</strong>: 异步并行钩子，同时执行</li>
      </ul>
    </div>
    <div class="hooks-demo">
      <h2>Webpack 编译钩子</h2>
      <p>打开浏览器控制台查看钩子执行日志</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const appName = __APP_NAME__;
const appVersion = __APP_VERSION__;
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #42b983;
}

.info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
}

.content, .hooks-demo {
  margin: 20px 0;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.hooks-demo {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 5px;
}
</style>
