# 第2章：Webpack5 Loader 机制和使用

## 学习目标

1. 理解 Loader 的工作原理
2. 掌握常用 Loader 的配置和使用
3. 理解 Loader 的执行顺序
4. 掌握 Babel、TypeScript、CSS、SCSS 等 Loader 的实际应用

## 核心概念介绍

### 什么是 Loader？

Loader 是 Webpack 的**文件转换器**。它用于对模块的源代码进行转换。Webpack 本身只理解 JavaScript，而 Loader 可以将其他类型的文件转换为 Webpack 能够处理的模块。

### Loader 的工作原理

```
Source File (源文件)  →  Loader  →  JavaScript Module (JS模块)
```

Loader 本质上是一个函数，接收源文件内容作为参数，返回转换后的结果。

### Loader 的配置方式

1. **配置方式**（推荐）：在 `module.rules` 中配置
2. **内联方式**：在 import 语句中直接指定
3. **CLI 方式**：通过命令行指定

### Loader 的执行顺序

Webpack 4+ 中，Loader 的执行顺序遵循以下规则：

- **use 数组**：**从右到左**执行（类似函数组合）
- **enforce**：
  - `pre`：优先执行
  - `normal`：普通执行（默认）
  - `post`：最后执行

## 依赖包说明

### 生产依赖

| 包名 | 作用 |
|------|------|
| vue | Vue3 核心库 |

### 开发依赖

| 包名 | 作用 |
|------|------|
| webpack | 核心打包工具 |
| webpack-cli | 命令行工具 |
| webpack-dev-server | 开发服务器 |
| @vue/compiler-sfc | Vue 单文件组件编译器 |
| vue-loader | 处理 .vue 文件的 Loader |
| typescript | TypeScript 支持 |
| ts-loader | 处理 TypeScript 文件的 Loader |
| @babel/core | Babel 核心库 |
| @babel/preset-env | Babel ES6+ 转换预设 |
| babel-loader | 处理 JavaScript 文件的 Loader |
| css-loader | 处理 CSS 文件中的 @import 和 url() |
| style-loader | 将 CSS 注入到 DOM |
| vue-style-loader | Vue 单文件组件样式热更新支持 |
| sass / sass-loader | SCSS/SASS 预处理器支持 |
| file-loader | 处理文件资源（Webpack5 推荐使用 Asset Modules） |
| url-loader | 处理文件为 Base64（Webpack5 推荐使用 Asset Modules） |
| raw-loader | 将文件作为字符串加载（Webpack5 推荐使用 asset/source） |
| html-webpack-plugin | 生成 HTML 文件并自动注入 JS |

## Loader 说明

本章节使用了以下 Loader：

| Loader | 作用 |
|--------|------|
| vue-loader | 解析和编译 Vue 单文件组件(.vue文件) |
| ts-loader | 将 TypeScript 转换为 JavaScript |
| babel-loader | 将 ES6+ 语法转换为 ES5 |
| css-loader | 解析 CSS 文件中的 @import 和 url() |
| style-loader | 将 CSS 样式注入到页面的 `<style>` 标签中 |
| sass-loader | 编译 SCSS/SASS 文件为 CSS |
| asset/source (原 raw-loader) | 将文件作为原始字符串导入 |

### Loader 类型说明

#### 1. ts-loader
- 将 TypeScript 转换为 JavaScript
- `transpileOnly: true` 开启快速编译，跳过类型检查

#### 2. babel-loader
- 使用 `@babel/preset-env` 将 ES6+ 转换为 ES5
- `cacheDirectory: true` 开启缓存，提升二次构建速度

#### 3. css-loader
- 解析 CSS 文件中的 `@import` 和 `url()`
- 将 CSS 转换为 Webpack 理解的模块

#### 4. style-loader
- 将 CSS 注入到页面的 `<style>` 标签中
- 必须与 css-loader 配合使用

#### 5. sass-loader
- 编译 SCSS/SASS 为 CSS
- 需要配合 sass 包使用

#### 6. Asset Modules (Webpack5)
Webpack5 引入了资源模块替代传统的 file-loader 和 url-loader：

| 类型 | 说明 | 替代 |
|------|------|------|
| asset/source | 输出原始内容 | raw-loader |
| asset/resource | 输出为单独文件 | file-loader |
| asset | 根据大小自动选择 | url-loader |

## 关键配置解析

### Loader 链式执行

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',   // 最后执行：将 CSS 注入 DOM
    'css-loader',     // 中间执行：解析 CSS
    'sass-loader'     // 最先执行：编译 SCSS
  ]
}
```

### Asset Modules 配置

```javascript
{
  test: /\.(png|jpe?g|gif|svg)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024  // 小于 8KB 转为 Base64
    }
  }
}
```

### Babel 配置

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      cacheDirectory: true
    }
  }
}
```

## 实践步骤

1. **安装依赖**
   ```bash
   cd chapter02
   pnpm install
   ```

2. **开发模式运行**
   ```bash
   pnpm dev
   ```
   访问 http://localhost:8080 查看效果

3. **生产模式打包**
   ```bash
   pnpm build
   ```
   查看 dist 目录下的打包产物

4. **观察 Loader 效果**
   - 打开浏览器控制台查看 ES6+ 语法转换
   - 查看网络请求中图片的加载方式（Base64 vs 文件）
   - 查看打包后的 CSS 是否正确合并

## 课后思考

1. Loader 的执行顺序是怎样的？如何控制 Loader 的执行优先级？
2. Webpack5 的 Asset Modules 与传统的 file-loader/url-loader 有什么区别？
3. 为什么 sass-loader 需要放在 Loader 链的最后（靠近源文件）？
4. Babel 的 `cacheDirectory` 选项有什么作用？
