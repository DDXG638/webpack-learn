/**
 * Bootstrap 入口
 * 使用动态 import 延迟加载，确保共享模块在运行时异步加载
 * 这样可以避免 "Shared module is not available for eager consumption" 错误
 */
import('./bootstrap');
