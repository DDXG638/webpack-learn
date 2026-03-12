<template>
  <div class="custom-loader-demo">
    <h2>自定义 Loader 演示</h2>

    <div class="demo-section">
      <h3>1. Banner Loader</h3>
      <p>为 JS 文件添加版权注释（可在打包后的文件查看）</p>
    </div>

    <div class="demo-section">
      <h3>2. Replace Loader</h3>
      <p>将 "Hello" 替换为 "你好"</p>
      <p>测试结果: {{ greeting }}</p>
    </div>

    <div class="demo-section">
      <h3>3. Markdown Loader</h3>
      <p>将 Markdown 文件直接转换为 HTML</p>
      <div class="markdown-preview" v-html="markdownContent"></div>
    </div>

    <div class="demo-section">
      <h3>4. Async Loader</h3>
      <p>异步处理结果: {{ asyncMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// 引入 Markdown 文件（通过 markdown-loader 处理）
import markdownContent from '@/demo/custom-loaders.md';
// 引入测试 JS 文件（通过 replace-loader 和 async-loader 处理）
import { greeting, asyncMessage } from '@/demo/test-loaders';

export default defineComponent({
  name: 'CustomLoaderDemo',
  setup() {
    return {
      greeting,
      asyncMessage,
      markdownContent,
    };
  },
});
</script>

<style scoped>
.custom-loader-demo {
  padding: 20px;
}

.demo-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.demo-section h3 {
  margin-top: 0;
  color: #42b983;
}

.markdown-preview {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.markdown-preview :deep(h1) {
  font-size: 1.5em;
  color: #333;
}

.markdown-preview :deep(h2) {
  font-size: 1.3em;
  color: #555;
}

.markdown-preview :deep(h3) {
  font-size: 1.1em;
  color: #666;
}

.markdown-preview :deep(code) {
  background-color: #e0e0e0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-preview :deep(pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
