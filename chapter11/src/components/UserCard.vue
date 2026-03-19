<template>
  <div class="user-card">
    <div class="avatar">
      {{ user?.name?.charAt(0) || '?' }}
    </div>
    <div class="info">
      <h4>{{ user?.name || '未命名用户' }}</h4>
      <p>{{ user?.email || '暂无邮箱' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { defineProps } from 'vue';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

defineProps<{
  user?: User;
}>();
</script>

<style scoped lang="scss">
.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.info {
  h4 {
    margin-bottom: 5px;
  }

  p {
    font-size: 0.85rem;
    opacity: 0.8;
  }
}
</style>
