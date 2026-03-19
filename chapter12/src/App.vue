<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">Webpack5 综合实战</h1>
        <ul class="nav-links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/about">关于</router-link></li>
          <li><router-link to="/user">用户</router-link></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <p>Webpack5 综合实战 Demo - 基于 Pinia + Vue Router</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped lang="scss">
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }

  .logo {
    font-size: 1.25rem;
    color: #42b883;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: 30px;

    a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      transition: color 0.3s;

      &:hover,
      &.router-link-active {
        color: #42b883;
      }
    }
  }
}

.main-content {
  min-height: calc(100vh - 140px);
  padding: 30px 20px;
}

.footer {
  background: #fff;
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}
</style>
