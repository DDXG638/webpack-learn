<template>
  <div class="cart-modal-overlay" @click.self="handleClose">
    <div class="cart-modal">
      <div class="cart-modal-header">
        <h3>购物车</h3>
        <button class="cart-modal-close" @click="handleClose">&times;</button>
      </div>

      <div class="cart-modal-body">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>购物车是空的</p>
        </div>

        <div v-else class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.product.id"
            class="cart-item"
          >
            <div class="cart-item-info">
              <div class="cart-item-name">{{ item.product.name }}</div>
              <div class="cart-item-price">
                ¥{{ item.product.price.toLocaleString() }}
              </div>
            </div>

            <div class="cart-item-quantity">
              <button
                class="btn-quantity"
                @click="decreaseQuantity(item.product.id)"
              >
                -
              </button>
              <span>{{ item.quantity }}</span>
              <button
                class="btn-quantity"
                @click="increaseQuantity(item.product.id)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="cart-modal-footer">
        <div class="cart-total">
          总计: ¥{{ totalPrice.toLocaleString() }}
        </div>
        <button class="btn btn-primary" @click="handleCheckout">
          结算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { cartManager, type CartItem } from '@/utils/cart';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const cartItems = ref<CartItem[]>([]);

const totalPrice = computed(() => {
  return cartManager.getTotalPrice();
});

// 订阅购物车变化
let unsubscribe: (() => void) | undefined;

onMounted(() => {
  cartItems.value = cartManager.getItems();
  unsubscribe = cartManager.subscribe((items) => {
    cartItems.value = items;
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

function handleClose() {
  emit('close');
}

function increaseQuantity(productId: number) {
  const item = cartItems.value.find((i) => i.product.id === productId);
  if (item) {
    cartManager.updateQuantity(productId, item.quantity + 1);
  }
}

function decreaseQuantity(productId: number) {
  const item = cartItems.value.find((i) => i.product.id === productId);
  if (item) {
    cartManager.updateQuantity(productId, item.quantity - 1);
  }
}

function handleCheckout() {
  alert(`结算成功！总价: ¥${totalPrice.value.toLocaleString()}`);
  cartManager.clear();
  handleClose();
}
</script>

<style scoped>
.btn-quantity {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-quantity:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}
</style>
