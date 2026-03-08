import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
import type { Configuration } from 'webpack';
import type { Entry } from 'webpack';
import type { Output } from 'webpack';
import type { Module } from 'webpack';
import type { Plugins } from 'webpack';
import type { Resolve } from 'webpack';
import type { DevServer } from 'webpack-dev-server';

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
          };
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
      };
    });
  }
}

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>): Configuration => {
  // 获取当前模式
  const mode = argv.mode || 'development';
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
    } as Output,

    // 解析配置
    resolve: {
      // 文件扩展名
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
      // 路径别名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    } as Resolve,

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
    } as Module,

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
    ] as Plugins,

    // 开发服务器配置
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 8080,
      hot: true,
      open: true,
    } as DevServer,

    // 模式
    mode: mode,

    // Source Map
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
