<template>
  <div class="container">
    <h1>Webpack5 原理深入 Demo</h1>
    <div class="info">
      <p>应用名称: {{ appName }}</p>
      <p>版本号: {{ appVersion }}</p>
    </div>
    <div class="content">
      <h2>Webpack 构建流程</h2>
      <ol>
        <li><strong>初始化</strong>: 读取配置、创建 Compiler</li>
        <li><strong>编译</strong>: 从入口开始分析依赖</li>
        <li><strong>优化</strong>: 代码分割、Tree-Shaking</li>
        <li><strong>生成</strong>: 输出资源到目录</li>
      </ol>
    </div>
    <div class="content">
      <h2>关键概念</h2>
      <ul>
        <li><strong>Compiler</strong>: webpack 实例，掌控全局</li>
        <li><strong>Compilation</strong>: 编译过程的核心对象</li>
        <li><strong>Module</strong>: 代码模块单元</li>
        <li><strong>Chunk</strong>: 代码块，用于分割</li>
        <li><strong>Loader</strong>: 文件转换器</li>
        <li><strong>Plugin</strong>: 扩展构建流程</li>
      </ul>
    </div>
    <div class="demo">
      <h2>打开控制台查看构建日志</h2>
      <p>构建过程中会输出各阶段的详细信息</p>
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

.content, .demo {
  margin: 20px 0;
}

ol, ul {
  padding-left: 20px;
}

li {
  padding: 8px 0;
  line-height: 1.6;
}

.demo {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 5px;
}
</style>
