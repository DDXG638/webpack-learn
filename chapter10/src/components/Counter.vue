<template>
  <div class="counter">
    <button class="btn minus" @click="decrement">-</button>
    <span class="count">{{ count }}</span>
    <button class="btn plus" @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>

<style scoped>
.counter {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 8px;
}

.btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.btn.minus {
  background: #ff5722;
  color: white;
}

.btn.minus:hover {
  background: #f4511e;
  transform: scale(1.1);
}

.btn.plus {
  background: #2196f3;
  color: white;
}

.btn.plus:hover {
  background: #1e88e5;
  transform: scale(1.1);
}

.count {
  font-size: 24px;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
  color: #333;
}
</style>
