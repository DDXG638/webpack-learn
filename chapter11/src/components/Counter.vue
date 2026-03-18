<template>
  <div class="counter">
    <h3>计数器组件</h3>
    <p class="count">{{ count }}</p>
    <div class="buttons">
      <button @click="decrement">-</button>
      <button @click="increment">+</button>
    </div>
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

<style scoped lang="scss">
.counter {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

h3 {
  margin-bottom: 10px;
}

.count {
  font-size: 3rem;
  font-weight: bold;
  margin: 20px 0;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;

  button {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background: #fff;
    color: #333;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
