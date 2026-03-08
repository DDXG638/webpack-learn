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
    compiler.hooks.emit.tap('BannerPlugin', (compilation) => {
      Object.keys(compilation.assets).forEach((filename) => {
        if (filename.endsWith('.js')) {
          const source = compilation.assets[filename].source();
          const banner = `/*!
 * ${this.options.banner || 'Custom Banner'}
 * Generated at: ${new Date().toISOString()}
 */
`;

          compilation.assets[filename] = {
            source: () => banner + source,
            size: () => banner.length + source.length,
          } as unknown as webpack.sources.Source;
        }
      });
    });
  }
}

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const mode = (argv.mode || 'development') as 'development' | 'production' | 'none';
  const isProduction = mode === 'production';

  return {
    // 入口文件
    entry: './src/main.ts',

    // ============================================
    // 缓存配置
    // ============================================
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
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
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
      ],
    },

    // ============================================
    // 插件配置
    // ============================================
    plugins: [
      new VueLoaderPlugin(),

      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Webpack5 开发环境配置',
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
        __APP_NAME__: JSON.stringify('Webpack5 Dev Server Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
      }),

      new BannerPlugin({
        banner: 'Webpack5 Dev Server Demo - Chapter 4',
      }),
    ],

    // ============================================
    // 开发服务器配置
    // ============================================
    devServer: {
      // 静态文件目录
      static: {
        directory: path.join(__dirname, 'public'),
      },

      // 端口号
      port: 8080,

      // 自动打开浏览器
      open: true,

      // 启用热模块替换
      hot: true,

      // 启用 gzip 压缩
      compress: true,

      // 开发环境代理配置
      proxy: {
        // API 请求代理
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },

      // .historyApiFallback 配置（SPA 路由支持）
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.html' },
        ],
      },

      // 客户端配置
      client: {
        // 在浏览器控制台显示编译错误
        overlay: {
          errors: true,
          warnings: false,
        },
        // 显示编译进度
        progress: true,
      },
    },

    // ============================================
    // Source Map 配置
    // ============================================
    // 开发环境使用 eval-source-map（构建快，支持断点调试）
    // 生产环境使用 source-map（生成独立 map 文件）
    devtool: isProduction ? 'source-map' : 'eval-source-map',

    // 模式
    mode: mode,
  };
};
