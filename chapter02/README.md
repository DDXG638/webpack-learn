# 第2章：Webpack5 Loader 机制和使用

## 学习目标

1. 理解 Loader 的工作原理
2. 掌握常用 Loader 的配置和使用
3. 理解 Loader 的执行顺序
4. 掌握 Babel、TypeScript、CSS、SCSS 等 Loader 的实际应用
5. **掌握自定义 Loader 的开发方法**

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
| file-loader | 处理文件资源（Webpack5 推荐使用 Asset Modules）。开发时可以使用相对路径；部署时，使用正确的配置，webpack 将会在打包输出中自动重写文件路径为正确的 URL。 |
| url-loader | 处理文件为 Base64（Webpack5 推荐使用 Asset Modules）。如果文件大于该阈值，会自动的交给 file-loader 处理。 |
| raw-loader | 将文件作为字符串加载（Webpack5 推荐使用 asset/source） |
| html-webpack-plugin | 生成 HTML 文件并自动注入 JS |

## Loader 说明

本章节使用了以下 Loader：

| Loader | 作用 |
|--------|------|
| [vue-loader](https://vue-loader.vuejs.org/zh/) | 解析和编译 Vue 单文件组件(.vue文件) |
| ts-loader | 将 TypeScript 转换为 JavaScript |
| babel-loader | 将 ES6+ 语法转换为 ES5 |
| css-loader | 解析 CSS 文件中的 @import 和 url() |
| style-loader | 将 CSS 样式注入到页面的 `<style>` 标签中 |
| sass-loader | 编译 SCSS/SASS 文件为 CSS |
| asset/source (原 raw-loader) | 将文件作为原始字符串导入 |

### 自定义 Loader 说明

本章节还实现了自定义 Loader 的学习内容：

| 自定义 Loader | 作用 | 文件位置 |
|---------------|------|----------|
| banner-loader | 为 JS 文件添加版权注释 | `loaders/banner-loader.js` |
| replace-loader | 字符串替换 | `loaders/replace-loader.js` |
| markdown-loader | 将 Markdown 转换为 HTML | `loaders/markdown-loader.js` |
| async-demo-loader | 异步处理演示 | `loaders/async-demo-loader.js` |

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
Webpack5 引入了[资源模块](https://www.webpackjs.com/guides/asset-modules/)替代传统的 file-loader 和 url-loader：

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

## 自定义 Loader 开发

### Loader 的基本结构

Loader 本质上是一个导出函数的 Node.js 模块：

```javascript
module.exports = function(source) {
  // source 是文件的原始内容
  // 对 source 进行转换处理
  return transformedSource;
};
```

### Loader 的分类

#### 1. 同步 Loader

最简单的 Loader 形式，直接返回转换后的结果：

```javascript
module.exports = function(source) {
  return source.replace(/Hello/g, '你好');
};
```

#### 2. 异步 Loader

需要异步操作时使用 `this.async()`：

```javascript
module.exports = function(source) {
  const callback = this.async();
  // 异步操作
  setTimeout(() => {
    callback(null, transformedSource);
  }, 100);
};
```

#### 3. Raw Loader

当需要接收原始字符串（而非 Buffer）时：

```javascript
module.exports = function(source) {
  // source 是字符串
  return source;
};
module.exports.raw = true;
```

### Loader 的上下文对象

Loader 函数中的 `this` 提供了丰富的 API：

| 方法 | 说明 |
|------|------|
| `this.getOptions()` | 获取 loader 配置选项 |
| `this.async()` | 转为异步模式 |
| `this.callback()` | 返回结果（同步/异步） |
| `this.emitFile()` | 额外输出文件 |
| `this.addDependency()` | 添加文件依赖 |
| `this.getSource()` | 获取源文件内容 |
| `this.getOptions()` | 获取 loader 配置 |

### 实战：自定义 Loader 配置

```javascript
{
  test: /\.js$/,
  use: {
    loader: path.resolve(__dirname, 'loaders/custom-loader.js'),
    options: {
      // 自定义选项
      option1: 'value1',
      option2: 'value2'
    }
  }
}
```

### 本章自定义 Loader 示例

#### 1. Banner Loader

为文件添加版权注释：

```javascript
module.exports = function(source) {
  const options = this.getOptions() || {};
  const banner = options.banner || 'Generated by Custom Loader';
  const comment = `/**\n * ${banner}\n */\n`;
  return comment + source;
};
```

#### 2. Replace Loader

字符串替换功能：

```javascript
module.exports = function(source) {
  const { search, replace } = this.getOptions() || {};
  if (!search) return source;
  return source.replace(new RegExp(search, 'g'), replace);
};
```

#### 3. Markdown Loader

将 Markdown 转换为 HTML 模块：

```javascript
module.exports = function(source) {
  // 简化版 Markdown 转 HTML
  let html = source
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return `module.exports = ${JSON.stringify(html)}`;
};
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

5. **测试自定义 Loader**
   - 访问页面中的"自定义 Loader"区域，查看效果
   - 打开打包后的 JS 文件，查看 banner-loader 添加的版权注释
   - 查看 "Hello" 是否被替换为 "你好"
   - 查看 Markdown 文件是否正确转换为 HTML

## 课后思考

1. Loader 的执行顺序是怎样的？如何控制 Loader 的执行优先级？
   - **执行顺序**：Webpack 的 Loader 链式调用顺序是**从下到上、从右到左**（类似函数组合）。例如 `['style-loader', 'css-loader', 'sass-loader']` 的执行顺序是：sass-loader → css-loader → style-loader。
   - **控制优先级**：可以通过 `enforce` 字段控制：
     - `pre`：优先执行（在所有普通 Loader 之前）
     - `normal`：普通执行（默认）
     - `post`：最后执行（在所有 Loader 之后）

2. Webpack5 的 Asset Modules 与传统的 file-loader/url-loader 有什么区别？
   - **内置 vs 独立**：Asset Modules 是 Webpack5 内置的，无需安装额外包；file-loader/url-loader 是独立的第三方 Loader
   - **配置更简洁**：Asset Modules 无需配置 publicPath、outputPath 等，配置更简单
   - **性能更好**：Asset Modules 是 Webpack 内置实现，构建性能更好
   - **推荐**：Webpack5 推荐使用 Asset Modules，但 file-loader/url-loader 仍可使用

3. 为什么 sass-loader 需要放在 Loader 链的最后（靠近源文件）？
   - **链式执行原理**：Loader 链从右到左执行，每个 Loader 将处理结果传递给下一个 Loader
   - **执行顺序**：sass-loader（最右/最后）→ css-loader → style-loader（最左/最先）
   - **原因**：SCSS 需要先被 sass-loader 编译成 CSS，然后 css-loader 处理 @import 和 url()，最后 style-loader 注入到 DOM。如果顺序反了，SCSS 不会被编译，直接作为 CSS 处理会报错

4. Babel 的 `cacheDirectory` 选项有什么作用？
   - **缓存机制**：将 Babel 转译结果缓存到文件系统（默认在 node_modules/.cache/babel-loader/）
   - **性能提升**：二次构建时直接读取缓存，避免重复转译，显著提升构建速度
   - **适用场景**：开发模式提升尤为明显，生产模式也推荐开启
