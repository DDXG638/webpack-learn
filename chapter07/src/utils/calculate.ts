/**
 * 计算工具函数 - 演示 Tree-Shaking
 * Webpack 会分析这些函数的导出和使用情况
 * 只保留被实际使用的函数
 */

// 这个函数会被使用，会被保留
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

// 这个函数会被使用，会被保留
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// 这个函数不会被使用，会被 Tree-Shaking 移除
export function add(a: number, b: number): number {
  return a + b;
}

// 这个函数不会被使用，会被 Tree-Shaking 移除
export function multiply(a: number, b: number): number {
  return a * b;
}

// 这个函数不会被使用，会被 Tree-Shaking 移除
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// 这个函数不会被使用，会被 Tree-Shaking 移除
export function subtract(a: number, b: number): number {
  return a - b;
}

// 演示有副作用的函数 - 即使未被使用也不会被 Tree-Shaking 移除
// 因为 sideEffects: false 告诉 Webpack 所有模块都是"纯净的"
// 但如果有副作用，需要在 package.json 中正确配置 sideEffects
export function logMessage(message: string): void {
  console.log(`[LOG] ${message}`);
  // 副作用：修改全局状态
  (window as any).__lastLog = message;
}
