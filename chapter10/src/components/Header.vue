<template>
  <header class="custom-header">
    <h2>{{ title }}</h2>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: '标题',
});
</script>

<style scoped>
.custom-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
}

.custom-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}
</style>
