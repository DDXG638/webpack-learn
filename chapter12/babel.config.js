module.exports = {
  presets: [
    ['@babel/preset-env', {
      // browserslist 会自动从 .browserslistrc 文件读取
      useBuiltIns: 'usage',
      corejs: 3,
    }],
  ],
};
