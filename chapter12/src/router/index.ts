import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import User from '@/pages/User.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于' },
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { title: '用户中心' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) + ' - Webpack5 综合实战';
  next();
});

export default router;
