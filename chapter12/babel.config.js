module.exports = {
  presets: [
    ['@babel/preset-env', {
      // browserslist 会自动从 .browserslistrc 文件读取
      // modules: false 让 webpack 处理模块，实现 tree-shaking
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3,
    }],
  ],
};
