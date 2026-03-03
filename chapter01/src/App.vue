<template>
  <div class="app">
    <h1>Webpack5 基础学习</h1>
    <p>这是第1章的Demo：Webpack5基础概念和配置结构</p>
    <HelloWorld msg="你好，Webpack5！" />
  </div>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
</script>

<style scoped>
.app {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #42b883;
}
</style>
