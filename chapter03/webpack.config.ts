import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// 自定义 Plugin 示例：BannerPlugin
// 在每个生成的 JS 文件头部添加版权信息
// ============================================
class BannerPlugin {
  options: { banner?: string };

  constructor(options: { banner?: string } = {}) {
    this.options = options;
  }

  apply(compiler: webpack.Compiler) {
    // 使用 emit 钩子，在生成资源并输出到目录之前执行
    compiler.hooks.emit.tap('BannerPlugin', (compilation) => {
      // 遍历所有生成的资源文件
      Object.keys(compilation.assets).forEach((filename) => {
        // 只在 JS 文件头部添加 banner
        if (filename.endsWith('.js')) {
          const source = compilation.assets[filename].source();
          const banner = `/*!
 * ${this.options.banner || 'Custom Banner'}
 * Generated at: ${new Date().toISOString()}
 */
`;

          // 更新资源内容
          compilation.assets[filename] = {
            source: () => banner + source,
            size: () => banner.length + source.length,
          } as unknown as webpack.sources.Source;
        }
      });
    });
  }
}

// ============================================
// 自定义 Plugin 示例：FileListPlugin
// 生成一个包含所有输出文件列表的 JSON 文件
// ============================================
class FileListPlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tap('FileListPlugin', (compilation) => {
      const files = Object.keys(compilation.assets).sort();
      const fileList = {
        generatedAt: new Date().toISOString(),
        files: files,
        totalFiles: files.length,
      };

      // 添加 JSON 文件到输出目录
      compilation.assets['file-list.json'] = {
        source: () => JSON.stringify(fileList, null, 2),
        size: () => JSON.stringify(fileList, null, 2).length,
      } as unknown as webpack.sources.Source;
    });
  }
}

// ============================================
// 自定义 Plugin 示例：HookDebugPlugin
// 监控关键 compiler 和 compilation 钩子的执行顺序
// 仅处理 src/* 目录下的文件，过滤 node_modules
// ============================================
class HookDebugPlugin {
  options: {
    srcPath: string;
    enabled: boolean;
  };

  constructor(options: { srcPath?: string; enabled?: boolean } = {}) {
    this.options = {
      srcPath: options.srcPath || path.resolve(__dirname, 'src'),
      enabled: options.enabled !== false,
    };
  }

  // 判断是否为 src 目录下的文件
  private isSrcFile(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    const srcNormalizedPath = this.options.srcPath.replace(/\\/g, '/');
    return normalizedPath.startsWith(srcNormalizedPath);
  }

  // 格式化模块路径显示
  private formatModulePath(filePath: string): string {
    if (!filePath) return 'unknown';
    // 提取相对路径
    const relativePath = filePath.replace(this.options.srcPath, '').replace(/^[/\\]/, '');
    return relativePath || filePath.split('/').pop() || filePath;
  }

  apply(compiler: webpack.Compiler) {
    if (!this.options.enabled) return;

    const srcPath = this.options.srcPath;

    // ============================================
    // Compiler 钩子
    // ============================================

    // entryOption: 在 webpack 配置中的 entry 配置处理完成后调用
    compiler.hooks.entryOption.tap('HookDebugPlugin', (context, entry) => {
      console.log('\n🔵 [Compiler] entryOption - 入口配置处理完成');
      console.log('   Entry points:', Object.keys(entry));
      return undefined;
    });

    // run: 开始一次新的编译
    compiler.hooks.run.tap('HookDebugPlugin', (compiler) => {
      console.log('\n🟢 [Compiler] run - 开始编译');
      console.log('   Context:', compiler.context);
    });

    // compile: 触发一次新的编译（在 run 之后）
    compiler.hooks.compile.tap('HookDebugPlugin', () => {
      console.log('\n🟡 [Compiler] compile - 开始编译阶段');
    });

    // compilation: 创建新的 compilation
    compiler.hooks.compilation.tap('HookDebugPlugin', (compilation) => {
      console.log('\n🟠 [Compiler] compilation - 创建新编译对象');

      // ============================================
      // Compilation 钩子
      // ============================================

      // buildModule: 模块开始构建
      compilation.hooks.buildModule.tap('HookDebugPlugin', (module: any) => {
        if (module.resource && this.isSrcFile(module.resource)) {
          console.log('   📦 [Compilation] buildModule - 构建模块:', this.formatModulePath(module.resource));
        }
      });

      // rebuildModule: 模块重新构建
      compilation.hooks.rebuildModule.tap('HookDebugPlugin', (module: any) => {
        if (module.resource && this.isSrcFile(module.resource)) {
          console.log('   🔄 [Compilation] rebuildModule - 重新构建模块:', this.formatModulePath(module.resource));
        }
      });

      // succeedModule: 模块构建成功
      compilation.hooks.succeedModule.tap('HookDebugPlugin', (module: any) => {
        if (module.resource && this.isSrcFile(module.resource)) {
          console.log('   ✅ [Compilation] succeedModule - 模块构建成功:', this.formatModulePath(module.resource));
        }
      });

      // finishModules: 所有模块构建完成
      compilation.hooks.finishModules.tap('HookDebugPlugin', (modules: Iterable<any>) => {
        console.log('\n   🎯 [Compilation] finishModules - 所有模块构建完成');
        const srcModules = Array.from(modules).filter((m: any) => m.resource && this.isSrcFile(m.resource));
        if (srcModules.length > 0) {
          console.log('   涉及的 src 模块:');
          srcModules.forEach((m: any) => {
            console.log('      -', this.formatModulePath(m.resource));
          });
        }
      });

      // chunkAsset: Chunk 资源被添加到 compilation
      compilation.hooks.chunkAsset.tap('HookDebugPlugin', (chunk, filename) => {
        console.log('   📄 [Compilation] chunkAsset - Chunk 资源生成:', filename);
        // 找出这个 chunk 包含的模块
        const modules = Array.from(chunk.getModules());
        const srcModules = modules.filter((m: any) => m.resource && this.isSrcFile(m.resource));
        if (srcModules.length > 0) {
          console.log('      包含的 src 模块:');
          srcModules.forEach((m: any) => {
            console.log('         -', this.formatModulePath(m.resource));
          });
        }
      });
    });

    // emit: 在生成资源并输出到目录之前
    compiler.hooks.emit.tap('HookDebugPlugin', (compilation) => {
      console.log('\n🔵 [Compiler] emit - 生成输出资源');
      console.log('   输出文件列表:');
      Object.keys(compilation.assets).forEach(asset => {
        const size = compilation.assets[asset].size();
        console.log(`      - ${asset} (${(size / 1024).toFixed(2)} KB)`);
      });
    });

    // assetEmitted: 资源已生成
    compiler.hooks.assetEmitted.tap('HookDebugPlugin', (file, { content, source, outputPath, targetPath }) => {
      console.log('   📤 [Compiler] assetEmitted - 资源已输出:', file);
    });

    // done: 编译完成
    compiler.hooks.done.tap('HookDebugPlugin', (stats) => {
      console.log('\n🏁 [Compiler] done - 编译完成');
      console.log('   编译结果:', stats.hasErrors() ? '有错误 ❌' : '成功 ✅');
      console.log('   总模块数:', stats.compilation.modules.size);
      console.log('   总 chunks 数:', stats.compilation.chunks.size);
      console.log('   总资源数:', Object.keys(stats.compilation.assets).length);
    });
  }
}

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  // 获取当前模式
  const mode = (argv.mode || 'development') as 'development' | 'production' | 'none';
  const isProduction = mode === 'production';

  return {
    // 入口文件
    entry: './src/main.ts',

    // 输出配置
    output: {
      // 输出目录
      path: path.resolve(__dirname, 'dist'),
      // 输出文件名
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      // 资源文件输出目录
      assetModuleFilename: 'assets/[hash][ext][query]',
      // 清除输出目录
      clean: true,
    },

    // 解析配置
    resolve: {
      // 文件扩展名
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
      // 路径别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // 模块规则
    module: {
      rules: [
        // ============================================
        // 1. Vue单文件组件 Loader
        // ============================================
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },

        // ============================================
        // 2. TypeScript Loader (ts-loader)
        // ============================================
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },

        // ============================================
        // 3. CSS Loader (处理CSS文件)
        // ============================================
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
          ],
        },

        // ============================================
        // 4. SCSS Loader (处理SCSS/SASS文件)
        // ============================================
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern',
              },
            },
          ],
        },

        // ============================================
        // 5. 图片资源处理 (Webpack5 Asset Modules)
        // ============================================
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
      ],
    },

    // ============================================
    // 插件配置
    // ============================================
    plugins: [
      // ============================================
      // 1. VueLoaderPlugin
      // 职责：将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
      // ============================================
      new VueLoaderPlugin(),

      // ============================================
      // 2. HtmlWebpackPlugin
      // 作用：自动生成 HTML 文件，并引入打包后的 JS/CSS 资源
      // ============================================
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Webpack5 Plugin 学习',
        // 生成文件名
        filename: 'index.html',
        // 注入 JS 到 body 底部
        inject: 'body',
        // 是否压缩
        minify: isProduction ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
        } : false,
      }),

      // ============================================
      // 3. MiniCssExtractPlugin (生产环境)
      // 作用：将 CSS 提取到独立的文件中，而不是内联到 JS 中
      // ============================================
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          // 输出文件名
          filename: 'css/[name].[contenthash].css',
          // chunk 文件名
          chunkFilename: 'css/[name].[contenthash].chunk.css',
        }),
      ] : []),

      // ============================================
      // 4. DefinePlugin
      // 作用：定义全局常量，可以在应用代码中使用
      // ============================================
      new webpack.DefinePlugin({
        // 定义环境变量
        'process.env': {
          NODE_ENV: JSON.stringify(mode),
          APP_NAME: JSON.stringify('Webpack5 Plugin Demo'),
          APP_VERSION: JSON.stringify('1.0.0'),
        },
        // 定义全局变量
        __APP_NAME__: JSON.stringify('Webpack5 Plugin Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        // 定义一个函数
        __FEATURE_FLAGS__: JSON.stringify({
          enableNewUI: true,
          enableAnalytics: false,
        }),
      }),

      // ============================================
      // 5. EnvironmentPlugin
      // 作用：简化版 DefinePlugin，专门用于环境变量
      // ============================================
      new webpack.EnvironmentPlugin({
        NODE_ENV: mode,
        DEBUG: !isProduction,
      }),

      // ============================================
      // 6. BannerPlugin (自定义)
      // 作用：在每个生成的 JS 文件头部添加版权信息
      // ============================================
      new BannerPlugin({
        banner: 'Webpack5 Plugin Demo - Chapter 3',
      }),

      // ============================================
      // 7. FileListPlugin (自定义)
      // 作用：生成文件列表 JSON
      // ============================================
      new FileListPlugin(),

      // ============================================
      // 8. HookDebugPlugin (自定义)
      // 作用：监控关键钩子执行顺序和模块变化
      // ============================================
      new HookDebugPlugin({
        srcPath: path.resolve(__dirname, 'src'),
        enabled: true,
      }),
    ],

    // 开发服务器配置
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true,
    },

    // 模式
    mode: mode,

    // Source Map
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
