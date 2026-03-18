# 第10章：模块联邦（Module Federation）

## 学习目标

- 理解 Module Federation 的概念和原理
- 掌握 Host（主应用）和 Remote（远程应用）的配置
- 学会暴露和使用远程模块
- 理解共享依赖的配置
- 掌握微前端架构的实践方式

## 核心概念介绍

### 1. 什么是 Module Federation？

Module Federation 是 Webpack 5 引入的核心特性，允许**一个构建产物直接引用另一个构建产物中的模块**，无需通过 npm 包的方式进行分发。

```
传统方式:
  App A ──► npm publish ──► App B (需要重新安装)

模块联邦:
  App A ──► 直接引用 ──► App B (运行时加载)
```

### 2. 架构模式

```
┌─────────────────────────────────────────────────────────────────┐
│                      Module Federation                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐           ┌──────────────────┐         │
│   │   Host 应用      │           │   Remote 应用    │         │
│   │                  │           │                  │         │
│   │  端口: 3000      │  ──────►  │  端口: 3001      │         │
│   │                  │   消费    │                  │         │
│   │  角色: 消费者    │           │  角色: 提供者    │         │
│   │                  │           │                  │         │
│   │  - ./Button      │           │  暴露:           │         │
│   │  - ./Header      │           │  - ./Button      │         │
│   │  - ./Counter     │           │  - ./Header      │         │
│   │                  │           │  - ./Counter    │         │
│   └──────────────────┘           └──────────────────┘         │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                      共享依赖                            │   │
│   │                                                         │   │
│   │   Vue ────── 只加载一次 ──────► Host + Remote 共享    │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. 核心配置

#### 3.1 Remote 应用配置（提供者）

```typescript
// webpack.remote.config.ts
new ModuleFederationPlugin({
  name: 'remoteApp',                    // 应用名称
  filename: 'remoteEntry.js',           // 入口文件名

  // 暴露的模块
  exposes: {
    './Button': './src/components/Button.vue',
    './Header': './src/components/Header.vue',
    './Counter': './src/components/Counter.vue',
    './utils': './src/utils/shared.ts',
  },

  // 共享依赖
  shared: {
    vue: {
      singleton: true,                  // 只加载一次
      requiredVersion: '^3.5.0',        // 版本要求
    },
  },
});
```

#### 3.2 Host 应用配置（消费者）

```typescript
// webpack.host.config.ts
new ModuleFederationPlugin({
  name: 'host',

  // 远程模块列表
  remotes: {
    // 格式: 别名 @ 远程域名 / remoteEntry.js
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
  },

  // 共享依赖
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.5.0',
    },
  },
});
```

#### 3.3 动态导入远程模块

```typescript
// 方式1: 静态导入（推荐）
import Button from 'remoteApp/Button';
import Header from 'remoteApp/Header';
import { formatDate } from 'remoteApp/utils';

// 方式2: 动态导入
const Button = await import('remoteApp/Button');
```

### 4. 共享依赖配置

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `singleton` | 是否只加载一次 | `true` |
| `requiredVersion` | 版本要求 | `^3.5.0` |
| `eager` | 是否立即加载 | `false` |

#### 版本匹配规则

```
requiredVersion: '^3.5.0' 匹配:
  ✓ 3.5.0, 3.5.1, 3.6.0
  ✗ 4.0.0, 2.0.0
```

### 5. 关键概念

#### 5.1 Host vs Remote

| 角色 | 说明 | 配置关键 |
|------|------|----------|
| **Host** | 消费远程模块的应用 | `remotes` |
| **Remote** | 提供远程模块的应用 | `exposes` |

#### 5.2 异步组件

对于远程模块，建议使用异步加载：

```typescript
import { defineAsyncComponent } from 'vue';

const RemoteButton = defineAsyncComponent(() =>
  import('remoteApp/Button')
);
```

### 6. 应用场景

1. **微前端架构**：多个团队独立开发、部署
2. **组件库共享**：公司级组件库直接引用
3. **多页面应用**：多个应用共享公共模块
4. **插件系统**：运行时加载插件

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
| concurrently | ^9.1.2 | 并行运行多个命令 |
| css-loader | ^6.11.0 | 处理 CSS 文件 |
| html-webpack-plugin | ^5.6.3 | 生成 HTML 文件 |
| mini-css-extract-plugin | ^2.9.2 | 提取 CSS 到单独文件 |
| sass | ^1.83.4 | Sass 编译器 |
| sass-loader | ^16.0.4 | 处理 Sass/SCSS 文件 |
| style-loader | ^4.0.0 | 处理 CSS 到 JS |
| ts-loader | ^9.5.1 | 处理 TypeScript 文件 |
| ts-node | ^10.9.2 | 运行 TypeScript 文件 |
| typescript | ^5.7.3 | TypeScript 编译器 |
| vue-loader | ^17.4.2 | 处理 Vue 单文件组件 |
| webpack | ^5.97.1 | 核心打包工具 |
| webpack-cli | ^5.1.4 | Webpack 命令行工具 |
| webpack-dev-server | ^5.2.0 | 开发服务器 |

## 关键配置解析

### Remote 应用完整配置

```typescript
// webpack.remote.config.ts
import { ModuleFederationPlugin } from 'webpack';

export default {
  name: 'remoteApp',

  output: {
    publicPath: 'auto',  // 必须设置为 auto
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',

      exposes: {
        './Button': './src/components/Button.vue',
        './Header': './src/components/Header.vue',
      },

      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.5.0',
        },
      },
    }),
  ],

  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
};
```

### Host 应用完整配置

```typescript
// webpack.host.config.ts
import { ModuleFederationPlugin } from 'webpack';

export default {
  name: 'host',

  output: {
    publicPath: 'auto',
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'host',

      remotes: {
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
      },

      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.5.0',
        },
      },
    }),
  ],

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
};
```

### 在 Vue 组件中使用远程模块

```vue
<template>
  <!-- 静态导入 -->
  <Button text="点击" @click="handleClick" />
  <Header title="标题" />
  <Counter />
</template>

<script setup lang="ts">
import Button from 'remoteApp/Button';
import Header from 'remoteApp/Header';
import Counter from 'remoteApp/Counter';
import { formatDate } from 'remoteApp/utils';

// 或者动态导入
const Button = defineAsyncComponent(() =>
  import('remoteApp/Button')
);
</script>
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter10
pnpm install
```

### 2. 同时启动 Host 和 Remote

```bash
# 方式1: 使用 concurrently 并行启动
pnpm start

# 方式2: 分别启动
pnpm dev:host   # 启动 Host 应用 (端口 3000)
pnpm dev:remote # 启动 Remote 应用 (端口 3001)
```

### 3. 访问应用

- Host 应用: http://localhost:3000
- Remote 应用: http://localhost:3001

### 4. 生产环境构建

```bash
# 构建 Host
pnpm build:host

# 构建 Remote
pnpm build:remote
```

## 效果验证

### 开发环境

- Host 应用展示远程加载的组件
- Counter 组件可以正常计数
- Header 组件正常显示
- 工具函数正常调用

### 模块加载流程

```
1. Host 加载 remoteEntry.js (远程入口)
2. Host 根据需要加载具体模块 (Button.js, Header.js)
3. 如果 Vue 未加载, 先加载共享依赖
4. 渲染组件
```

## 注意事项

1. **publicPath 必须为 'auto'**: 确保远程模块能正确加载
2. **版本兼容**: 确保 Host 和 Remote 的共享依赖版本兼容
3. **异步加载**: 远程模块建议使用异步导入
4. **类型声明**: 需要在 env.d.ts 中添加模块类型声明
5. **独立部署**: Remote 可以独立部署，不影响 Host

## 进阶主题

### 1. 动态 publicPath

```typescript
// 根据域名动态设置
publicPath: process.env.NODE_ENV === 'production'
  ? 'https://cdn.example.com/'
  : 'auto',
```

### 2. 多个 Remote

```typescript
remotes: {
  remoteApp1: 'remoteApp1@http://localhost:3001/remoteEntry.js',
  remoteApp2: 'remoteApp2@http://localhost:3002/remoteEntry.js',
},
```

### 3. 共享 React

```typescript
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',
  },
  'react-dom': {
    singleton: true,
    requiredVersion: '^18.0.0',
  },
},
```

### 4. 防止版本冲突

```typescript
shared: {
  vue: {
    singleton: true,
    requiredVersion: '^3.5.0',
    strictVersion: true,  // 严格版本匹配
  },
},
```
