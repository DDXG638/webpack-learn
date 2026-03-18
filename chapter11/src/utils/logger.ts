/**
 * 日志工具
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

const logs: LogEntry[] = [];

/**
 * 记录日志
 */
export function log(level: LogLevel, message: string): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date(),
  };

  logs.push(entry);

  const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'info':
      console.log(prefix, message);
      break;
    case 'warn':
      console.warn(prefix, message);
      break;
    case 'error':
      console.error(prefix, message);
      break;
    case 'debug':
      console.debug(prefix, message);
      break;
  }
}

/**
 * 获取所有日志
 */
export function getLogs(): LogEntry[] {
  return [...logs];
}

/**
 * 清除日志
 */
export function clearLogs(): void {
  logs.length = 0;
}
