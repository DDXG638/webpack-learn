import { createApp } from 'vue';
import App from './App.vue';
import { calculateTotal, formatCurrency } from './utils/calculate';
import { sortProducts } from './utils/products';
import { getStats, getMedian } from './utils/stats';
import './styles/global.css';

const app = createApp(App);

// 演示 Tree-Shaking：只导入使用的函数
const products = [
  { id: 1, name: 'iPhone', price: 999, category: 'electronics' },
  { id: 2, name: 'MacBook', price: 1999, category: 'electronics' },
  { id: 3, name: 'Coffee', price: 5, category: 'food' },
];

// 使用 calculateTotal（会被保留）
const total = calculateTotal([100, 200, 300]);
console.log('Total:', total);

// 使用 formatCurrency（会被保留）
console.log('Price:', formatCurrency(999));

// 使用 sortProducts（会被保留）
const sorted = sortProducts(products, 'price');
console.log('Sorted products:', sorted);

// 使用 stats 模块（会触发 Scope Hoisting）
const numbers = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const stats = getStats(numbers);
console.log('Stats:', stats);

const median = getMedian(numbers);
console.log('Median:', median);

// 未使用的导出会被 Tree-Shaking 移除
// add、multiply、divide 不会被包含在打包结果中

app.mount('#app');
