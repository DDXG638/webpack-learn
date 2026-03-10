// 商品数据类型
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

// 模拟商品列表数据
export const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 7999,
    description: 'Apple iPhone 15 Pro，钛金属设计，A17 Pro 芯片',
    image: 'https://picsum.photos/seed/iphone/400/400',
  },
  {
    id: 2,
    name: 'MacBook Pro 14',
    price: 15999,
    description: 'Apple MacBook Pro 14英寸，M3 Pro芯片',
    image: 'https://picsum.photos/seed/macbook/400/400',
  },
  {
    id: 3,
    name: 'iPad Pro',
    price: 6999,
    description: 'Apple iPad Pro 12.9英寸，M2芯片',
    image: 'https://picsum.photos/seed/ipad/400/400',
  },
  {
    id: 4,
    name: 'AirPods Pro',
    price: 1899,
    description: 'Apple AirPods Pro (第二代)，主动降噪',
    image: 'https://picsum.photos/seed/airpods/400/400',
  },
  {
    id: 5,
    name: 'Apple Watch',
    price: 3299,
    description: 'Apple Watch Series 9，智能手表',
    image: 'https://picsum.photos/seed/watch/400/400',
  },
  {
    id: 6,
    name: 'iMac',
    price: 12999,
    description: 'Apple iMac 24英寸，M3芯片',
    image: 'https://picsum.photos/seed/imac/400/400',
  },
];

// 获取商品列表
export function getProductList(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 300);
  });
}

// 根据ID获取商品详情
export function getProductById(id: number): Promise<Product | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find((p) => p.id === id));
    }, 300);
  });
}
