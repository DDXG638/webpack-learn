# 第1章：Webpack5 基础概念和配置结构

## 学习目标

1. 理解 Webpack 是什么以及核心理念
2. 掌握 Webpack5 的核心配置结构
3. 理解 entry、output、mode 等核心配置项
4. 能够运行和打包一个基本的 Webpack 项目

## 核心概念介绍

### 什么是 Webpack？

Webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**。当 Webpack 处理应用程序时，它会递归地构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成少量的bundle（通常只有一个），由浏览器加载。

### Webpack5 新特性

- **持久化缓存**：提升二次构建速度
- **模块联邦**：支持多应用共享模块
- **资源模块**：内置处理图片、字体等资源
- **更好的Tree Shaking**
- **零配置**

### 核心配置结构

```javascript
module.exports = {
  // 入口配置
  entry: './src/index.ts',

  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  // 模块规则
  module: {
    rules: [],
  },

  // 插件
  plugins: [],

  // 解析配置
  resolve: {
    extensions: [],
  },

  // 开发服务器
  devServer: {},

  // 模式
  mode: 'development',
};
```

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
| vue | Vue3 框架（也作为开发依赖） |
| @vue/compiler-sfc | Vue 单文件组件编译器 |
| vue-loader | 处理 .vue 文件的 Loader |
| typescript | TypeScript 支持 |
| ts-loader | 处理 TypeScript 文件的 Loader |
| css-loader | 处理 CSS 文件 |
| style-loader | 将 CSS 注入到 DOM |
| vue-style-loader | Vue 单文件组件样式热更新支持 |
| sass / sass-loader | SCSS/SASS 预处理器支持 |
| html-webpack-plugin | 生成 HTML 文件并自动注入 JS |

## Loader 说明

本章节使用了以下 Loader：

| Loader | 作用 |
|--------|------|
| vue-loader | 解析和编译 Vue 单文件组件(.vue文件) |
| ts-loader | 将 TypeScript 转换为 JavaScript |
| css-loader | 解析 CSS 文件中的 @import 和 url() |
| style-loader | 将 CSS 样式注入到页面的 `<style>` 标签中 |
| vue-style-loader | Vue 单文件组件的样式热更新（开发模式） |
| sass-loader | 编译 SCSS/SASS 文件为 CSS |

## Plugin 说明

本章节使用了以下 Plugin：

| Plugin | 作用 |
|--------|------|
| VueLoaderPlugin | Vue 单文件组件 Loader 的必需要插件，负责解析 .vue 文件 |
| HtmlWebpackPlugin | 自动生成 HTML 文件，并将打包后的 JS 文件自动引入到 HTML 中 |

## 关键配置解析

### entry（入口）

```javascript
entry: './src/main.ts'
```

指定 Webpack 的入口文件，Webpack 从这里开始递归地分析模块依赖。

### output（输出）

```javascript
output: {
  path: path.resolve(__dirname, 'dist'),  // 输出目录
  filename: '[name].js',  // 输出文件名
  clean: true,  // 打包前清除 dist 目录
}
```

- `[name]` - 入口名称
- `[contenthash]` - 文件内容哈希（用于缓存）
- `[hash]` - 构建哈希
- [更多替换模板字符串查看](https://www.webpackjs.com/configuration/output/#template-strings)

### mode（模式）

```javascript
mode: 'development'  // 或 'production'
```

- `development`：开发模式，保留调试信息
- `production`：生产模式，会进行压缩和优化

### resolve.extensions

```javascript
resolve: {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
}
```

自动解析这些扩展名，导入模块时可以省略扩展名。

## 实践步骤

1. **安装依赖**
   ```bash
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

4. **查看打包产物分析**
   观察 development 和 production 模式打包结果的差异：
   - development：代码不压缩，保留完整注释
   - production：代码压缩，体积更小

## 课后思考

1. Webpack 是如何实现模块化的？
2. 为什么 production 模式的打包结果比 development 模式小？
3. 如果不指定 entry，Webpack 默认会找什么文件？
