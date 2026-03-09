import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const mode = (argv.mode || 'development') as 'development' | 'production' | 'none';
  const isProduction = mode === 'production';

  return {
    // 入口文件
    entry: './src/main.ts',

    // 缓存配置
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },

    // 输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
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

        // CSS Loader - 启用 CSS Modules
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  // 开发环境使用简短名称方便调试
                  localIdentName: isProduction
                    ? '[hash:base64:8]'
                    : '[name]__[local]--[hash:base64:5]',
                  // 自动导出 class 名称
                  exportOnlyLocals: false,
                },
              },
            },
            'postcss-loader',
          ],
        },

        // SCSS Loader - 启用 CSS Modules
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProduction
                    ? '[hash:base64:8]'
                    : '[name]__[local]--[hash:base64:5]',
                },
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern',
              },
            },
          ],
        },

        // 图片资源处理 - 使用资源模块
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8KB 以下内联为 Base64
            },
          },
        },

        // 字体资源处理 - 使用资源模块
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
        title: 'Webpack5 CSS处理和资源管理',
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
        __APP_NAME__: JSON.stringify('Webpack5 CSS Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
      }),
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
  };
};
