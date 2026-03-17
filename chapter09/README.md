# 第9章：Webpack 原理深入

## 学习目标

- 深入理解 Webpack 的整体构建流程
- 掌握 Webpack 的核心概念（Compiler、Compilation、Module、Chunk）
- 理解 Loader 和 Plugin 的工作机制
- 学会分析打包产物结构

## 核心概念介绍

### 1. Webpack 构建流程

Webpack 的构建是一个**事件流系统**，整个过程可以分为三个阶段：

```
┌─────────────────────────────────────────────────────────────┐
│                    Webpack 构建流程                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                           │
│  │  初始化阶段  │                                           │
│  │             │                                           │
│  │ - 读取配置  │ ──► beforeRun ──► run ──► beforeCompile │
│  └─────────────┘                                           │
│        │                                                    │
│        ▼                                                    │
│  ┌─────────────┐                                           │
│  │  编译阶段    │                                           │
│  │             │                                           │
│  │ - 编译源码  │ ──► compile ──► make ──► compilation    │
│  │ - 分析依赖  │                                           │
│  └─────────────┘                                           │
│        │                                                    │
│        ▼                                                    │
│  ┌─────────────┐                                           │
│  │  生成阶段    │                                           │
│  │             │                                           │
│  │ - 优化代码  │ ──► optimize ──► emit ──► done          │
│  │ - 输出资源  │                                           │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. 核心概念

#### 2.1 Compiler（编译器）

Compiler 是 Webpack 的核心对象，代表整个构建过程。

```typescript
interface Compiler {
  // 入口配置
  options: WebpackOptions;

  // 上下文目录
  context: string;

  // 输入文件系统
  inputFileSystem: any;

  // 输出文件系统
  outputFileSystem: any;

  // 钩子集合
  hooks: CompilerHooks;

  // 运行构建
  run(callback: (err, stats) => void): void;

  // 监听文件变化
  watch(watchOptions: WatchOptions, handler: (err, stats) => void): Watching;
}
```

#### 2.2 Compilation（编译对象）

Compilation 代表一次编译过程，包含当前构建的所有模块和资源。

```typescript
interface Compilation {
  // 编译器引用
  compiler: Compiler;

  // 所有模块
  modules: Set<Module>;

  // 代码块
  chunks: Set<Chunk>;

  // 资源文件
  assets: Record<string, any>;

  // 依赖关系
  dependencies: Map<any, any>;

  // 钩子集合
  hooks: CompilationHooks;
}
```

#### 2.3 Module（模块）

Module 代表一个代码模块，可以是 JS、CSS、Vue 组件等。

```typescript
interface Module {
  // 模块 ID
  id: string | number;

  // 原始代码
  originalSource(): Source;

  // 处理后的代码
  source(): string;

  // 依赖的模块
  dependencies: Dependency[];

  // 所属 Chunk
  chunks: Chunk[];
}
```

#### 2.4 Chunk（代码块）

Chunk 是 Webpack 输出的代码块，一个 Chunk 可能包含多个 Module。

```typescript
interface Chunk {
  // Chunk 名称
  name: string;

  // Chunk ID
  id: string | number;

  // 包含的模块
  modules: Module[];

  // 文件名模板
  filenameTemplate: string;

  // 异步加载的子 Chunk
  async: () => Promise<Chunk>;
}
```

### 3. Loader 原理

#### 3.1 Loader 工作流程

Loader 本质上是一个函数，将源文件转换为目标代码：

```
source file ──► Loader1 ──► Loader2 ──► Loader3 ──► JavaScript code
     │            │            │            │
     │            │            │            │
   原始内容    转换后内容   转换后内容   最终代码
```

#### 3.2 Loader 类型

| 类型 | 说明 | 示例 |
|-----|------|------|
| pre | 前置 Loader | eslint-loader |
| normal | 普通 Loader | babel-loader、ts-loader |
| post | 后置 Loader | postcss-loader |

#### 3.3 自定义 Loader

```javascript
// src/loaders/custom-loader.js
module.exports = function(source) {
  // source 是原始源代码

  // 可以通过 this 获取上下文信息
  console.log(`处理文件: ${this.resourcePath}`);

  // 处理代码
  const result = source.replace(/console\.log/g, '// console.log');

  // 返回处理后的代码
  return result;

  // 或者使用 callback 返回（支持返回 sourceMap）
  // this.callback(null, result, sourceMap);
};
```

### 4. Plugin 原理

#### 4.1 Plugin 工作方式

Plugin 通过订阅 Webpack 钩子来扩展构建流程：

```
Webpack 构建 ──► 触发钩子 ──► 执行 Plugin 回调 ──► 影响构建结果
```

#### 4.2 自定义 Plugin

```javascript
class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 订阅 emit 钩子
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // 访问编译对象
      console.log(`生成 ${Object.keys(compilation.assets).length} 个文件`);

      // 添加自定义资源
      compilation.assets['custom.txt'] = {
        source: () => '自定义内容',
        size: () => 4,
      };
    });
  }
}
```

#### 4.3 常用钩子

| 钩子 | 类型 | 说明 |
|-----|------|------|
| `beforeRun` | AsyncSeriesHook | 开始运行前 |
| `run` | AsyncSeriesHook | 开始编译 |
| `beforeCompile` | SyncBailHook | 编译前准备 |
| `compile` | SyncHook | 开始编译 |
| `make` | AsyncParallelHook | 构建依赖图 |
| `compilation` | SyncHook | 创建编译对象 |
| `emit` | AsyncSeriesHook | 输出资源前 |
| `done` | AsyncSeriesHook | 构建完成 |

### 5. 打包产物分析

#### 5.1 产物结构

Webpack 5 打包产物通常包含：

```
dist/
├── index.html           # HTML 入口
├── main.js              # 主 bundle
├── vendor.js            # 第三方库
├── runtime.js           # 运行时代码
└── css/
    └── main.css         # 提取的 CSS
```

#### 5.2 Bundle 分析工具

使用 `webpack-bundle-analyzer` 可视化分析打包产物：

```bash
npm run analyze
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
| html-webpack-plugin | ^5.6.3 | 生成 HTML 文件 |
| mini-css-extract-plugin | ^2.9.2 | 提取 CSS 到单独文件 |
| sass | ^1.83.4 | Sass 编译器 |
| sass-loader | ^16.0.4 | 处理 Sass/SCSS 文件 |
| style-loader | ^4.0.0 | 处理 CSS 到 JS |
| tapable | ^2.2.1 | Webpack 钩子机制库 |
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

### webpack.config.ts 中的构建流程钩子

```typescript
// 1. 初始化阶段
compiler.hooks.beforeRun.tap('Plugin', (compiler) => {
  console.log('准备开始构建');
});

compiler.hooks.run.tap('Plugin', (compiler) => {
  console.log('开始构建');
});

// 2. 编译阶段
compiler.hooks.beforeCompile.tap('Plugin', (params) => {
  console.log('编译前准备');
});

compiler.hooks.compile.tap('Plugin', (params) => {
  console.log('开始编译');
});

// 3. 生成阶段
compiler.hooks.emit.tap('Plugin', (compilation) => {
  console.log('输出资源');
});

compiler.hooks.done.tap('Plugin', (stats) => {
  console.log('构建完成');
});
```

### 自定义 Loader 配置

```typescript
module: {
  rules: [
    {
      test: /\.custom$/,
      loader: path.resolve(__dirname, 'src/loaders/custom-loader.js'),
      // 或者使用 use
      use: [
        {
          loader: 'custom-loader',
          options: { /* ... */ }
        }
      ]
    }
  ]
}
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter09
pnpm install
```

### 2. 开发环境运行

```bash
npm run dev
```

观察控制台输出，可以看到完整的构建流程：
- beforeRun → run → beforeCompile → compile → make → compilation → optimize → emit → done

### 3. 生产环境打包

```bash
npm run build
```

查看 dist 目录结构和产物内容。

### 4. 分析打包产物

```bash
npm run analyze
```

打开 bundle-report.html 可视化查看。

## 效果验证

### 开发环境 (development)
- 控制台显示完整的构建流程日志
- 可以观察到每个阶段的钩子触发
- 构建时间较长，代码未压缩

### 生产环境 (production)
- 代码压缩混淆
- 生成 contenthash 用于缓存
- 构建统计信息更详细

## 注意事项

1. **理解构建流程**：深入理解 Webpack 的构建流程有助于调试和优化

2. **合理使用钩子**：不同阶段适合做不同的事情，选择合适的钩子

3. **Loader 顺序**：多个 Loader 时从右到左、从下到上执行

4. **Plugin 性能**：避免在钩子中执行耗时操作，影响构建速度

5. **调试技巧**：使用 `console.log` 或断点调试理解构建过程
