# 第12章：综合实战

## 学习目标

- 掌握多页面应用的配置
- 学会使用 Pinia 进行状态管理
- 掌握 Vue Router 多路由配置
- 理解 Babel 转译配置
- 掌握 PostCSS 自动添加 CSS 前缀
- 学会配置 CDN 模式构建

## 项目概述

本项目是一个基于 Vue3 + Pinia + Vue Router 的完整应用，展示了 Webpack5 的最佳实践配置。

## 核心功能

### 1. 多页面路由
- 首页：项目介绍和功能展示
- 关于页：技术栈和配置说明
- 用户页：用户管理（使用 Pinia 状态管理）

### 2. 状态管理
使用 Pinia 管理用户数据：
- 用户列表
- 当前选中用户
- 增删改查操作

### 3. Babel 转译
```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead'],
      },
      modules: false,
    }],
  ],
};
```

### 4. PostCSS 配置
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
      ],
    },
  },
};
```

### 5. CDN 模式构建
```bash
pnpm build:cdn
```

通过 `externals` 将 Vue、Vue Router、Pinia 外部化，从 CDN 加载。

## 依赖包说明

### 生产依赖
| 包名 | 版本 | 作用 |
|------|------|------|
| vue | ^3.5.13 | Vue3 核心库 |
| vue-router | ^4.5.0 | 路由管理 |
| pinia | ^2.3.1 | 状态管理 |

### 开发依赖
| 包名 | 版本 | 作用 |
|------|------|------|
| @babel/core | ^7.26.9 | Babel 核心 |
| @babel/preset-env | ^7.26.9 | Babel 预设 |
| @types/node | ^25.3.5 | Node.js 类型 |
| @vue/compiler-sfc | ^3.5.13 | Vue 编译器 |
| autoprefixer | ^10.4.21 | CSS 前缀自动添加 |
| babel-loader | ^10.0.0 | Babel 加载器 |
| css-loader | ^6.11.0 | CSS 处理 |
| css-minimizer-webpack-plugin | ^7.0.0 | CSS 压缩 |
| html-webpack-plugin | ^5.6.3 | HTML 生成 |
| mini-css-extract-plugin | ^2.9.2 | CSS 提取 |
| postcss | ^8.5.3 | CSS 后处理 |
| postcss-loader | ^8.1.1 | PostCSS 加载器 |
| sass | ^1.83.4 | Sass 编译器 |
| sass-loader | ^16.0.4 | Sass 加载器 |
| style-loader | ^4.0.0 | 样式处理 |
| terser-webpack-plugin | ^5.3.11 | JS 压缩 |
| ts-loader | ^9.5.1 | TypeScript 加载器 |
| ts-node | ^10.9.2 | TS 运行 |
| typescript | ^5.7.3 | TypeScript |
| vue-loader | ^17.4.2 | Vue 组件加载 |
| webpack | ^5.97.1 | 打包工具 |
| webpack-bundle-analyzer | ^4.10.2 | 打包分析 |
| webpack-cli | ^5.1.4 | 命令行工具 |
| webpack-dev-server | ^5.2.0 | 开发服务器 |

## 关键配置解析

### 1. Babel + TypeScript 联合配置

```typescript
{
  test: /\.tsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not dead'],
            },
          }],
        ],
      },
    },
    'ts-loader',
  ],
}
```

### 2. PostCSS 配置

```typescript
{
  test: /\.scss$/,
  use: [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    'postcss-loader',  // 自动添加 CSS 前缀
    'sass-loader',
  ],
}
```

### 3. CDN 模式配置

```typescript
// CDN 链接
const cdnUrls = {
  vue: 'https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js',
  vueRouter: 'https://unpkg.com/vue-router@4.5.0/dist/vue-router.global.prod.js',
  pinia: 'https://unpkg.com/pinia@2.3.1/dist/pinia.iife.prod.js',
};

// 外部化依赖
externals: useCdn ? {
  vue: 'Vue',
  vueRouter: 'VueRouter',
  pinia: 'Pinia',
} : {}

// HTML 中注入 CDN 脚本
new HtmlWebpackPlugin({
  // ...
  cdn: {
    js: [cdnUrls.vue, cdnUrls.vueRouter, cdnUrls.pinia],
  },
})
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter12
pnpm install
```

### 2. 开发环境

```bash
pnpm dev
# 访问 http://localhost:8080
```

### 3. 生产环境构建

```bash
# 普通构建
pnpm build

# CDN 模式构建（Vue 从 CDN 加载）
pnpm build:cdn
```

### 4. 打包分析

```bash
pnpm build:analyze
```

## 构建产物对比

### 普通构建
```
dist/
├── css/
│   └── main.xxxxxxxx.css
├── js/
│   ├── common.xxxxxxxx.js
│   ├── main.xxxxxxxx.js
│   ├── runtime.js
│   └── vendors.xxxxxxxx.js
└── index.html
```

### CDN 模式构建
```
dist/
├── css/
│   └── main.xxxxxxxx.css
├── js/
│   ├── main.xxxxxxxx.js
│   └── runtime.js
└── index.html
```

CDN 模式下不包含 Vue、Vue Router、Pinia，需要从 CDN 加载。

## 效果验证

### 开发环境
- 页面正常显示
- 路由切换正常
- Pinia 状态管理正常
- 热更新生效

### 生产环境
- 代码压缩生效
- CSS 前缀自动添加
- Tree Shaking 生效
- CDN 模式可正常加载

## 注意事项

1. **Babel 缓存**: 开启 `cacheDirectory` 加速二次构建
2. **CDN 模式**: 仅在生产环境使用，开发环境使用本地依赖
3. **PostCSS**: 需要在 loader 中正确配置顺序
4. **Vue alias**: 确保指向正确的 ESM 版本
