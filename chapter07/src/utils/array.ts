/**
 * 数组工具函数 - 模块 B
 */

import { add, multiply } from './math';

export function sum(arr: number[]): number {
  return arr.reduce((total, n) => add(total, n), 0);
}

export function product(arr: number[]): number {
  return arr.reduce((total, n) => multiply(total, n), 1);
}

export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

export function max(arr: number[]): number {
  return Math.max(...arr);
}

export function min(arr: number[]): number {
  return Math.min(...arr);
}
