<template>
  <div class="container">
    <h1>Webpack5 性能优化 Demo</h1>
    <p class="subtitle">展示各种优化技术的实际效果</p>

    <div class="optimization-cards">
      <div class="card">
        <h3>1. runtimeChunk</h3>
        <p>将 webpack runtime 代码抽离到单独文件，实现长期缓存</p>
        <code>runtimeChunk: { name: 'runtime' }</code>
      </div>

      <div class="card">
        <h3>2. splitChunks</h3>
        <p>代码分割，提取 vendor 和公共代码</p>
        <code>splitChunks: { chunks: 'all' }</code>
      </div>

      <div class="card">
        <h3>3. Terser 压缩</h3>
        <p>压缩 JS 代码，移除 console 和注释</p>
        <code>drop_console: true</code>
      </div>

      <div class="card">
        <h3>4. CSS 压缩</h3>
        <p>使用 css-minimizer-webpack-plugin</p>
        <code>CssMinimizerPlugin</code>
      </div>

      <div class="card">
        <h3>5. 缓存优化</h3>
        <p>使用文件系统缓存加速二次构建</p>
        <code>cache: { type: 'filesystem' }</code>
      </div>

      <div class="card">
        <h3>6. Tree Shaking</h3>
        <p>消除未使用的代码</p>
        <code>sideEffects: true</code>
      </div>
    </div>

    <div class="button-group">
      <button @click="handleBuild" class="btn btn-primary">
        触发构建
      </button>
      <button @click="showInfo" class="btn btn-secondary">
        查看信息
      </button>
    </div>

    <div class="info-panel" v-if="showPanel">
      <h4>构建产物信息</h4>
      <p>主包: {{ mainSize }}</p>
      <p>Vendor: {{ vendorSize }}</p>
      <p>Runtime: {{ runtimeSize }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { log } from './utils/logger';

const showPanel = ref(false);
const mainSize = ref('--');
const vendorSize = ref('--');
const runtimeSize = ref('--');

const handleBuild = () => {
  console.log('构建触发 - 这个 console.log 会在生产环境被移除');
  log('info', '构建完成');
  showPanel.value = true;
};

const showInfo = () => {
  console.log('查看构建信息');
  showPanel.value = !showPanel.value;
};

onMounted(() => {
  console.log('应用已加载 - Webpack 性能优化 Demo');
  log('info', '应用初始化完成');

  // 模拟获取构建信息
  mainSize.value = '~50KB';
  vendorSize.value = '~120KB';
  runtimeSize.value = '~4KB';
});
</script>

<style scoped lang="scss">
.container {
  max-width: 900px;
  padding: 40px 20px;
  color: #fff;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  text-align: center;
  opacity: 0.9;
  margin-bottom: 40px;
}

.optimization-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: #ffd700;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 10px;
    opacity: 0.9;
  }

  code {
    display: block;
    background: rgba(0, 0, 0, 0.3);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #87ceeb;
    word-break: break-all;
  }
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &-primary {
    background: #ffd700;
    color: #333;

    &:hover {
      background: #ffed4a;
      transform: scale(1.05);
    }
  }

  &-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.info-panel {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;

  h4 {
    margin-bottom: 15px;
    color: #ffd700;
  }

  p {
    margin: 5px 0;
    font-size: 0.95rem;
  }
}
</style>
