# Webpack5 CSS处理和资源管理

## 章节学习目标

1. 掌握 CSS Modules 的配置和使用
2. 理解 PostCSS 和 postcss-preset-env 的工作原理
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
- postcss-preset-env：现代 CSS 转换（包含 autoprefixer 功能）
- autoprefixer：自动添加浏览器前缀（已集成到 preset-env）
- cssnano：CSS 压缩优化

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
| postcss-preset-env | 现代 CSS 转换（包含 autoprefixer） |
| cssnano | CSS 压缩优化（生产环境） |
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
module.exports = (ctx) => {
  return {
    plugins: [
      require('postcss-preset-env'),
      // 仅在生产环境启用 CSS 压缩
      ctx.env === 'production' ? require('cssnano')({ preset: 'default' }) : false,
    ].filter(Boolean),
  };
};
```

#### Browserslist 配置文件

用于指定目标浏览器范围，postcss-preset-env 中的 autoprefixer 会根据此配置添加浏览器前缀：

```ini
# .browserslistrc
[production]
> 0.5%
last 2 versions
Firefox ESR
not dead

[development]
last 1 chrome version
last 1 firefox version
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
   答：通过将 CSS 类名自动哈希化为唯一标识符，实现样式作用域隔离。例如 `.button` 会被编译为 `Button__button__abc123`，不同模块中的同名类名不会冲突。

2. PostCSS 和预处理器（如 SCSS）的区别是什么？
   答：
   - **预处理器（SCSS/SASS/Less）**：在构建前处理，提供变量、嵌套、混合宏等语法，最终需要编译为标准 CSS
   - **PostCSS**：在构建后处理（CSS 转换为 CSS），通过插件实现功能扩展，如添加前缀、压缩、语法转换等
   - 两者可以配合使用：SCSS 编译后的 CSS 再经过 PostCSS 处理

3. 资源模块的 `maxSize` 配置对性能有什么影响？
   答：
   - **值越小**：更多资源转为 Base64 内联，减少 HTTP 请求次数，但会增加 JS bundle 体积
   - **值越大**：更多资源生成独立文件，减少 bundle 体积，但增加 HTTP 请求次数
   - 建议：8KB 以下的图片内联，较大的图片独立加载

4. 如何配置让字体文件也使用资源模块处理？
   答：使用 webpack 内置的 `asset/resource` 类型：
   ```typescript
   {
     test: /\.(woff|woff2|eot|ttf|otf)$/i,
     type: 'asset/resource',
   }
   ```

## 参考资料

- [CSS Modules 文档](https://github.com/css-modules/css-modules)
- [PostCSS 文档](https://postcss.org/)
- [Webpack 资源模块](https://webpack.js.org/guides/asset-modules/)
- [postcss-preset-env 文档](https://github.com/csstools/postcss-preset-env)
