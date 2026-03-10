import type { Product } from './products';

// 购物车商品项
export interface CartItem {
  product: Product;
  quantity: number;
}

// 购物车状态管理
class CartManager {
  private items: CartItem[] = [];
  private listeners: Array<(items: CartItem[]) => void> = [];

  // 获取购物车商品列表
  getItems(): CartItem[] {
    return this.items;
  }

  // 添加商品到购物车
  addItem(product: Product): void {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }

    this.notifyListeners();
  }

  // 添加商品到购物车（别名方法）
  addCart(product: Product): void {
    this.addItem(product);
  }

  // 移除商品
  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.notifyListeners();
  }

  // 更新商品数量
  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.notifyListeners();
      }
    }
  }

  // 清空购物车
  clear(): void {
    this.items = [];
    this.notifyListeners();
  }

  // 计算总价格
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  // 获取商品总数
  getTotalCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // 订阅购物车变化
  subscribe(listener: (items: CartItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // 通知所有监听器
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.items]));
  }
}

// 导出购物车单例
export const cartManager = new CartManager();
