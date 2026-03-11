# 第7章：Tree-Shaking 和模块合并

## 学习目标

- 理解 Tree-Shaking 的原理和工作机制
- 掌握 sideEffects 配置的作用和使用方法
- 理解模块合并（Scope Hoisting）的概念和效果
- 学会使用产物分析工具优化代码

## 核心概念介绍

### 1. Tree-Shaking（摇树优化）

Tree-Shaking 是 Webpack 5 的一个重要优化特性，基于 ES Module 的静态分析特性，在编译时确定哪些导出被实际使用，从而移除未使用的代码（dead code）。

**工作原理：**
- Webpack 分析模块的导入和导出
- 标记所有被使用的导出（used exports）
- 在生产模式下删除未使用的导出

**生效条件：**
- 必须是 production 模式
- 使用 ES Module 语法（import/export）
- 在 package.json 中正确配置 sideEffects

### 2. sideEffects 配置

sideEffects 用于告诉 Webpack 哪些模块是"纯净的"（没有副作用），哪些模块不应该被 Tree-Shaking 移除。

```json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

表示 CSS 和 SCSS 文件有副作用，不应该被移除。

### 3. Scope Hoisting（模块合并）

Scope Hoisting 将多个模块合并到单个函数中，减少函数闭包数量，提升执行效率并减小包体积。

**优势：**
- 减少函数声明，提升执行效率
- 减小包体积（消除模块包装代码）
- 更好的代码优化

### 4. 产物分析工具

使用 webpack-bundle-analyzer 可视化分析打包产物，帮助识别可以优化的部分。

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
| html-webpack-plugin | ^5.6.3 | 生成 HTML 文件 |
| mini-css-extract-plugin | ^2.9.2 | 提取 CSS 到单独文件 |
| sass | ^1.83.4 | Sass 编译器 |
| sass-loader | ^16.0.4 | 处理 Sass/SCSS 文件 |
| style-loader | ^4.0.0 | 处理 CSS 到 JS |
| ts-loader | ^9.5.1 | 处理 TypeScript 文件 |
| ts-node | ^10.9.2 | 运行 TypeScript 文件 |
| typescript | ^5.7.3 | TypeScript 编译器 |
| vue-loader | ^17.4.2 | 处理 Vue 单文件组件 |
| vue-style-loader | ^4.1.3 | Vue 样式加载器 |
| webpack | ^5.97.1 | 核心打包工具 |
| webpack-bundle-analyzer | ^4.10.2 | 打包产物分析工具 |
| webpack-cli | ^5.1.4 | Webpack 命令行工具 |
| webpack-dev-server | ^5.2.0 | 开发服务器 |

## 关键配置解析

### webpack.config.ts

```typescript
// Tree-Shaking 配置
optimization: {
  // 标记未使用的导出
  usedExports: true,

  // 开启模块合并（Scope Hoisting）
  concatenateModules: true,

  // 最小化删除未使用的导出
  minimize: isProduction,
}
```

### usedExports 的效果对比

以 Vue3 项目为例，配置 `usedExports: true` 前后的差异：

| 配置 | @vue/runtime-core | 其他 vendors | 总计 |
|------|------------------|--------------|------|
| `usedExports: false` | ~74 KB | ~63 KB | ~137 KB |
| `usedExports: true` | ~39 KB | ~25 KB | ~64 KB |
| **差异** | **-47%** | **-60%** | **-53%** |

这是因为 Webpack 会分析实际使用的 API，未使用的代码会被 Tree-Shaking 删除。

### Vue 依赖分割的注意事项

在第6章中我们学习了将 Vue 相关的依赖单独分割，但需要注意：

- **问题**：随着项目迭代，会使用越来越多的 Vue API，每次打包内容都会变化，导致 contentHash 也变化，缓存失效
- **建议**：对于应用开发，建议将所有 node_modules 打成稳定的单个体积，反而更容易命中缓存

```javascript
// 推荐做法：简单稳定
cacheGroups: {
  vendors: {
    test: /[\\/]node_modules[\\/]/,
    name: 'vendors',
  },
}
```

### package.json（可选配置）

```json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

`sideEffects` 配置是可选的，用于告诉 Webpack 哪些文件有副作用不应该被 Tree-Shaking 移除。

**说明**：
- 对于现代 Vue 项目，Vue-loader 已经内置了对组件样式的处理，可以不配置 sideEffects
- 如果项目中有通过 import 引入的 CSS/SCSS 文件，建议配置以确保样式不会被 Tree-Shaking 移除

## 实践步骤

### 1. 安装依赖

```bash
cd chapter07
pnpm install
```

### 2. 开发环境运行

```bash
npm run dev
```

观察打包结果，每个模块独立打包，包含完整注释。

### 3. 生产环境打包

```bash
npm run build
```

查看 dist 目录，对比打包结果：
- 未使用的函数被移除
- 模块被合并（Scope Hoisting）
- 代码被压缩

### 4. 分析打包产物

```bash
npm run analyze
```

打开 bundle-report.html 文件，可视化查看打包产物组成。

### 5. 对比差异

1. 查看 `dist/main.js` 文件内容
2. 找到 `calculate.ts` 中未被使用的函数（如 `add`、`multiply`、`divide`）
3. 确认这些函数在生产打包后已被移除
4. 观察模块是否被合并到单个函数中

## 效果验证

### 开发环境 (development)
- 模块独立打包，每个模块有自己的作用域
- 代码包含注释和调试信息
- 未使用的代码不会被移除
- 模块合并（Scope Hoisting）禁用

### 生产环境 (production)
- 启用 Tree-Shaking，移除未使用的代码
- 启用 Scope Hoisting，合并模块
- 代码压缩混淆
- 生成 contenthash 用于缓存

## 注意事项

1. **Tree-Shaking 只在 production 模式生效**：开发模式下所有代码都会保留以便调试。

2. **需要使用 ES Module**：CommonJS 模块无法进行 Tree-Shaking。

3. **正确配置 sideEffects**：如果错误标记有副作用的模块为无副作用，会导致样式丢失等问题。

4. **动态导入与 Tree-Shaking**：动态导入的模块默认不会被 Tree-Shaking 影响。

5. **第三方库**：大多数现代库（如 lodash-es）都支持 Tree-Shaking，使用时注意导入方式。
