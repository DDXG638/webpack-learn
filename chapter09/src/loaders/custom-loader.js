/**
 * 自定义 Loader 示例
 *
 * Loader 本质上是一个函数，接收 source（源代码），返回转换后的代码
 *
 * Loader 函数签名：
 * function(source, sourceMap?, meta?)
 * - source: 源代码
 * - sourceMap: 源映射（可选）
 * - meta: 元数据（可选）
 *
 * @param {string} source - 原始源代码
 * @returns {string} 转换后的代码
 */
module.exports = function(source) {
  console.log(`[CustomLoader] 处理文件: ${this.resourcePath}`);
  console.log(`[CustomLoader] 原始代码长度: ${source.length}`);

  // 可以在这里对源代码进行处理
  // 例如：添加注释、替换内容、转换语法等

  // 示例：给代码添加头部注释
  const processedSource = `
/*
 * 自定义 Loader 处理后的代码
 * 原始文件: ${this.resourcePath}
 */
${source}
`;

  // 将原始内容转换为 JS 模块导出
  // 使用 JSON.stringify 来正确处理字符串中的特殊字符
  const finallySource = `export default ${JSON.stringify(processedSource)};`;

  // 返回处理后的代码
  // 如果需要返回 sourceMap，可以使用 this.callback(null, processedSource, sourceMap)
  return finallySource;
};
