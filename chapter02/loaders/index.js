/**
 * 自定义 Loader 统一导出
 */
const bannerLoader = require('./banner-loader');
const replaceLoader = require('./replace-loader');
const markdownLoader = require('./markdown-loader');
const asyncDemoLoader = require('./async-demo-loader');

module.exports = {
  bannerLoader,
  replaceLoader,
  markdownLoader,
  asyncDemoLoader,
};
