# Webpack5 系统学习计划

## 学习目标
- 掌握Webpack5的配置和使用
- 理解Webpack的打包构建过程
- 理解Webpack原理(Tapable)
- 掌握Webpack优化技术(runtimeChunk、splitChunks、Tree-Shaking)
- 具备前端项目架构设计能力

## 章节规划

### 第1章：Webpack5基础概念和配置结构
**学习目标**：了解webpack是什么、基本概念、核心配置结构

**主要内容**：
- Webpack定义和核心理念
- Webpack5新特性介绍
- webpack.config.js基础结构
- entry、output、mode等核心配置
- 打包输出文件分析

### 第2章：Loader机制和使用
**学习目标**：理解Loader机制，掌握常用Loader的使用

**主要内容**：
- Loader的工作原理
- file-loader、url-loader、raw-loader
- css-loader、style-loader、sass-loader
- ts-loader、babel-loader
- Loader的执行顺序和配置方式

### 第3章：Plugin机制和使用
**学习目标**：理解Plugin机制，掌握常用Plugin的使用

**主要内容**：
- Plugin的工作原理
- html-webpack-plugin
- mini-css-extract-plugin
- clean-webpack-plugin
- DefinePlugin、EnvironmentPlugin
- 自定义Plugin入门

### 第4章：开发环境配置
**学习目标**：掌握开发环境的高效配置

**主要内容**：
- webpack-dev-server配置
- 热模块替换(HMR)原理和使用
- Source Map配置
- 开发代理配置
- 开发环境最佳实践

### 第5章：CSS处理和资源管理
**学习目标**：掌握CSS和各类资源的处理

**主要内容**：
- CSS Modules
- PostCSS和 autoprefixer
- 资源模块处理(Asset Modules)
- 图片、字体等资源处理

### 第6章：代码分割和动态导入
**学习目标**：掌握代码分割技术

**主要内容**：
- splitChunks基础配置
- 动态导入 import()
- Chunk命名和分块策略
- 路由级代码分割

### 第7章：Tree-Shaking和模块合并
**学习目标**：掌握Tree-Shaking和模块优化

**主要内容**：
- Tree-Shaking原理
- sideEffects配置
- 模块合并(scope hoisting)
- 产物分析工具

### 第8章：Tapable基础使用
**学习目标**：掌握Tapable钩子的基本使用

**主要内容**：
- Tapable简介和安装
- 同步/异步钩子
- 基础钩子创建和调用
- 实际应用场景

### 第9章：Webpack原理深入
**学习目标**：理解Webpack核心原理

**主要内容**：
- Webpack构建流程
- 事件流机制
- 自定义Plugin和Loader
- 打包产物分析

### 第10章：模块联邦(Module Federation)
**学习目标**：掌握微前端架构基础

**主要内容**：
- Module Federation概念
- 远程模块配置
- 共享模块配置
- 微前端架构实践

### 第11章：性能优化和最佳实践
**学习目标**：掌握Webpack优化技术

**主要内容**：
- runtimeChunk配置
- 缓存优化
- 压缩和混淆
- 打包体积分析
- 构建速度优化
- 生产环境最佳配置

### 第12章：综合实战
**学习目标**：整合所有知识点，完成一个完整项目

**主要内容**：
- 项目架构设计
- 完整配置搭建
- 性能优化实践
- 生产环境部署配置

## Demo工程统一规范

### 技术栈
- TypeScript
- Vue3
- SCSS
- Webpack5
- pnpm

### 目录结构
```
chapterXX/
├── src/
│   ├── components/     # Vue组件
│   ├── pages/          # 页面
│   ├── utils/          # 工具函数
│   ├── styles/         # 样式文件
│   ├── App.vue
│   └── main.ts
├── public/
│   └── index.html
├── README.MD
├── webpack.config.js
├── tsconfig.json
└── package.json
```

### README.MD结构
1. 章节学习目标
2. 核心概念介绍
3. 依赖包说明（哪些是开发依赖、哪些是生产依赖，每个包的作用）
4. Loader/Plugin说明（使用的有哪些，起到什么作用）
5. 关键配置解析
6. 实践步骤

### 维护规则
- **每次修改 Demo 工程后（如添加/删除依赖包、修改配置等），必须同步更新对应的 README.md 文件**
- 确保 README 中的依赖包、Loader、Plugin 说明与实际代码保持一致
- 这条规则适用于所有章节的 Demo 工程
- **每次代码改动后都要进行 git commit 提交记录**
- 提交信息使用语义化提交规范（feat:、fix:、docs: 等）
