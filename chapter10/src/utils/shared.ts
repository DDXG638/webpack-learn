/**
 * 格式化日期
 * @param date - 日期对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化金额
 * @param amount - 金额
 * @returns 格式化后的金额字符串
 */
export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * 版本号
 */
export const VERSION = '1.0.0';

/**
 * 应用信息
 */
export const APP_INFO = {
  name: 'Module Federation Demo',
  version: VERSION,
  author: 'Webpack Learn',
};

/**
 * 工具函数集合
 */
export const utils = {
  formatDate,
  formatCurrency,
  VERSION,
  APP_INFO,
};

export default utils;
