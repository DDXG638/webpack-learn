# 第8章：Tapable 基础使用

## 学习目标

- 理解 Tapable 的概念和作用
- 掌握同步钩子和异步钩子的区别和使用场景
- 学会创建自定义钩子并注册回调
- 理解 Webpack 钩子机制与插件系统的关系

## 核心概念介绍

### 1. Tapable 是什么

Tapable 是 Webpack 的核心依赖库，提供了统一的钩子（Hook）机制。它允许插件在 Webpack 构建过程中的特定时机注入自定义逻辑，实现构建流程的扩展和定制。

**Tapable 与 Webpack 的关系：**
- Webpack 本质上是一个基于 Tapable 构建的插件系统
- 所有的 Loader 和 Plugin 都通过 Tapable 钩子机制工作
- 理解 Tapable 是深入学习 Webpack 原理的基础

**安装 Tapable：**
```bash
pnpm add tapable -D
```

### 2. 钩子类型概述

Tapable 提供了多种类型的钩子，适用于不同的场景：

| 钩子类型 | 执行方式 | 特点 | 使用场景 |
|---------|---------|------|---------|
| `SyncHook` | 同步 | 按注册顺序执行所有回调 | 最基础的同步处理 |
| `SyncBailHook` | 同步 | 遇到返回值则停止后续执行 | 需要短路逻辑的场景 |
| `SyncWaterfallHook` | 同步 | 前一个回调的返回值传递给下一个 | 数据流转处理 |
| `SyncLoopHook` | 同步 | 重复执行直到返回 undefined | 需要循环执行的场景 |
| `AsyncSeriesHook` | 异步串行 | 按顺序执行，支持 Promise | 异步任务串行执行 |
| `AsyncParallelHook` | 异步并行 | 同时执行所有回调 | 异步任务并行执行 |
| `AsyncSeriesBailHook` | 异步串行 | 遇到返回值停止 | 异步短路逻辑 |
| `AsyncSeriesWaterfallHook` | 异步串行 | 异步数据流转 | 异步数据处理 |

### 3. 同步钩子详解

#### 3.1 SyncHook（同步钩子）

最基础的钩子类型，按注册顺序同步执行所有回调。

```typescript
import { SyncHook } from 'tapable';

// 定义钩子
const hook = new SyncHook<[string, number]>(['name', 'age']);

// 注册回调
hook.tap('Plugin1', (name, age) => {
  console.log(`Plugin1: ${name}, ${age}`);
});

hook.tap('Plugin2', (name, age) => {
  console.log(`Plugin2: ${name}, ${age}`);
});

// 触发钩子
hook.call('Tom', 25);
// 输出:
// Plugin1: Tom, 25
// Plugin2: Tom, 25
```

#### 3.2 SyncBailHook（同步保险钩子）

当回调有返回值时，停止执行后续回调。适用于需要短路逻辑的场景。

```typescript
import { SyncBailHook } from 'tapable';

const hook = new SyncBailHook<[string]>(['name']);

hook.tap('Plugin1', (name) => {
  console.log('Plugin1 执行');
  return 'stop'; // 返回值会停止后续执行
});

hook.tap('Plugin2', (name) => {
  console.log('Plugin2 不会执行');
});

hook.call('Tom');
// 输出: Plugin1 执行
```

#### 3.3 SyncWaterfallHook（同步瀑布钩子）

前一个回调的返回值作为参数传递给下一个回调。适用于数据流转处理。

```typescript
import { SyncWaterfallHook } from 'tapable';

const hook = new SyncWaterfallHook<[number]>(['count']);

hook.tap('Plugin1', (count) => {
  return count + 10; // 传递给下一个
});

hook.tap('Plugin2', (count) => {
  return count * 2; // 传递给下一个
});

const result = hook.call(5);
// 结果: (5 + 10) * 2 = 30
```

#### 3.4 SyncLoopHook（同步循环钩子）

重复执行回调直到返回 undefined。适用于需要循环执行的场景。

```typescript
import { SyncLoopHook } from 'tapable';

let count = 0;
const hook = new SyncLoopHook<[]>('empty');

hook.tap('Plugin1', () => {
  count++;
  if (count < 3) {
    return true; // 继续循环
  }
  return undefined; // 停止循环
});

hook.call();
// Plugin1 会被执行 3 次
```

### 4. 异步钩子详解

#### 4.1 AsyncSeriesHook（异步串行钩子）

按顺序执行异步回调，使用 `tapAsync` 或 `tapPromise` 注册。

```typescript
import { AsyncSeriesHook } from 'tapable';

const hook = new AsyncSeriesHook<[string]>(['name']);

// 使用 tapAsync（回调方式）
hook.tapAsync('Plugin1', (name, callback) => {
  setTimeout(() => {
    console.log('Plugin1 完成');
    callback(); // 必须调用 callback
  }, 100);
});

// 使用 tapPromise（Promise 方式）
hook.tapPromise('Plugin2', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Plugin2 完成');
      resolve(true);
    }, 50);
  });
});

hook.callAsync('Tom', (err) => {
  console.log('所有回调执行完成');
});
```

#### 4.2 AsyncParallelHook（异步并行钩子）

同时执行所有异步回调，类似 Promise.all 的行为。

```typescript
import { AsyncParallelHook } from 'tapable';

const hook = new AsyncParallelHook<[string]>(['name']);

hook.tapPromise('Plugin1', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Plugin1 完成');
      resolve(true);
    }, 200);
  });
});

hook.tapPromise('Plugin2', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Plugin2 完成');
      resolve(true);
    }, 100);
  });
});

// 两个插件会同时执行，总耗时取最长的那个
hook.promise('Tom').then(res => {
  console.log('所有回调执行完成');
});
```

### 5. Webpack 中的钩子

Webpack 在整个构建流程中暴露了多个钩子，开发者可以在这些时机介入自定义逻辑。

#### 5.1 常用编译钩子

| 钩子名称 | 类型 | 执行时机 |
|---------|------|---------|
| `beforeCompile` | SyncBailHook | 开始编译之前 |
| `compile` | SyncHook | 开始编译 |
| `compilation` | SyncHook | 创建 Compilation 对象后 |
| `emit` | AsyncSeriesHook | 输出资产到目录前 |
| `afterEmit` | AsyncSeriesHook | 输出资产到目录后 |
| `done` | AsyncSeriesHook | 编译完成后 |

#### 5.2 在 Plugin 中使用钩子

```typescript
import webpack from 'webpack';

class MyPlugin {
  name = 'MyPlugin';

  apply(compiler: webpack.Compiler) {
    // 监听 beforeCompile 钩子
    compiler.hooks.beforeCompile.tap(this.name, (compilationParams) => {
      console.log('开始编译...');
    });

    // 监听 emit 钩子
    compiler.hooks.emit.tap(this.name, (compilation) => {
      console.log(`生成 ${Object.keys(compilation.assets).length} 个文件`);
    });

    // 监听 done 钩子
    compiler.hooks.done.tap(this.name, (stats) => {
      console.log('编译完成！');
    });
  }
}
```

### 6. 实际应用场景

#### 6.1 构建性能监控

```typescript
class BuildMonitor {
  apply(compiler: webpack.Compiler) {
    const startTime = Date.now();

    compiler.hooks.done.tap('BuildMonitor', (stats) => {
      const duration = Date.now() - startTime;
      console.log(`构建耗时: ${duration}ms`);
      console.log(`错误数量: ${stats.compilation.errors.length}`);
    });
  }
}
```

#### 6.2 自定义构建产物

```typescript
class CustomAssetPlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tap('CustomAssetPlugin', (compilation) => {
      // 添加自定义文件
      compilation.assets['build-info.json'] = {
        source: () => JSON.stringify({
          timestamp: Date.now(),
          version: '1.0.0',
        }),
        size: () => 100,
      };
    });
  }
}
```

#### 6.3 环境变量注入

```typescript
class EnvPlugin {
  constructor(private env: Record<string, string>) {}

  apply(compiler: webpack.Compiler) {
    compiler.hooks.beforeCompile.tap('EnvPlugin', () => {
      Object.entries(this.env).forEach(([key, value]) => {
        process.env[key] = value;
      });
    });
  }
}
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
| webpack-cli | ^5.1.4 | Webpack 命令行工具 |
| webpack-dev-server | ^5.2.0 | 开发服务器 |

## 关键配置解析

### webpack.config.ts 中的 Tapable 使用

```typescript
// 1. 导入需要的钩子类型
import { SyncHook, AsyncSeriesHook, SyncBailHook } from 'tapable';

// 2. 定义自定义钩子
class BuildHooks {
  beforeBuild = new SyncHook<[string[]]>('files');
  build = new SyncHook<{ entry: string; output: string }>('buildInfo');
  afterBuild = new AsyncSeriesHook<[boolean]>('success');

  // 触发钩子的方法
  runBeforeBuild(files: string[]) {
    this.beforeBuild.call(files);
  }
}

// 3. 在 Plugin 中使用 Webpack 钩子
class TapablePlugin {
  apply(compiler: webpack.Compiler) {
    // 同步钩子
    compiler.hooks.emit.tap(this.name, (compilation) => {
      console.log('emit 钩子触发');
    });

    // 异步钩子
    compiler.hooks.beforeEmit.tapAsync(this.name, (compilation, callback) => {
      setTimeout(() => {
        console.log('beforeEmit 完成');
        callback();
      }, 100);
    });
  }
}
```

### 钩子类型参数说明

```typescript
// 泛型参数格式：new Hook<[参数1类型, 参数2类型, ...]>('hookName')

// 无参钩子
new SyncHook<[]>('noParams')

// 单参数钩子
new SyncHook<[string]>('singleParam')

// 多参数钩子
new SyncHook<[string, number, boolean]>('multipleParams')
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter08
pnpm install
```

### 2. 开发环境运行

```bash
npm run dev
```

观察控制台输出，可以看到：
- 自定义钩子的执行流程
- Webpack 编译钩子的触发日志

### 3. 生产环境打包

```bash
npm run build
```

查看 dist 目录，了解打包产物。

### 4. 验证钩子执行顺序

1. 打开浏览器控制台
2. 查看 `beforeCompile`、`compile`、`emit` 等钩子的执行顺序
3. 观察 `SyncBailHook` 的短路效果

## 效果验证

### 开发环境 (development)
- 控制台显示自定义钩子执行日志
- Webpack 编译钩子正常触发
- 代码包含注释和调试信息

### 生产环境 (production)
- 钩子仍然正常执行
- 代码压缩混淆
- 生成 contenthash 用于缓存

## 注意事项

1. **钩子类型选择**：根据实际需求选择合适的钩子类型，同步场景用 SyncHook，异步场景用 AsyncHook。

2. **回调注册顺序**：同步钩子的执行顺序与注册顺序一致，需要注意注册顺序。

3. **异步回调处理**：使用 `tapAsync` 时必须调用 `callback()`，使用 `tapPromise` 时必须返回 Promise。

4. **内存泄漏**：确保在开发模式下正确清理钩子回调，避免内存泄漏。

5. **Webpack 版本兼容**：Tapable API 在 Webpack 5 中保持稳定，版本间差异较小。

6. **调试技巧**：使用 `console.log` 在钩子回调中打印日志，帮助理解执行流程。

7. **关于 tap 注册异步钩子**：

   Webpack 的 `emit`、`done` 等钩子是 `AsyncSeriesHook` 类型，但使用 `tap` 注册也不会报错。这是因为 **Tapable 为所有钩子类型都提供了三个注册方法**（`tap`、`tapAsync`、`tapPromise`），并做了兼容性处理。

   ```typescript
   // 两者都可以正常工作
   compiler.hooks.emit.tap('Plugin', (compilation) => {
     // 不需要手动调用 callback，Tapable 会自动处理
     console.log('emit 触发');
   });

   compiler.hooks.emit.tapAsync('Plugin', (compilation, callback) => {
     // 需要手动调用 callback
     setTimeout(() => {
       console.log('emit 完成');
       callback();
     }, 100);
   });
   ```

   **区别**：
   - `tap`：内部会自动将回调包装为异步函数并调用 `callback()`，使用简单
   - `tapAsync`：需要手动调用 `callback()`，适合需要精确控制异步流程的场景
   - `tapPromise`：返回 Promise，适合基于 Promise 的异步逻辑

   **建议**：虽然 `tap` 可以混用，但为了代码可读性和避免潜在问题，建议按照钩子类型使用对应的注册方法：
   - `SyncHook` → 用 `tap`
   - `AsyncSeriesHook` → 用 `tapAsync` 或 `tapPromise`
