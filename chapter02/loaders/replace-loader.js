/**
 * Replace Loader
 * 简单的字符串替换 Loader
 *
 * 使用方式：
 * {
 *   test: /\.js$/,
 *   use: {
 *     loader: 'replace-loader',
 *     options: {
 *       search: 'Hello',
 *       replace: '你好'
 *     }
 *   }
 * }
 */
module.exports = function replaceLoader(source) {
  // 获取 loader 配置的选项
  const options = this.getOptions() || {};

  const search = options.search;
  const replace = options.replace;
  const flags = options.flags || 'g';
  const isRegex = options.regex === true;

  if (!search) {
    return source;
  }

  let result;

  if (isRegex) {
    // 使用正则表达式替换
    const regex = new RegExp(search, flags);
    result = source.replace(regex, replace);
  } else {
    // 使用字符串替换
    const regex = new RegExp(escapeRegExp(search), flags);
    result = source.replace(regex, replace);
  }

  return result;
};

// 转义正则表达式特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
