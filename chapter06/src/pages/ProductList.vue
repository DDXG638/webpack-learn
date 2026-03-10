<template>
  <div class="product-list-page">
    <div class="page-header">
      <h1>商品列表</h1>
      <p>欢迎来到我们的在线商店</p>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
          <div class="product-bottom">
            <span class="product-price">¥{{ product.price.toLocaleString() }}</span>
            <button
              class="btn btn-primary btn-add-cart"
              @click.stop="handleAddToCart(product)"
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
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
import { useRouter } from 'vue-router';
import type { Product } from '@/utils/products';
import { getProductList } from '@/utils/products';
import { cartManager } from '@/utils/cart';

// 使用 defineAsyncComponent 实现异步组件 - 实现代码分割
// 这是一个关键演示点：购物车组件会被分割到单独的 chunk 文件中
// 只有当用户点击"加入购物车"按钮时，才会加载这个 chunk
const CartModal = defineAsyncComponent(() =>
  import(/* webpackChunkName: "cart" */ '@/components/CartModal.vue')
);

const router = useRouter();
const products = ref<Product[]>([]);
const loading = ref(true);
const showCart = ref(false);

onMounted(async () => {
  products.value = await getProductList();
  loading.value = false;
});

// 跳转到商品详情页
function goToDetail(id: number) {
  router.push(`/product/${id}`);
}

// 加入购物车
function handleAddToCart(product: Product) {
  cartManager.addCart(product);
  showCart.value = true;
}
</script>

<style scoped>
.product-list-page {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: var(--text-color);
}

.page-header p {
  color: #666;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--text-color);
}

.product-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
}

.btn-add-cart {
  padding: 8px 16px;
  font-size: 14px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #999;
}
</style>
