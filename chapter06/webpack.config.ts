import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
// 动态导入 webpack-bundle-analyzer 以避免类型问题
let BundleAnalyzerPlugin: any;
try {
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
} catch (e) {
  BundleAnalyzerPlugin = null;
}

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const mode = (argv.mode || 'development') as 'development' | 'production' | 'none';
  const isProduction = mode === 'production';
  const isAnalyze = env?.analyze;

  return {
    // 入口文件 - 演示多入口配置
    entry: {
      // 主应用入口
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

    // 优化配置 - 代码分割核心
    optimization: {
      // 分割代码块
      splitChunks: {
        // chunks: 'all' 表示同时分割异步和同步代码
        // chunks: 'async' 只分割异步代码（动态导入）
        // chunks: 'initial' 只分割同步代码（初始加载）
        chunks: 'all',
        // 最小体积 - 超过此大小才会被分割
        minSize: 20000,
        // 最大体积 - 超过此大小会尝试分割
        maxSize: 244000,
        // 最小引用次数 - 模块被引用次数达到此值才会被分割
        minChunks: 1,
        // 最大异步请求数 - 最多分割成多少个异步 chunk
        maxAsyncRequests: 30,
        // 最大初始请求数 - 最多分割成多少个初始 chunk
        maxInitialRequests: 30,
        // 自动命名连接符
        automaticNameDelimiter: '~',

        // 缓存组配置
        cacheGroups: {
          //  vendors: 提取 node_modules 中的代码
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10, // 优先级，数值越大越优先匹配
            reuseExistingChunk: true, // 复用已存在的 chunk
          },

          // common: 提取公共代码
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },

          // vue: 单独分割 Vue 框架代码
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            name: 'vue-vendor',
            priority: 20,
            reuseExistingChunk: true,
          },

          // styles: 提取样式文件
          // 告诉 webpack 忽略 splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests 和 splitChunks.maxInitialRequests 选项，并始终为此缓存组创建 chunk。
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },

      // runtimeChunk: 将 webpack 运行时代码抽取到单独文件
      // 'single' 表示所有入口共享一个 runtime 文件
      // 也可以配置为对象，为不同入口生成不同的 runtime
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
        template: './public/index.html',
        title: 'Webpack5 代码分割和动态导入 Demo',
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
        __APP_NAME__: JSON.stringify('Webpack5 代码分割 Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
      }),

      // 打包分析工具
      ...(isAnalyze && BundleAnalyzerPlugin ? [new BundleAnalyzerPlugin({
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
