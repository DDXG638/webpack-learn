<template>
  <div class="about-page">
    <div class="container">
      <h2>关于项目</h2>

      <div class="content">
        <section class="section">
          <h3>项目技术栈</h3>
          <ul class="tech-list">
            <li><span class="tag">Vue 3</span> 渐进式前端框架</li>
            <li><span class="tag">Pinia</span> 状态管理</li>
            <li><span class="tag">Vue Router</span> 路由管理</li>
            <li><span class="tag">Webpack 5</span> 模块打包</li>
            <li><span class="tag">TypeScript</span> 类型支持</li>
            <li><span class="tag">SCSS</span> 样式预处理</li>
            <li><span class="tag">Babel</span> JS 转译</li>
            <li><span class="tag">PostCSS</span> CSS 处理</li>
          </ul>
        </section>

        <section class="section">
          <h3>Webpack 配置亮点</h3>
          <div class="config-list">
            <div class="config-item">
              <h4>代码分割</h4>
              <p>使用 splitChunks 将 vendor 代码和业务代码分离，支持运行时缓存</p>
            </div>
            <div class="config-item">
              <h4>Tree Shaking</h4>
              <p>启用 usedExports 和 concatenateModules，消除未使用代码</p>
            </div>
            <div class="config-item">
              <h4>Babel 转译</h4>
              <p>配置 @babel/preset-env，根据浏览器目标自动转译 JS</p>
            </div>
            <div class="config-item">
              <h4>PostCSS 前缀</h4>
              <p>使用 autoprefixer 自动添加 CSS 浏览器兼容前缀</p>
            </div>
            <div class="config-item">
              <h4>CDN 支持</h4>
              <p>build:cdn 命令通过 externals 外部化 Vue 依赖，使用 CDN 加载</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h3>可用命令</h3>
          <div class="commands">
            <code>pnpm dev</code>
            <span>启动开发服务器</span>
          </div>
          <div class="commands">
            <code>pnpm build</code>
            <span>生产环境构建</span>
          </div>
          <div class="commands">
            <code>pnpm build:cdn</code>
            <span>CDN 模式构建（Vue 从 CDN 加载）</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.about-page {
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .section {
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    h3 {
      color: #42b883;
      margin-bottom: 20px;
      font-size: 1.25rem;
    }
  }

  .tech-list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #666;
    }

    .tag {
      background: #e8f5e9;
      color: #42b883;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  .config-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .config-item {
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #42b883;

    h4 {
      color: #333;
      margin-bottom: 8px;
      font-size: 1rem;
    }

    p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }

  .commands {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    code {
      background: #f5f5f5;
      padding: 6px 12px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.9rem;
      color: #e83e8c;
    }

    span {
      color: #666;
      font-size: 0.9rem;
    }
  }
}
</style>
