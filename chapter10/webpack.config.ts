import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ============================================================
 * Host 应用配置（消费远程模块）
 * ============================================================
 */
const hostConfig = {
  name: 'host',
  mode: 'development',
  devtool: 'eval-source-map',

  entry: {
    host: './src/host.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist/host'),
    publicPath: 'auto',
    filename: '[name].js',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),

    // 模块联邦插件 - Host 角色
    new ModuleFederationPlugin({
      name: 'host',
      // 远程模块列表
      remotes: {
        // 远程应用别名: 远程应用名称@远程域名/remoteEntry.json
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
      },
      // 共享依赖
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.5.0',
        },
      },
    }),

    new HtmlWebpackPlugin({
      template: './public/host.html',
      filename: 'index.html',
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

/**
 * ============================================================
 * Remote 应用配置（提供远程模块）
 * ============================================================
 */
const remoteConfig = {
  name: 'remote',
  mode: 'development',
  devtool: 'eval-source-map',

  entry: {
    remote: './src/remote.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist/remote'),
    publicPath: 'auto',
    filename: '[name].js',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              api: 'modern',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),

    // 模块联邦插件 - Remote 角色
    new ModuleFederationPlugin({
      name: 'remoteApp',
      // 暴露的模块
      exposes: {
        // 导出路径: 文件路径
        './Button': './src/components/Button.vue',
        './Header': './src/components/Header.vue',
        './Counter': './src/components/Counter.vue',
        './utils': './src/utils/shared.ts',
      },
      // 共享依赖
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.5.0',
        },
      },
    }),

    new HtmlWebpackPlugin({
      template: './public/remote.html',
      filename: 'index.html',
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3001,
    hot: true,
    historyApiFallback: true,
  },
};

/**
 * ============================================================
 * 统一入口配置（开发模式演示）
 * ============================================================
 */
export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const target = env.target || 'host';

  console.log(`\n========== Module Federation Demo ==========`);
  console.log(`当前目标: ${target === 'host' ? 'Host 应用（消费方）' : 'Remote 应用（提供方）'}`);
  console.log(`=============================================\n`);

  return target === 'remote' ? remoteConfig : hostConfig;
};
