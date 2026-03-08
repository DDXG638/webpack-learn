<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Webpack5 Plugin 学习</h1>
      <p class="subtitle">Chapter 3: Plugin 机制和使用</p>
    </header>

    <main class="app-main">
      <section class="info-section">
        <h2>项目信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">应用名称:</span>
            <span class="value">{{ appName }}</span>
          </div>
          <div class="info-item">
            <span class="label">应用版本:</span>
            <span class="value">{{ appVersion }}</span>
          </div>
          <div class="info-item">
            <span class="label">构建时间:</span>
            <span class="value">{{ buildTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">环境模式:</span>
            <span class="value">{{ nodeEnv }}</span>
          </div>
          <div class="info-item">
            <span class="label">调试模式:</span>
            <span class="value">{{ isDebug ? '是' : '否' }}</span>
          </div>
          <div class="info-item">
            <span class="label">功能开关:</span>
            <span class="value">{{ featureFlagsStr }}</span>
          </div>
        </div>
      </section>

      <section class="plugin-section">
        <h2>本章涉及的核心 Plugin</h2>
        <div class="plugin-list">
          <div class="plugin-item">
            <h3>1. HtmlWebpackPlugin</h3>
            <p>自动生成 HTML 文件，并注入打包后的资源引用。支持模板定制、压缩、缓存等功能。</p>
          </div>
          <div class="plugin-item">
            <h3>2. MiniCssExtractPlugin</h3>
            <p>将 CSS 从 JS 中提取到独立文件，支持 CSS 代码分割和长期缓存。</p>
          </div>
          <div class="plugin-item">
            <h3>3. DefinePlugin</h3>
            <p>定义编译时可配置的全局常量，支持环境变量、特性开关等配置。</p>
          </div>
          <div class="plugin-item">
            <h3>4. EnvironmentPlugin</h3>
            <p>DefinePlugin 的便捷封装，专门用于快速注入环境变量。</p>
          </div>
          <div class="plugin-item">
            <h3>5. 自定义 Plugin</h3>
            <p>通过 tapable 钩子机制，可以在构建生命周期中注入自定义逻辑。</p>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>功能演示</h2>
        <div class="demo-controls">
          <button @click="toggleFeature" class="btn">
            切换功能开关
          </button>
          <button @click="showAlert" class="btn btn-primary">
            显示环境信息
          </button>
        </div>
        <div v-if="showFeature" class="feature-demo">
          <p>新UI功能已启用！</p>
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <p>Powered by Webpack5</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { reportPV } from '@/utils/report'

// 从 DefinePlugin 注入的全局变量
const appName = __APP_NAME__;
const appVersion = __APP_VERSION__;
const buildTime = __BUILD_TIME__;
const nodeEnv = process.env.NODE_ENV || 'unknown';
const isDebug = process.env.DEBUG === 'true';

// 功能开关
const featureFlags = __FEATURE_FLAGS__;
const showFeature = ref(featureFlags.enableNewUI);

const featureFlagsStr = computed(() => {
  return JSON.stringify(featureFlags);
});

const toggleFeature = () => {
  showFeature.value = !showFeature.value;
};

const showAlert = () => {
  alert(`
    应用名称: ${appName}
    应用版本: ${appVersion}
    构建时间: ${buildTime}
    环境模式: ${nodeEnv}
    调试模式: ${isDebug ? '是' : '否'}
  `);
};

onMounted(() => {
  console.log('App 组件已挂载');
  console.log('Feature Flags:', featureFlags);
  reportPV();
});
</script>

<style scoped lang="scss">
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  text-align: center;
  padding: 40px 0;
  border-bottom: 2px solid #eee;

  h1 {
    margin: 0;
    color: #333;
    font-size: 32px;
  }

  .subtitle {
    margin-top: 10px;
    color: #666;
    font-size: 16px;
  }
}

.app-main {
  padding: 30px 0;
}

.info-section,
.plugin-section,
.demo-section {
  margin-bottom: 40px;

  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;

  .label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
  }

  .value {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
}

.plugin-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plugin-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;

  h3 {
    margin: 0 0 10px;
    color: #2196f3;
    font-size: 18px;
  }

  p {
    margin: 0;
    color: #666;
    line-height: 1.6;
  }
}

.demo-controls {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  background: #e0e0e0;
  color: #333;

  &:hover {
    background: #d0d0d0;
  }

  &.btn-primary {
    background: #2196f3;
    color: white;

    &:hover {
      background: #1976d2;
    }
  }
}

.feature-demo {
  margin-top: 20px;
  padding: 20px;
  background: #e3f2fd;
  border-radius: 8px;
  color: #1976d2;
}

.app-footer {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 14px;
}
</style>
