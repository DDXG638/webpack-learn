/**
 * 产品工具函数 - 演示 Tree-Shaking
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// 这个函数会被使用，会被保留
export function sortProducts(
  products: Product[],
  key: keyof Product = 'id'
): Product[] {
  return [...products].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}

// 这个函数会被导入但不会使用，应该被 Tree-Shaking 移除
export function filterProducts(
  products: Product[],
  category: string
): Product[] {
  return products.filter(p => p.category === category);
}

// 这个函数不会被使用，会被 Tree-Shaking 移除
export function groupByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce((groups, product) => {
    const category = product.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {} as Record<string, Product[]>);
}

// 这个函数不会被使用，会被 Tree-Shaking 移除
export function calculateAveragePrice(products: Product[]): number {
  if (products.length === 0) return 0;
  const total = products.reduce((sum, p) => sum + p.price, 0);
  return total / products.length;
}
