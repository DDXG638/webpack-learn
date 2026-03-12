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

### 2.1 Webpack 如何判断副作用

Webpack 通过静态分析来判断代码是否有副作用，主要包括以下几种情况：

| 代码类型 | 示例 | 能否静态识别 |
|---------|------|-------------|
| console/alert 调用 | `console.log()` | ✅ 能 |
| 全局变量修改 | `window.x = 1` | ✅ 能 |
| 参数 mutation | `obj.x = 1` | ✅ 能 |
| 模块级变量赋值 | `globalState = 'x'` | ✅ 能 |
| 动态代码 | `eval('...')` | ❌ 不能 |
| DOM 操作 | `document.body` | ❌ 不能 |

**注意**：即使函数内部有副作用，如果**没有被实际调用**，Webpack 在 production 模式下仍然会将其移除。

### 2.2 如何编写更利于 Tree-Shaking 的代码

**1. 使用 ES Module 语法**

```typescript
// ✅ 推荐：ES Module
import { add } from './math';

// ❌ 避免：CommonJS
const { add } = require('./math');
```

**2. 尽量使用具名导出**

```typescript
// ✅ 推荐：具名导出，Webpack 可以精确追踪
export function add(a: number, b: number) { return a + b; }
export function multiply(a: number, b: number) { return a * b; }

// ❌ 避免：默认导出，整个模块会被保留
export default function() {}
```

**3. 避免修改传入的参数**

```typescript
// ✅ 推荐：返回新对象，不修改原对象
export function addItem(list: number[], item: number): number[] {
  return [...list, item];
}

// ❌ 避免：修改原对象，Webpack 无法确定是否有副作用
export function addItem(list: number[], item: number): void {
  list.push(item);
}
```

**4. 使用纯函数注解**

如果某个调用确实没有副作用，可以使用 `/*#__PURE__*/` 注解帮助 Webpack 识别：

```typescript
// 告诉 Webpack 这个调用是纯的，可以安全移除未使用的结果
const result = /*#__PURE__*/ someFunction();
```

**5. 合理配置 sideEffects**

```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfill.ts"
  ]
}
```

- 只标记确实有副作用的文件
- CSS/SCSS 必须标记，因为样式注入是副作用
- 避免使用 `sideEffects: true`，会导致所有未使用代码被保留

### 3. Scope Hoisting（模块合并）

Scope Hoisting 将多个模块合并到单个函数中，减少函数闭包数量，提升执行效率并减小包体积。

**效果对比（development 模式）：**

| 配置 | main.js 大小 | 差异 |
|------|-------------|------|
| `concatenateModules: false` | 117 KB | - |
| `concatenateModules: true` | 95.5 KB | **-18%** |

**优势：**
- 减少函数声明，提升执行效率
- 减小包体积（消除模块包装代码）
- 更好的代码优化

**工作原理示例：**

```javascript
// 模块 A
export function add(a, b) { return a + b; }

// 模块 B (依赖 A)
import { add } from './a';
export function sum(arr) { return arr.reduce((s, n) => add(s, n), 0); }

// 模块 C (依赖 B)
import { sum } from './b';
export function avg(arr) { return sum(arr) / arr.length; }
```

**未合并时（每个模块独立包装）：**
```javascript
var __webpack_modules__ = {
  "./a.js": (module) => {
    module.exports.add = function(a, b) { return a + b; };
  },
  "./b.js": (module, __webpack_require__) => {
    var a = __webpack_require__("./a.js");
    module.exports.sum = function(arr) { ... };
  },
  "./c.js": (module, __webpack_require__) => {
    var b = __webpack_require__("./b.js");
    module.exports.avg = function(arr) { ... };
  }
};
```

**合并后（Scope Hoisting）：**
```javascript
// 所有模块合并到一个函数中
function(scope) {
  scope.a = { add: function(a, b) { return a + b; } };
  scope.b = { sum: function(arr) { return arr.reduce((s, n) => scope.a.add(s, n), 0); } };
  scope.c = { avg: function(arr) { return scope.b.sum(arr) / arr.length; } };
}
```

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

### 方案三：通过 CDN 引入 Vue

除了将 Vue 打包到应用中外，还可以通过 CDN 引入 Vue，实现完全的缓存稳定：

**1. HTML 模板中引入 Vue CDN：**

```html
<!-- public/index-cdn.html -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
```

**2. Webpack 配置排除 Vue：**

```javascript
// webpack.config.ts
externals: {
  vue: 'Vue',  // 不打包 Vue，从全局变量 Vue 获取
}
```

**3. 打包命令：**

```bash
npm run build:cdn  # 使用 --env cdn 参数
```

**效果对比：**

| 方案 | 打包体积 | 首次加载 | 缓存稳定性 |
|------|---------|---------|-----------|
| 打包 Vue (usedExports=true) | ~65 KB | 较快 | 内容变化则失效 |
| CDN 引入 Vue | ~10 KB | 依赖 CDN | **完全稳定** |

**优点：**
- Vue 代码完全不参与打包，contentHash 永远不变
- 多站点共享 CDN，用户可能已有缓存
- 主包体积大幅减小

**缺点：**
- 首次需要加载 Vue CDN
- 依赖 CDN 服务可用性
- 需要手动管理 Vue 版本

**适用场景：**
- 适合：后台管理系统、企业内部应用
- 不适合：对首屏性能极致追求的 C 端产品

### package.json（可选配置）

```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "*.vue"
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
