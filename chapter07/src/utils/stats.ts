/**
 * 统计工具函数 - 模块 C
 */

import { sum, average, max, min } from './array';

export function getStats(arr: number[]) {
  return {
    sum: sum(arr),
    average: average(arr),
    max: max(arr),
    min: min(arr),
    count: arr.length,
  };
}

export function getRange(arr: number[]): number {
  return max(arr) - min(arr);
}

export function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
