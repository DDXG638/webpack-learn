<template>
  <div class="hello-world">
    <h3>{{ message }}</h3>
    <p>这是通过 Vue Loader 编译的组件</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('Hello World!');

const handleClick = () => {
  message.value = `Clicked at ${new Date().toLocaleTimeString()}`;
};
</script>

<style lang="scss" scoped>
.hello-world {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  text-align: center;

  h3 {
    margin: 0 0 10px;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: white;
    color: #667eea;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>
