/**
 * Markdown Loader (简化版)
 * 将 Markdown 文件转换为 HTML 字符串
 *
 * 这是一个同步 loader 的示例
 * 实际项目中可以使用 marked 等库
 */
module.exports = function markdownLoader(source) {
  // 简单的 Markdown 转换（仅作演示）
  let html = source
    // 标题处理
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 代码块
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // 行内代码
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // 链接
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // 图片
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
    // 段落
    .replace(/\n\n/g, '</p><p>')
    // 换行
    .replace(/\n/g, '<br>');

  // 包装成 HTML 片段
  const result = `<div class="markdown-content">${html}</div>`;

  // 返回 JS 模块代码
  return `module.exports = ${JSON.stringify(result)}`;
};
