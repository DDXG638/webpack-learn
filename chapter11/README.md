# 第11章：性能优化和最佳实践

## 学习目标

- 掌握 runtimeChunk 配置，理解其对长期缓存的影响
- 掌握 splitChunks 代码分割技术
- 学会使用 Terser 进行 JS 压缩和混淆
- 掌握 CSS 压缩和资源优化
- 学会使用 webpack-bundle-analyzer 分析打包体积
- 理解缓存优化和构建速度优化
- 掌握生产环境最佳配置

## 核心概念介绍

### 1. 为什么要性能优化？

```
优化前:
┌─────────────────────────────────────────────────┐
│                    打包结果                      │
├─────────────────────────────────────────────────┤
│  main.js (500KB) - 包含 Vue + 业务代码 + 样式  │
│                                                 │
│  问题:                                          │
│  1. 首次加载慢 - 需要下载整个包                  │
│  2. 代码变化 - 整个包 503 无法利用缓存           │
│  3. 二次构建 - 没有缓存，每次全量构建            │
└─────────────────────────────────────────────────┘

优化后:
┌─────────────────────────────────────────────────┐
│                    打包结果                      │
├─────────────────────────────────────────────────┤
│  runtime.js (4KB)   - webpack 运行时            │
│  vendors.js (150KB) - 第三方库 (Vue)            │
│  main.js (50KB)    - 业务代码                   │
│                                                 │
│  优势:                                          │
│  1. 首屏加载快 - 并行加载多个小文件              │
│  2. 长期缓存 - 只有 main.js 变化                │
│  3. 二次构建快 - 使用文件系统缓存               │
└─────────────────────────────────────────────────┘
```

### 2. 优化策略总览

| 优化类型 | 技术手段 | 效果 |
|----------|----------|------|
| 代码分割 | runtimeChunk + splitChunks | 减少首屏加载时间 |
| 代码压缩 | Terser + CssMinimizer | 减少文件体积 |
| 资源优化 | 图片压缩 + Tree Shaking | 进一步减小体积 |
| 缓存优化 | contenthash + filesystem cache | 加速二次构建 |
| 构建优化 | 并行构建 + 缓存 | 提升构建速度 |

## 关键配置解析

### 1. runtimeChunk 配置

**作用**: 将 webpack runtime 代码抽离到单独文件，实现长期缓存。

```typescript
// webpack.config.ts
optimization: {
  // 将 runtime 抽离到单独文件
  runtimeChunk: {
    name: 'runtime',
  },
}
```

**效果说明**:

```
优化前: main.js 包含 runtime + 业务代码
优化后:
  - main.js      业务代码
  - runtime.js   webpack runtime

优势: 业务代码变化时，runtime 不变，浏览器可复用缓存
```

### 2. splitChunks 代码分割

```typescript
optimization: {
  splitChunks: {
    chunks: 'all', // 对所有 chunk 进行分割
    minSize: 20000, // 最小 chunk 大小 (20KB)
    maxSize: 244000, // 最大 chunk 大小

    cacheGroups: {
      // 提取 node_modules 中的代码
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        priority: -10,
      },

      // 单独抽离 Vue
      vue: {
        test: /[\\/]node_modules[\\/](vue|@vue)[\\/]/,
        name: 'vue',
        chunks: 'all',
        priority: 20,
      },

      // 提取公共代码
      common: {
        name: 'common',
        minChunks: 2,
        priority: -20,
      },
    },
  },
}
```

**分割策略**:

```
1. node_modules -> vendors.js (所有第三方库)
2. vue -> vue.js (Vue 框架单独文件)
3. 公共代码 -> common.js (被多次引用的模块)
4. 业务代码 -> main.js
```

### 3. Terser 压缩配置

```typescript
import TerserPlugin from 'terser-webpack-plugin';

optimization: {
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          // 移除 console.log 等
          drop_console: true,
          // 移除 debugger
          drop_debugger: true,
          // 移除特定的 console 方法
          pure_funcs: ['console.log', 'console.info'],
        },
        // 混淆变量名
        mangle: true,
        // 移除注释
        output: {
          comments: false,
        },
      },
    }),
  ],
}
```

### 4. CSS 压缩

```typescript
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

optimization: {
  minimizer: [
    // ... TerserPlugin
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    }),
  ],
}
```

### 5. 文件名哈希配置

```typescript
output: {
  // 使用 contenthash，确保文件内容变化才更改文件名
  filename: '[name].[contenthash:8].js',
  chunkFilename: '[name].[contenthash:8].chunk.js',
}
```

**哈希策略对比**:

| 策略 | 说明 | 缓存效果 |
|------|------|----------|
| `hash` | 每次构建都变化 | 差 |
| `chunkhash` | 同一 chunk 变化 | 中 |
| `contenthash` | 内容变化才变化 | 好 |

### 6. 模块 ID 优化

```typescript
optimization: {
  // 使用确定性模块 ID
  moduleIds: 'deterministic',
  // 使用确定性 chunk ID
  chunkIds: 'deterministic',
}
```

### 7. 文件系统缓存

```typescript
optimization: {
  cache: {
    type: 'filesystem', // 使用文件系统缓存
    buildDependencies: {
      // 配置文件变化时清除缓存
      config: [__filename],
    },
  },
}
```

### 8. Source Map 配置

```typescript
// 开发环境: 快速
devtool: 'eval-cheap-module-source-map',

// 生产环境: 完整但不增加体积
devtool: 'source-map',
```

## 依赖包说明

### 生产依赖

| 包名 | 版本 | 作用 |
|------|------|------|
| vue | ^3.5.13 | Vue3 核心库 |

### 开发依赖

| 包名 | 版本 | 作用 |
|------|------|------|
| @types/node | ^25.3.5 | Node.js 类型定义 |
| @vue/compiler-sfc | ^3.5.13 | Vue 单文件组件编译器 |
| css-loader | ^6.11.0 | 处理 CSS 文件 |
| css-minimizer-webpack-plugin | ^7.0.0 | CSS 压缩插件 |
| html-webpack-plugin | ^5.6.3 | 生成 HTML 文件 |
| mini-css-extract-plugin | ^2.9.2 | 提取 CSS 到单独文件 |
| sass | ^1.83.4 | Sass 编译器 |
| sass-loader | ^16.0.4 | 处理 Sass/SCSS 文件 |
| style-loader | ^4.0.0 | 处理 CSS 到 JS |
| terser-webpack-plugin | ^5.3.11 | JS 压缩和混淆插件 |
| ts-loader | ^9.5.1 | 处理 TypeScript 文件 |
| ts-node | ^10.9.2 | 运行 TypeScript 文件 |
| typescript | ^5.7.3 | TypeScript 编译器 |
| vue-loader | ^17.4.2 | 处理 Vue 单文件组件 |
| vue-style-loader | ^4.1.3 | 处理 Vue 组件样式 |
| webpack | ^5.97.1 | 核心打包工具 |
| webpack-bundle-analyzer | ^4.10.2 | 打包体积分析工具 |
| webpack-cli | ^5.1.4 | Webpack 命令行工具 |
| webpack-dev-server | ^5.2.0 | 开发服务器 |

## 实践步骤

### 1. 安装依赖

```bash
cd chapter11
pnpm install
```

### 2. 开发环境构建

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:8080
```

### 3. 生产环境构建

```bash
# 普通构建
pnpm build

# 查看构建产物
ls -la dist/
```

**构建产物结构**:

```
dist/
├── css/
│   ├── main.xxxxxxxx.css
│   └── vendors.xxxxxxxx.css
├── images/
├── js/
│   ├── common.xxxxxxxx.js
│   ├── main.xxxxxxxx.js
│   ├── runtime.js
│   ├── vendors.xxxxxxxx.js
│   └── vue.xxxxxxxx.js
├── index.html
└── remoteEntry.js (如果使用模块联邦)
```

### 4. 打包体积分析

```bash
# 使用 bundle analyzer 分析
pnpm analyze
```

这将自动打开浏览器，显示交互式的打包体积分析报告。

## 效果验证

### 优化前后对比

```
优化前:
  main.js: ~500KB (未压缩)

优化后:
  runtime.js:  ~4KB
  vendors.js: ~150KB (压缩后 ~45KB)
  vue.js:      ~100KB (压缩后 ~35KB)
  common.js:   ~10KB
  main.js:     ~50KB (压缩后 ~15KB)

  总计: ~314KB -> ~99KB (减少 68%)
```

### 二次构建速度

```
首次构建: ~5s
二次构建: ~0.5s (使用文件系统缓存)
```

### 浏览器缓存效果

```
首次访问: 下载所有文件
后续访问:
  - runtime.js   -> 命中缓存 (未变化)
  - vendors.js   -> 命中缓存 (未变化)
  - vue.js       -> 命中缓存 (未变化)
  - main.js      -> 重新下载 (业务代码变化)
```

## 注意事项

1. **哈希策略**: 生产环境必须使用 `contenthash`，否则无法实现长期缓存

2. **splitChunks 调优**: 根据实际项目调整 `minSize` 和 `maxSize`

3. **控制台移除**: `drop_console` 会移除所有 console，注意不要在生产环境保留调试代码

4. **缓存失效**: 修改 webpack 配置会清除缓存，这是正常现象

5. **Source Map**: 生产环境建议使用 `source-map`，不增加打包体积

## 进阶主题

### 1. 预取/预加载

```typescript
// 预取异步模块
const Component = () => import(/* webpackPrefetch: true */ './Component.vue');
```

### 2. 动态 publicPath

```typescript
output: {
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://cdn.example.com/'
    : '/',
}
```

### 3. 自定义压缩配置

```typescript
new TerserPlugin({
  parallel: true, // 启用多进程压缩
  extractComments: false,
})
```

### 4. 性能监控

```typescript
performance: {
  hints: 'warning',
  maxEntrypointSize: 512000,
  maxAssetSize: 512000,
}
```
