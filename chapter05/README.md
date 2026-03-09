# Webpack5 CSS处理和资源管理

## 章节学习目标

1. 掌握 CSS Modules 的配置和使用
2. 理解 PostCSS 和 autoprefixer 的工作原理
3. 掌握资源模块处理（Asset Modules）
4. 学会处理图片、字体等静态资源

## 核心概念介绍

### CSS Modules

CSS Modules 是一种 CSS 作用域解决方案，通过将 CSS 类名哈希化，避免全局样式冲突。

**特点**：
- 自动生成唯一类名
- 显式依赖声明
- 编译时处理

### PostCSS

PostCSS 是一个用 JavaScript 转换 CSS 的工具，常用插件包括：
- autoprefixer：自动添加浏览器前缀
- cssnano：CSS 压缩优化
- postcss-preset-env：现代 CSS 转换

### 资源模块处理（Asset Modules）

Webpack5 内置的资源处理能力：
- `asset/resource`：生成独立文件（类似 file-loader）
- `asset/inline`：内联为 Base64（类似 url-loader）
- `asset`：根据大小自动选择（Webpack5 新特性）

## 依赖包说明

### 开发依赖

| 包名 | 作用 |
|------|------|
| webpack | 核心打包工具 |
| webpack-cli | 命令行工具 |
| webpack-dev-server | 开发服务器 |
| vue | Vue3 核心库 |
| @vue/compiler-sfc | Vue 单文件组件编译器 |
| vue-loader | Vue 组件加载器 |
| ts-loader | TypeScript 加载器 |
| typescript | TypeScript 语言 |
| css-loader/style-loader/sass-loader | CSS/SCSS 处理 |
| postcss-loader | PostCSS 处理 |
| autoprefixer | 自动添加浏览器前缀 |
| html-webpack-plugin | HTML 插件 |
| mini-css-extract-plugin | CSS 提取插件 |

## 关键配置解析

### 1. CSS Modules 配置

```typescript
{
  test: /\.css$/,
  use: [
    isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[name]__[local]--[hash:base64:5]'
        }
      }
    },
    'postcss-loader'
  ]
}
```

### 2. PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

### 3. 资源模块配置

```typescript
{
  test: /\.(png|jpe?g|gif|svg|webp)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024 // 8KB 以下内联
    }
  }
}
```

## 实践步骤

### 1. 安装依赖

```bash
cd chapter05
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
# 或
pnpm start
```

访问 http://localhost:8080 查看效果

### 3. 体验 CSS Modules

1. 观察 `components/Button.module.css` 的类名如何生成
2. 查看浏览器中元素的 class 属性

### 4. 测试资源处理

1. 添加图片资源
2. 观察小于 8KB 的图片被内联为 Base64
3. 大图片生成独立文件

### 5. 生产构建

```bash
pnpm build
```

## 课后思考

1. CSS Modules 如何解决样式冲突问题？
2. PostCSS 和预处理器（如 SCSS）的区别是什么？
3. 资源模块的 `maxSize` 配置对性能有什么影响？
4. 如何配置让字体文件也使用资源模块处理？

## 参考资料

- [CSS Modules 文档](https://github.com/css-modules/css-modules)
- [PostCSS 文档](https://postcss.org/)
- [Webpack 资源模块](https://webpack.js.org/guides/asset-modules/)
- [autoprefixer 文档](https://github.com/postcss/autoprefixer)
