/**
 * 自定义 Plugin 示例
 *
 * Plugin 本质上是一个类或函数，需要实现 apply 方法
 * apply 方法会接收 compiler 对象，通过它可以注册各种钩子
 *
 * Plugin 结构：
 * - name: 插件名称（用于标识）
 * - apply(compiler): 入口方法，接收 compiler
 *
 * @see https://webpack.js.org/api/plugins/
 */

class CustomPlugin {
  constructor(options = {}) {
    this.options = options;
    this.name = 'CustomPlugin';
  }

  apply(compiler) {
    // 注册钩子
    compiler.hooks.emit.tap(this.name, (compilation) => {
      console.log(`[${this.name}] emit 钩子触发`);

      // 可以访问和修改 compilation 对象
      // 例如：添加新的资源文件、修改现有资源等

      // 示例：添加一个日志文件
      compilation.assets['plugin-log.txt'] = {
        source: () => `[${this.name}] 构建日志\n时间: ${new Date().toISOString()}`,
        size: () => 50,
      };
    });

    compiler.hooks.done.tap(this.name, (stats) => {
      console.log(`[${this.name}] 构建完成`);
      console.log(`[${this.name}] 错误数: ${stats.compilation.errors.length}`);
    });
  }
}

module.exports = CustomPlugin;
