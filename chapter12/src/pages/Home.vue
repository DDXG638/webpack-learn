<template>
  <div class="home-page">
    <div class="container">
      <h2>欢迎来到 Webpack5 综合实战</h2>
      <p class="subtitle">本项目展示了 Webpack5 的完整配置和最佳实践</p>

      <div class="feature-grid">
        <div class="feature-card">
          <h3>多页面路由</h3>
          <p>使用 Vue Router 实现多页面应用，支持路由守卫和动态加载</p>
        </div>
        <div class="feature-card">
          <h3>状态管理</h3>
          <p>使用 Pinia 进行状态管理，支持响应式数据和计算属性</p>
        </div>
        <div class="feature-card">
          <h3>Babel 兼容</h3>
          <p>配置 Babel 转译 JS，兼容不同版本的浏览器</p>
        </div>
        <div class="feature-card">
          <h3>PostCSS 前缀</h3>
          <p>自动添加 CSS 浏览器兼容前缀，提升开发体验</p>
        </div>
        <div class="feature-card">
          <h3>CDN 加速</h3>
          <p>支持 CDN 模式构建，减少打包体积，加快首屏加载</p>
        </div>
        <div class="feature-card">
          <h3>性能优化</h3>
          <p>代码分割、Tree Shaking、压缩优化等最佳实践</p>
        </div>
      </div>

      <div class="demo-section">
        <h3>用户统计</h3>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ userStore.userCount }}</span>
            <span class="stat-label">用户总数</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped lang="scss">
.home-page {
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 10px;
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 40px;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .feature-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    }

    h3 {
      color: #42b883;
      margin-bottom: 12px;
      font-size: 1.1rem;
    }

    p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }

  .demo-section {
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    h3 {
      margin-bottom: 20px;
      color: #333;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 40px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 3rem;
      font-weight: bold;
      color: #42b883;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }
  }
}
</style>
