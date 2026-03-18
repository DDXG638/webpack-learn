/**
 * 格式化文件大小
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化数字
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return ((value / total) * 100).toFixed(2) + '%';
}
