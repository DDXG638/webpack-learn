/* @async-processed */

/**
 * 自定义 Loader 测试文件
 */

// 测试字符串替换 - Hello 会被 replace-loader 替换
const greeting = 'Hello, World!';

/* @async-processed */
const asyncMessage = 'Async processing test';

console.log('Greeting:', greeting);
console.log('Async Message:', asyncMessage);

// 导出用于测试
module.exports = {
  greeting,
  asyncMessage,
};
