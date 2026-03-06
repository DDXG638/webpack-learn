# Webpack5 Plugin 机制和使用

## 章节学习目标

1. 理解 Plugin 的工作原理
2. 掌握常用 Plugin 的配置和使用
3. 学会自定义 Plugin
4. 理解 Tapable 钩子机制

## 核心概念介绍

### 什么是 Plugin？

Plugin（插件）是 Webpack 的核心支柱之一，用于扩展 Webpack 的功能。与 Loader 处理单个文件的转换不同，Plugin 可以在整个构建流程中介入，处理更复杂的任务。

### Plugin 的工作原理

- Plugin 本质是一个类
- 必须实现 `apply` 方法
- 通过 Webpack 内部的 Tapable 钩子机制注册事件
- 在构建过程中的特定时机执行自定义逻辑

### Webpack 构建流程

1. **初始化**：读取配置，初始化 Compiler
2. **编译**：从入口文件开始，递归解析依赖
3. **生成**：根据模块依赖，生成 Chunk 并写入文件系统

### Tapable 钩子类型

- **同步钩子**：按注册顺序依次执行
  - `tap()` 注册
  - `call()` 触发
- **异步钩子**：支持并行/串行执行
  - `tapAsync()` / `tapPromise()` 注册
  - `async()` / `promise()` 触发

### Compiler 钩子 vs Compilation 钩子

在 Webpack 插件中，有两个核心对象：`Compiler` 和 `Compilation`，它们各自提供了一组钩子。

#### Compiler（编译器）

- **定义**：代表整个 webpack 构建过程的全局对象
- **生命周期**：从 webpack 启动到结束，整个过程只有一个 Compiler 实例
- **触发时机**：在整个构建过程的关键节点触发（只触发一次）
- **常用钩子**：
  - `run`：构建开始前
  - `emit`：资源输出到目录前
  - `done`：构建完成后

```javascript
class MyPlugin {
  apply(compiler) {
    // 整个构建过程只触发一次
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      console.log('构建完成！');
    });
  }
}
```

#### Compilation（编译）

- **定义**：代表一次具体的编译过程
- **生命周期**：每次文件变化重新构建时，都会创建新的 Compilation 实例
- **触发时机**：每次重新构建时都会触发（开发模式下频繁触发）
- **常用钩子**：
  - `buildModule`：模块构建开始
  - `succeedModule`：模块构建成功
  - `seal`： Compilation 封装完成

```javascript
class MyPlugin {
  apply(compiler) {
    // 每次重新构建都会触发
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      console.log('本次构建生成了', Object.keys(compilation.assets).length, '个文件');
    });
  }
}
```

#### 核心区别

| 特性 | Compiler 钩子 | Compilation 钩子 |
|------|---------------|------------------|
| 生命周期 | 整个 webpack 进程 | 每次重新构建 |
| 触发频率 | 只触发一次 | 文件变化时频繁触发 |
| 作用范围 | 全局配置、统计信息 | 当前构建的模块和资源 |
| 典型场景 | 输出最终产物、打印构建信息 | 处理模块依赖、分析构建过程 |

#### 如何选择

- **使用 Compiler 钩子**：当你需要处理全局配置、最终输出、构建统计时
- **使用 Compilation 钩子**：当你需要分析模块依赖、处理资源内容、监听文件变化时

> 注意：在自定义 Plugin 中，通过 `compiler.hooks.emit.tap()` 注册的钩子会接收到 `compilation` 参数，这个 `compilation` 是当前这次构建的编译对象，与 `compiler.compilation` 是同一个对象。

## 依赖包说明

### 开发依赖

| 包名 | 版本 | 作用 |
|------|------|------|
| webpack | ^5.89.0 | 核心打包工具 |
| webpack-cli | ^5.1.4 | 命令行工具 |
| webpack-dev-server | ^4.15.1 | 开发服务器 |
| vue | ^3.4.0 | Vue3 核心库（生产依赖） |
| @vue/compiler-sfc | ^3.4.0 | Vue 单文件组件编译器 |
| vue-loader | ^17.4.2 | Vue 组件加载器 |
| ts-loader | ^9.5.1 | TypeScript 加载器 |
| typescript | ^5.3.3 | TypeScript 语言 |
| css-loader | ^6.8.1 | CSS 加载器 |
| style-loader | ^3.3.3 | Style 加载器 |
| sass | ^1.97.3 | Sass 编译器 |
| sass-loader | ^13.3.2 | Sass 加载器 |
| vue-style-loader | ^4.1.3 | Vue 样式加载器 |
| html-webpack-plugin | ^5.5.4 | HTML 插件 |
| mini-css-extract-plugin | ^2.7.6 | CSS 提取插件 |

## 使用的 Plugin 说明

### 1. HtmlWebpackPlugin

**作用**：自动生成 HTML 文件，并自动注入打包后的 JS/CSS 资源

**配置选项**：
- `template`：HTML 模板路径
- `filename`：输出文件名
- `inject`：资源注入位置（head/body）
- `minify`：生产环境压缩配置

### 2. MiniCssExtractPlugin

**作用**：将 CSS 从 JS 中提取到独立的 CSS 文件

**适用场景**：
- 生产环境构建
- 需要 CSS 长期缓存
- 多个页面共享 CSS

**配置选项**：
- `filename`：输出文件名
- `chunkFilename`：异步 chunk 的文件名

### 3. DefinePlugin

**作用**：定义编译时可配置的全局常量

**使用场景**：
- 环境变量配置
- 特性开关
- 应用元信息

**注意**：值会被 JSON.stringify 处理

#### DefinePlugin 与 .env 文件的区别

| 特性 | DefinePlugin | .env 文件 |
|------|---------------|-----------|
| 替换时机 | 构建时 | 运行时 |
| 是否需要重新构建 | 是 | 否（重启即可） |
| 最终产物 | 静态字符串 | 仍有 process.env 查找 |
| 适用场景 | 版本号、构建时间、开关特性 | API地址、调试模式等 |

**示例对比**：

```javascript
// DefinePlugin - 构建时替换
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
})
// 打包后: console.log('production')

// .env 文件 - 运行时读取
// .env: NODE_ENV=production
// 打包后: console.log(process.env.NODE_ENV)
```

**使用 .env 文件**（需要安装 dotenv）：

```bash
pnpm add dotenv
```

```javascript
// webpack.config.js
import dotenv from 'dotenv';
const env = dotenv.config().parsed;

new webpack.DefinePlugin({
  'process.env': JSON.stringify(env),
})
```

**选择建议**：
- 静态配置（版本号、构建时间、特性开关）：使用 DefinePlugin
- 动态配置（API地址、本地调试开关）：使用 .env 文件

### 4. EnvironmentPlugin

**作用**：DefinePlugin 的便捷封装，专门用于环境变量

**优势**：比 DefinePlugin 更简洁

### 5. 自定义 Plugin

本项目包含两个自定义 Plugin 示例：

#### BannerPlugin
- 在每个 JS 文件头部添加版权信息
- 使用 `emit` 钩子

#### FileListPlugin
- 生成打包文件列表 JSON
- 用于分析构建产物

## 关键配置解析

### webpack.config.js 核心结构

```javascript
export default (env, argv) => {
  const mode = argv.mode || 'development';
  const isProduction = mode === 'production';

  return {
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true, // Webpack5 内置清理
    },
    plugins: [
      new HtmlWebpackPlugin({ /* ... */ }),
      new MiniCssExtractPlugin({ /* ... */ }),
      new webpack.DefinePlugin({ /* ... */ }),
      new webpack.EnvironmentPlugin({ /* ... */ }),
      new BannerPlugin({ /* ... */ }),
      new FileListPlugin(),
    ],
  };
};
```

### DefinePlugin 使用示例

```javascript
new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(mode),
    APP_NAME: JSON.stringify('My App'),
  },
  __APP_VERSION__: JSON.stringify('1.0.0'),
  __FEATURE_FLAGS__: JSON.stringify({
    enableNewUI: true,
  }),
})
```

### 自定义 Plugin 结构

```javascript
class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 在资源生成时执行
    });
  }
}
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter03
pnpm install
```

### 2. 开发模式

```bash
pnpm dev
```

访问 http://localhost:8080 查看效果

### 3. 生产构建

```bash
pnpm build
```

查看 dist 目录下的输出文件

### 4. 观察 Plugin 效果

1. **HtmlWebpackPlugin**：查看 dist/index.html，是否自动引入了 JS/CSS
2. **MiniCssExtractPlugin**：生产构建时，CSS 是否单独提取
3. **DefinePlugin**：在浏览器控制台查看全局变量是否定义
4. **BannerPlugin**：查看生成的 JS 文件头部是否有版权信息
5. **FileListPlugin**：查看是否生成了 file-list.json

## 课后思考

1. Plugin 和 Loader 有什么区别？分别在什么场景使用？
2. 如何监听 Webpack 的编译进度？
3. 如何在 Plugin 中访问编译后的模块信息？
4. 请尝试编写一个自动生成版本号的 Plugin？

## 参考资料

- [Webpack Plugin API](https://webpack.js.org/api/plugins/)
- [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)
- [MiniCssExtractPlugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
- [Tapable](https://webpack.js.org/api/tapable/)
