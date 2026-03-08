# Webpack5 开发环境配置

## 章节学习目标

1. 掌握 webpack-dev-server 的配置和使用
2. 理解热模块替换(HMR)原理
3. 掌握 Source Map 配置
4. 学会配置开发代理
5. 了解开发环境最佳实践

## 核心概念介绍

### webpack-dev-server

webpack-dev-server 是 Webpack 官方提供的开发服务器，提供以下功能：

- **本地开发服务器**：在本地启动一个 HTTP 服务器
- **自动刷新**：文件变化时自动刷新浏览器
- **热模块替换(HMR)**：模块变化时无需刷新整个页面
- **代理配置**：解决跨域问题

### 热模块替换 (HMR)

HMR 是 Webpack 最强大的特性之一，允许在运行时替换、添加或删除模块，而无需完全刷新页面。

**工作原理**：
1. Webpack 监听文件变化
2. 文件变化时，Webpack 增量编译
3. 通过 WebSocket 或 HRM 协议通知客户端
4. 客户端根据更新信息决定如何处理（刷新或替换模块）

**HMR 支持条件**：
- Webpack 5 内置支持
- 框架loader内置支持（vue-loader, react-hot-loader等）
- 需要在配置中启用 `hot: true`

### Source Map

Source Map 是源代码与编译后代码的映射关系，方便调试。

**常用配置**：

| 值 | 作用 | 构建速度 | 适用场景 |
|----|------|---------|---------|
| `eval` | 每个模块使用 eval 执行 | 最快 | 开发 |
| `eval-source-map` | 使用 eval，生成 source map | 较快 | 开发（推荐） |
| `cheap-eval-source-map` | 便宜版 eval-source-map | 最快 | 开发 |
| `source-map` | 生成独立的 .map 文件 | 最慢 | 生产 |
| `hidden-source-map` | 生成 map 但不引用 | 较慢 | 生产 |
| `inline-source-map` | 嵌入到 bundle 中 | 较慢 | 开发 |

**推荐配置**：
```javascript
// 开发环境
devtool: 'eval-source-map'

// 生产环境
devtool: 'source-map'
```

### 开发代理配置

解决开发环境中的跨域问题：

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

**配置说明**：
- `target`：代理目标服务器
- `changeOrigin`：修改请求头中的 Origin
- `secure`：是否验证 SSL 证书

## 依赖包说明

### 开发依赖

| 包名 | 作用 |
|------|------|
| webpack | 核心打包工具 |
| webpack-cli | 命令行工具 |
| webpack-dev-server | 开发服务器 |
| vue | Vue3 核心库 |
| @vue/compiler-sfc | Vue 单文件组件编译器 |
| vue-loader | Vue 组件加载器 |
| ts-loader | TypeScript 加载器 |
| typescript | TypeScript 语言 |
| css-loader/style-loader/sass-loader | CSS/SCSS 处理 |
| html-webpack-plugin | HTML 插件 |
| mini-css-extract-plugin | CSS 提取插件 |

## 关键配置解析

### webpack-dev-server 核心配置

```typescript
devServer: {
  // 静态文件目录
  static: {
    directory: path.join(__dirname, 'public'),
  },

  // 端口号
  port: 8080,

  // 自动打开浏览器
  open: true,

  // 热模块替换
  hot: true,

  // gzip 压缩
  compress: true,

  // 代理配置
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },

  // SPA 路由支持
  historyApiFallback: true,

  // 错误遮罩层
  client: {
    overlay: {
      errors: true,
      warnings: false,
    },
    progress: true,
  },
}
```

### Source Map 配置

```typescript
// 开发环境：快速构建，支持断点调试
devtool: 'eval-source-map',

// 生产环境：生成独立 map 文件
devtool: 'source-map',
```

### 缓存配置

```typescript
cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename],
  },
},
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter04
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
# 或
pnpm start
```

访问 http://localhost:8080 查看效果

### 3. 体验热模块替换

1. 修改 App.vue 中的内容
2. 观察浏览器自动更新，无需刷新整个页面

### 4. 测试 Source Map

1. 打开浏览器开发者工具
2. 在 Sources 面板中查看原始源代码
3. 设置断点进行调试

### 5. 配置代理

在 devServer.proxy 中配置 API 代理，解决跨域问题

### 6. 生产构建

```bash
pnpm build
```

## 课后思考答案

#### 1. webpack-dev-server 和 webpack --watch 有什么区别？

| 特性 | webpack-dev-server | webpack --watch |
|------|-------------------|-----------------|
| 文件变化 | 自动刷新浏览器 | 重新构建 |
| HMR 支持 | 支持 | 不支持 |
| HTTP 服务器 | 内置 | 需配合其他工具 |
| 内存构建 | 是 | 否（写入磁盘） |
| 开发体验 | 更好 | 一般 |

#### 2. HMR 的工作原理

1. **监听文件变化**：Webpack 监听入口文件和所有依赖文件
2. **增量编译**：只编译变化的模块及其依赖
3. **通知客户端**：通过 WebSocket 发送更新信息
4. **模块替换**：
   - CSS：直接替换，无需刷新
   - JS：检查模块是否支持 HMR，支持则替换，不支持则刷新

#### 3. 如何选择合适的 Source Map 类型

**开发环境**：
- 推荐 `eval-source-map` 或 `cheap-module-eval-source-map`
- 平衡构建速度和调试体验

**生产环境**：
- 推荐 `source-map` 或 `hidden-source-map`
- 优先考虑构建速度和安全性

#### 4. 开发代理的实现原理

1. 开发服务器作为中间服务器
2. 浏览器请求发送到开发服务器
3. 开发服务器转发请求到目标服务器
4. 目标服务器响应后，开发服务器返回给浏览器

这样避免了浏览器直接请求后端导致的跨域问题。

## 参考资料

- [webpack-dev-server 文档](https://webpack.js.org/configuration/dev-server/)
- [HMR 概念](https://webpack.js.org/concepts/hot-module-replacement/)
- [Source Map](https://webpack.js.org/configuration/devtool/)
