<template>
  <div class="app">
    <header class="header">
      <h1>Tree-Shaking 和模块合并示例</h1>
      <p class="subtitle">打开控制台查看日志输出</p>
    </header>

    <main class="main">
      <section class="info-section">
        <h2>Tree-Shaking 效果演示</h2>
        <div class="card">
          <h3>什么是 Tree-Shaking？</h3>
          <p>
            Tree-Shaking 是 Webpack 5 的一个优化特性，用于移除 JavaScript 中未使用的代码（dead code）。
            它基于 ES Module 的静态分析特性，在编译时确定哪些导出被实际使用。
          </p>
          <ul>
            <li>只在 <strong>production 模式</strong>下生效</li>
            <li>需要使用 <strong>ES Module</strong> 语法（import/export）</li>
            <li>需要在 package.json 中正确配置 <strong>sideEffects</strong></li>
          </ul>
        </div>

        <div class="card">
          <h3>Scope Hoisting（模块合并）</h3>
          <p>
            Scope Hoisting 是将多个模块合并到单个函数中的优化技术，可以：
          </p>
          <ul>
            <li>减少函数声明，提升执行效率</li>
            <li>减小包体积（消除模块包装）</li>
            <li>只在 production 模式下启用</li>
          </ul>
        </div>
      </section>

      <section class="demo-section">
        <h2>效果对比</h2>
        <div class="comparison">
          <div class="comparison-item">
            <h3>开发环境 (development)</h3>
            <p>每个模块独立打包，包含完整注释和调试信息</p>
            <code>mode: 'development'</code>
          </div>
          <div class="comparison-item">
            <h3>生产环境 (production)</h3>
            <p>启用 Tree-Shaking 和 Scope Hoisting，移除未使用代码</p>
            <code>mode: 'production'</code>
          </div>
        </div>
      </section>

      <section class="tips-section">
        <h2>使用提示</h2>
        <div class="tips">
          <div class="tip">
            <span class="tip-icon">💡</span>
            <p>运行 <code>npm run build</code> 查看生产环境打包结果</p>
          </div>
          <div class="tip">
            <span class="tip-icon">📊</span>
            <p>运行 <code>npm run analyze</code> 分析打包产物</p>
          </div>
          <div class="tip">
            <span class="tip-icon">🔍</span>
            <p>查看 dist 目录下的 JS 文件，对比开发/生产环境的差异</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  .subtitle {
    opacity: 0.9;
  }
}

.main {
  max-width: 900px;
  margin: 0 auto;
}

.info-section,
.demo-section,
.tips-section {
  margin-bottom: 30px;

  h2 {
    color: white;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: #333;
    margin-bottom: 12px;
  }

  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  ul {
    padding-left: 20px;
    color: #666;

    li {
      margin-bottom: 8px;
    }

    strong {
      color: #667eea;
    }
  }

  code {
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
}

.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.comparison-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: #333;
    margin-bottom: 12px;
  }

  p {
    color: #666;
    margin-bottom: 12px;
  }

  code {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
}

.tips {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tip {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .tip-icon {
    font-size: 1.5rem;
    margin-right: 12px;
  }

  p {
    color: #666;
    margin: 0;
  }

  code {
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    margin: 0 4px;
  }
}
</style>
