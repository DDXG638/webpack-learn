import { createRouter, createWebHistory } from 'vue-router';

// 商品列表页面 - 动态导入（路由级代码分割）
// 使用 webpackChunkName 指定 chunk 文件名
const ProductList = () => import(/* webpackChunkName: "product-list" */ '@/pages/ProductList.vue');

// 商品详情页面 - 动态导入（路由级代码分割）
const ProductDetail = () => import(/* webpackChunkName: "product-detail" */ '@/pages/ProductDetail.vue');

// 路由配置
const routes = [
  {
    path: '/',
    name: 'ProductList',
    component: ProductList,
    meta: { title: '商品列表' },
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: '商品详情' },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫 - 动态设置页面标题
router.beforeEach((to, _from, next) => {
  document.title = (to.meta?.title as string) || 'Webpack5 代码分割 Demo';
  next();
});

export default router;
