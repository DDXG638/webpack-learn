import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack, { Configuration, WebpackPluginInstance } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebpackConfig = any;

// 环境类型
type WebpackEnv = {
  analyze?: boolean;
  performance?: boolean;
};

export default (env: WebpackEnv, argv: Record<string, string | undefined>): Configuration => {
  const isProduction = argv.mode === 'production';
  const needAnalyze = env?.analyze;

  const plugins: WebpackPluginInstance[] = [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Webpack5 性能优化 Demo',
      inject: true,
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      } : false,
    }),

    // 定义 Vue 编译时特性标志
    // 解决 esm-bundler 版本警告
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true, // 是否保留 Options API 支持
      __VUE_PROD_DEVTOOLS__: false, // 生产环境是否启用 DevTools
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 生产环境是否显示 hydration 详细错误
    }),
  ];

  if (isProduction) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }));
  }

  if (needAnalyze) {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: true,
    }))
  }

  const config: WebpackConfig = {
    // 入口文件
    entry: {
      main: './src/main.ts',
    },

    // 输出配置
    output: {
      path: join(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
      clean: true,
    },

    // 解析配置
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
      alias: {
        '@': join(__dirname, 'src'),
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
    },

    // 模块规则
    module: {
      rules: [
        // TypeScript
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },

        // Vue 单文件组件
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },

        // CSS
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
          ],
        },

        // SCSS
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
            'sass-loader',
          ],
        },

        // 图片资源
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
          generator: {
            filename: 'images/[name].[hash:8][ext]',
          },
        },

        // 字体资源
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },

    // 插件配置
    plugins,

    // 优化配置
    optimization: {
      // 使用 ES 模块语法，启用 Tree-Shaking(标记未使用的导出)
      usedExports: true,
      // 开启压缩
      minimize: isProduction,

      // 压缩器配置
      minimizer: [
        // Terser 压缩 JS
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info'] : [],
            },
            mangle: true,
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),

        // CSS 压缩
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],

      // ========== 关键优化配置 ==========

      // 1. runtimeChunk: 将 runtime 代码抽离到单独文件
      // runtimeChunk: true, 两种配置方式效果是一样的
      runtimeChunk: {
        name: 'runtime',
      },

      // 2. splitChunks: 代码分割配置
      splitChunks: {
        chunks: 'all',
        // maxSize 告诉 webpack 尝试将大于 maxSize 个字节的 chunk 分割成较小的部分。 这些较小的部分在体积上至少为 minSize（仅次于 maxSize）
        minSize: 30000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
            priority: -10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },

      // 3. 模块 ID 优化
      moduleIds: 'deterministic',

      // 4. Chunk ID 优化
      chunkIds: needAnalyze ? 'named' : 'deterministic',

      // 5. 启用作用域提升
      // 开启模块合并（Scope Hoisting）
      // 将模块合并到单个函数中，减少函数闭包，提升执行效率
      // 注意：Scope Hoisting 只在 production 模式下生效
      // see: https://www.webpackjs.com/plugins/module-concatenation-plugin#root
      concatenateModules: true,
    },

    // 6. 使用缓存
    cache: {
      type: 'filesystem' as const,
      buildDependencies: {
        config: [__filename],
      },
    },

    // 开发服务器配置
    devServer: {
      port: 8080,
      hot: true,
      open: false,
      compress: true,
      historyApiFallback: true,
    },

    // 性能配置
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    // Source Map 配置
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    // 统计信息配置
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    },
  };

  return config;
};
