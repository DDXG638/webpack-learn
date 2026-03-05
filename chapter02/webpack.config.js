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
            transpileOnly: true, // 开启快速编译，不进行类型检查
          },
          exclude: /node_modules/,
        },

        // ============================================
        // 3. Babel Loader (将ES6+转换为ES5)
        // ============================================
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              // 开启缓存
              cacheDirectory: true,
            },
          },
        },

        // ============================================
        // 4. Raw Loader (将文件作为字符串加载)
        // ============================================
        {
          test: /\.txt$/,
          type: 'asset/source', // Webpack5 使用 asset/source 替代 raw-loader
        },

        // ============================================
        // 5. CSS Loader (处理CSS文件)
        // ============================================
        {
          test: /\.css$/,
          use: [
            isProduction ? 'style-loader' : 'vue-style-loader',
            'css-loader',
          ],
        },

        // ============================================
        // 6. SCSS Loader (处理SCSS/SASS文件)
        // ============================================
        {
          test: /\.scss$/,
          use: [
            // style-loader: 把 CSS 插入到 DOM 中
            isProduction ? 'style-loader' : 'vue-style-loader',
            // 将 CSS 转化成 ES 模块，会对 @import 和 url() 进行处理
            'css-loader',
            // 将 Sass 编译成 CSS
            {
              loader: 'sass-loader',
              options: {
                // 使用现代 API 避免 legacy 警告
                api: 'modern',
              },
            },
          ],
        },

        // ============================================
        // 7. 图片资源处理 (Webpack5 Asset Modules)
        // ============================================
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              // 小于8KB的图片转为Base64
              maxSize: 8 * 1024,
            },
          },
        },

        // ============================================
        // 8. 字体资源处理 (Webpack5 Asset Modules)
        // ============================================
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },

    // 插件
    plugins: [
      // 这个插件的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
      // 例如，如果你设置了 /\.js$/ 和 /\.css$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块 和 <style>块。
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Webpack5 Loader 学习',
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
