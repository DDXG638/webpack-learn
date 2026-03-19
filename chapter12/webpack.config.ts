import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack, { Configuration, WebpackPluginInstance } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebpackConfig = any;

type WebpackEnv = {
  analyze?: boolean;
  cdn?: boolean;
};

export default (env: WebpackEnv, argv: Record<string, string | undefined>): Configuration => {
  const isProduction = argv.mode === 'production';
  const useCdn = env?.cdn;
  const needAnalyze = env?.analyze;

  const plugins: WebpackPluginInstance[] = [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      // CDN 模式使用不同的模板
      template: useCdn ? './public/index.cdn.html' : './public/index.html',
      title: 'Webpack5 综合实战',
      inject: true,
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      } : false,
    }),

    // 定义 Vue 编译时特性标志
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }),
  ];

  // 生产环境抽离 CSS 到单独文件（与 CDN 模式无关）
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
    }));
  }

  const config: WebpackConfig = {
    // 入口文件 - 多页面应用
    entry: {
      main: './src/main.ts',
    },

    // 输出配置
    output: {
      path: join(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
      clean: true,
      publicPath: '/',
    },

    // 解析配置
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
      alias: {
        '@': join(__dirname, 'src'),
        // 始终使用 runtime 版本（不带编译器）
        // vue-loader 已经在构建时编译了 .vue 文件
        'vue': 'vue/dist/vue.runtime.esm-bundler.js',
      },
    },

    // 模块规则
    module: {
      rules: [
        // TypeScript + Babel
        {
          test: /\.tsx?$/,
          use: [
            // babel-loader 在最后，先执行（从后往前）
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  ['@babel/preset-env', {
                    // browserslist 会自动从 .browserslistrc 读取
                    modules: false,
                  }],
                ],
              },
            },
            // ts-loader 在最前，后执行
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                transpileOnly: true,
              },
            },
          ],
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
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ].filter(Boolean),
        },

        // SCSS
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ].filter(Boolean),
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
      usedExports: true,
      minimize: isProduction,

      minimizer: [
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

      // 代码分割
      splitChunks: {
        chunks: 'all',
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

      runtimeChunk: {
        name: 'runtime',
      },

      moduleIds: 'deterministic',
      chunkIds: needAnalyze ? 'named' : 'deterministic',

      concatenateModules: true,
    },

    // CDN 模式外部化 Vue 相关依赖
    externals: useCdn ? {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      pinia: 'Pinia',
    } : {},

    // 开发服务器
    devServer: {
      port: 8080,
      hot: true,
      open: false,
      compress: true,
      historyApiFallback: true,
      static: {
        directory: join(__dirname, 'public'),
      },
    },

    // 性能配置
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

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
