# 第6章：代码分割和动态导入

## 学习目标

- 理解代码分割的概念和意义
- 掌握 splitChunks 基础配置
- 掌握动态导入 import() 的使用
- 理解 Chunk 命名和分块策略
- 实现路由级代码分割

## 核心概念介绍

### 什么是代码分割？

代码分割（Code Splitting）是 Webpack 的一项重要优化技术，它允许我们将代码分割成多个独立的 chunk（代码块），实现按需加载。这可以：

1. **减少初始加载时间**：只加载首屏需要的代码
2. **提高缓存利用率**：修改代码时只影响对应的 chunk
3. **并行加载**：多个 chunk 可以并行下载

### 代码分割的两种方式

1. **同步分割**：在配置中通过 `splitChunks` 设置
2. **异步分割**：通过动态导入 `import()` 实现

## 依赖包说明

### 生产依赖

| 包名 | 作用 |
|------|------|
| vue | Vue3 核心库 |
| vue-router | Vue 路由管理 |

### 开发依赖

| 包名 | 作用 |
|------|------|
| webpack | 打包工具 |
| webpack-cli | Webpack 命令行工具 |
| webpack-dev-server | 开发服务器 |
| vue-loader | Vue 单文件组件加载器 |
| @vue/compiler-sfc | Vue 单文件组件编译器 |
| ts-loader | TypeScript 加载器 |
| ts-node | TypeScript 执行环境 |
| typescript | TypeScript 语言 |
| css-loader | CSS 加载器 |
| style-loader | CSS 样式注入 |
| sass-loader | SCSS 编译 |
| sass | SCSS 语法支持 |
| html-webpack-plugin | HTML 模板插件 |
| mini-css-extract-plugin | CSS 提取插件 |
| webpack-bundle-analyzer | 打包分析工具 |

## 关键配置解析

### splitChunks 配置

```typescript
optimization: {
  splitChunks: {
    chunks: 'all', // 分割所有代码（同步+异步）
    minSize: 20000, // 最小体积（字节）
    maxSize: 244000, // 最大体积
    cacheGroups: {
      // 提取 node_modules
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -10,
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

### 动态导入

#### 1. 路由级代码分割

```typescript
// 路由配置中使用动态导入
const ProductList = () => import(/* webpackChunkName: "product-list" */ '@/pages/ProductList.vue');
const ProductDetail = () => import(/* webpackChunkName: "product-detail" */ '@/pages/ProductDetail.vue');
```

#### 2. Vue 异步组件（用于非路由场景）

```typescript
import { defineAsyncComponent } from 'vue';

// 使用 defineAsyncComponent 实现组件的异步加载
const CartModal = defineAsyncComponent(() =>
  import(/* webpackChunkName: "cart" */ '@/components/CartModal.vue')
);
```

> **注意**：`import()` 中的 `/* webpackChunkName: "xxx" */` 是 Webpack 的魔法注释，用于指定分割后的 chunk 文件名。

### runtimeChunk 配置

```typescript
// 将 webpack 运行时代码抽取到单独文件
runtimeChunk: 'single'
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter06
pnpm install
```

### 2. 开发模式运行

```bash
pnpm dev
```

访问 http://localhost:8080 查看效果。

### 3. 构建生产版本

```bash
pnpm build
```

### 4. 分析打包结果

```bash
pnpm analyze
```

这将生成一个可视化的打包报告，帮助你理解代码分割效果。

## Demo 效果说明

### 商品列表页面

- 展示商品卡片列表
- 点击商品卡片进入详情页
- 点击"加入购物车"按钮会动态加载购物车组件

### 商品详情页面

- 展示商品详细信息
- 点击"加入购物车"按钮打开购物车弹窗

### 购物车弹窗

- **关键演示点**：这个组件使用动态导入实现代码分割
- 只有当用户点击"加入购物车"按钮时，才会加载购物车组件代码
- 在 Network 面板中可以看到动态加载的 chunk 文件

## 打包文件分析

运行 `pnpm build` 后，dist 目录会包含：

```
dist/
├── index.html
├── css/
│   └── ... (样式文件)
├── js/
│   ├── main.js           # 主应用代码
│   ├── vendors.js        # node_modules 代码
│   ├── vue-vendor.js     # Vue 框架代码
│   ├── common.js         # 公共代码
│   ├── runtime.js        # webpack 运行时代码 (production)
│   ├── product-list.chunk.js   # 商品列表页面 (异步)
│   ├── product-detail.chunk.js # 商品详情页面 (异步)
│   └── cart.chunk.js     # 购物车组件 (异步)
└── assets/
    └── ... (图片等资源)
```

## 课后思考

1. **为什么要使用代码分割？** 不使用代码分割有什么缺点？

2. **splitChunks 的 `chunks` 选项有哪些值？它们有什么区别？**

3. **动态导入 `import()` 和同步导入有什么区别？分别适用什么场景？**

4. **什么是路由级代码分割？它有什么优点？**

5. **为什么建议将 Vue 框架代码单独分割到一个 chunk 中？**

6. **runtimeChunk 的作用是什么？设置为 'single' 和 'multiple' 有什么区别？**

## 答案提示

1. 代码分割可以减少首屏加载时间、提高缓存利用率、支持并行加载。不使用会导致所有代码打包到一个文件中，首屏加载慢。

2. `chunks` 选项：
   - `'all'`: 分割所有代码
   - `'async'`: 只分割异步代码（动态导入）
   - `'initial'`: 只分割同步代码

3. 动态导入在调用时才加载，同步导入在初始加载时全部加载。动态导入适合按需加载的场景，如路由、弹窗等。

4. 路由级代码分割是指每个路由页面使用动态导入，实现按路由加载。优点是首屏只加载当前路由的代码。

5. Vue 框架代码体积大、更新频率低，单独分割可以利用浏览器长期缓存。

6. runtimeChunk 将 Webpack 的运行时代码抽取到独立文件，可以避免业务代码变化导致整个文件失效。'single' 为所有入口共享一个 runtime，'multiple' 为每个入口生成独立的 runtime。
