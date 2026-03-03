import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
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
        // Vue单文件组件
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        // TypeScript
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },
        // CSS
        {
          test: /\.css$/,
          use: [
            isProduction ? 'style-loader' : 'vue-style-loader',
            'css-loader',
          ],
        },
        // SCSS
        {
          test: /\.scss$/,
          use: [
            isProduction ? 'style-loader' : 'vue-style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },

    // 插件
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Webpack5 基础学习',
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
