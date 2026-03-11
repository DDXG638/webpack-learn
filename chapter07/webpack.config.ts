import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
// webpack-bundle-analyzer 是 CommonJS 导出，使用默认导入
// @ts-ignore webpack-bundle-analyzer 缺少类型声明
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const mode = (argv.mode || 'development') as 'development' | 'production' | 'none';
  const isProduction = mode === 'production';
  const isAnalyze = env?.analyze;
  const isCdn = env?.cdn;

  return {
    // 入口文件
    entry: {
      main: './src/main.ts',
    },

    // 缓存配置
    cache: isProduction ? {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    } : true,

    // 输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      // 使用绝对路径，避免相对路径导致的资源 404 问题
      publicPath: '/',
      // 生产环境使用 contenthash 实现长期缓存
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      // 异步加载的 chunk 使用 chunkFilename
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      // 资源模块文件命名
      assetModuleFilename: 'assets/[hash][ext][query]',
      clean: true,
    },

    // 解析配置
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json', '.svg'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    // 外部扩展配置 - 通过 CDN 引入 Vue 时使用
    externals: isCdn ? {
      vue: 'Vue',
    } : {},

    // 优化配置 - Tree-Shaking 和模块合并核心
    optimization: {
      // 使用 ES 模块语法，启用 Tree-Shaking(标记未使用的导出)
      // 注意：Tree-Shaking 只在 production 模式下生效
      usedExports: true,

      // 开启模块合并（Scope Hoisting）
      // 将模块合并到单个函数中，减少函数闭包，提升执行效率
      // 注意：Scope Hoisting 只在 production 模式下生效
      concatenateModules: true,

      // 最小化删除未使用的导出
      // minimize: true 会在 production 模式下自动启用
      minimize: isProduction,

      // 分割代码块
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',

        cacheGroups: {
          // 提取 node_modules 中的代码
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            reuseExistingChunk: true,
          },

          // 提取公共代码
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },

      // runtimeChunk: 将 webpack 运行时代码抽取到单独文件
      runtimeChunk: isProduction ? 'single' : false,

      // 模块 ID 优化
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    },

    // 模块规则
    module: {
      rules: [
        // Vue单文件组件 Loader
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },

        // TypeScript Loader
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },

        // CSS Loader
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
          ],
        },

        // SCSS Loader
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

        // 图片资源处理
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },

        // 字体资源处理
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },

    // 插件配置
    plugins: [
      new VueLoaderPlugin(),

      new HtmlWebpackPlugin({
        template: isCdn ? './public/index-cdn.html' : './public/index.html',
        title: 'Webpack5 Tree-Shaking和模块合并 Demo',
        filename: 'index.html',
        inject: 'body',
        minify: isProduction ? {
          collapseWhitespace: true,
          removeComments: true,
        } : false,
      }),

      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: 'css/[name].[contenthash].chunk.css',
        }),
      ] : []),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(mode),
        },
        __APP_NAME__: JSON.stringify('Webpack5 Tree-Shaking Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
      }),

      // 打包分析工具
      ...(isAnalyze ? [new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true,
      })] : []),
    ],

    // 开发服务器配置
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 8080,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
    },

    // 模式
    mode: mode,

    // 开发环境 Source Map 配置
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
