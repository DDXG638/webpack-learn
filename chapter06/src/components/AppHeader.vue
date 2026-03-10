<template>
  <header class="header">
    <div class="container">
      <div class="logo">电商Demo</div>
      <nav class="nav">
        <router-link to="/" active-class="active">商品列表</router-link>
      </nav>
      <button class="btn btn-outline" @click="showCart = true">
        购物车 ({{ cartCount }})
      </button>
    </div>

    <!-- 动态导入购物车组件 -->
    <CartModal
      v-if="showCart"
      @close="showCart = false"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { cartManager } from '@/utils/cart';

// 异步组件 - 实现代码分割
const CartModal = defineAsyncComponent(() =>
  import(/* webpackChunkName: "cart" */ '@/components/CartModal.vue')
);

const showCart = ref(false);
const cartCount = ref(0);

let unsubscribe: (() => void) | undefined;

onMounted(() => {
  cartCount.value = cartManager.getTotalCount();
  unsubscribe = cartManager.subscribe(() => {
    cartCount.value = cartManager.getTotalCount();
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>
