/**
 * 异步 Loader 示例
 * 展示如何使用异步方式处理文件
 */
const { getOptions } = require('loader-utils');

module.exports = function asyncDemoLoader(source) {
  // 获取回调函数（异步模式）
  const callback = this.async();

  // 获取选项
  const options = getOptions(this) || {};

  // 模拟异步操作（比如读取额外配置、调用 API 等）
  setTimeout(() => {
    // 处理 source
    const result = source
      // 添加异步处理的标记
      .replace(
        '/* @async-processed */',
        `/* Processed by async-loader at ${new Date().toISOString()} */`
      );

    // 返回结果
    // callback(null, result, sourceMap, ast)
    callback(null, result);
  }, options.delay || 100);
};
