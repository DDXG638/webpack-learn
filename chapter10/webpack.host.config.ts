import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
import type { Compiler } from 'webpack';
// 动态导入 ModuleFederationPlugin
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Host 应用 - 消费远程模块的主应用
 */
class HostBuildPlugin {
  name = 'HostBuildPlugin';

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(this.name, (stats) => {
      console.log('\n========== Host 应用构建完成 ==========');
      console.log('访问地址: http://localhost:3000');
      console.log('========================================\n');
    });
  }
}

export default {
  name: 'host',

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
        // 远程应用别名: 远程应用名称@远程域名/{远程应用别名}.js
        remoteApp: 'remoteApp@http://localhost:3001/remoteApp.js',
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

    new HostBuildPlugin(),
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
