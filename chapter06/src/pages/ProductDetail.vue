<template>
  <div class="product-detail-page">
    <button class="btn-back" @click="goBack">
      ← 返回列表
    </button>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="product" class="product-detail">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-desc">{{ product.description }}</p>
        <div class="product-price">¥{{ product.price.toLocaleString() }}</div>

        <div class="product-actions">
          <button
            class="btn btn-primary btn-large"
            @click="handleAddToCart"
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>

    <div v-else class="product-not-found">
      <p>商品不存在</p>
    </div>

    <!-- 动态导入购物车组件 -->
    <CartModal
      v-if="showCart"
      @close="showCart = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Product } from '@/utils/products';
import { getProductById } from '@/utils/products';
import { cartManager } from '@/utils/cart';

// 使用 defineAsyncComponent 实现异步组件 - 实现代码分割
const CartModal = defineAsyncComponent(() =>
  import(/* webpackChunkName: "cart" */ '@/components/CartModal.vue')
);

const route = useRoute();
const router = useRouter();
const product = ref<Product | undefined>(undefined);
const loading = ref(true);
const showCart = ref(false);

onMounted(async () => {
  const id = Number(route.params.id);
  product.value = await getProductById(id);
  loading.value = false;
});

function goBack() {
  router.push('/');
}

function handleAddToCart() {
  if (product.value) {
    cartManager.addCart(product.value);
    showCart.value = true;
  }
}
</script>

<style scoped>
.product-detail-page {
  padding: 20px 0;
}

.btn-back {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 16px;
  padding: 8px 0;
  margin-bottom: 20px;
}

.btn-back:hover {
  text-decoration: underline;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.product-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 28px;
  margin-bottom: 16px;
}

.product-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.product-price {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 32px;
}

.product-actions {
  margin-top: auto;
}

.btn-large {
  padding: 16px 48px;
  font-size: 18px;
}

.loading,
.product-not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #999;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .product-image {
    height: 300px;
  }
}
</style>
