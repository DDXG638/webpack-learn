/**
 * 异步工具函数 - 用于演示动态导入
 */

export interface AsyncResult<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

/**
 * 异步数据加载模拟
 */
export async function fetchData<T>(url: string, delay = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ url, timestamp: Date.now() } as T);
    }, delay);
  });
}

/**
 * 批量处理
 */
export async function batchProcess<T>(
  items: T[],
  processor: (item: T) => Promise<void>
): Promise<void> {
  await Promise.all(items.map(processor));
}

/**
 * 重试机制
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
