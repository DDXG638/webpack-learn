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
 * Remote 应用 - 提供远程模块
 */
class RemoteBuildPlugin {
  name = 'RemoteBuildPlugin';

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(this.name, (stats) => {
      console.log('\n========== Remote 应用构建完成 ==========');
      console.log('暴露模块:');
      console.log('  - ./Button  -> Button.vue');
      console.log('  - ./Header  -> Header.vue');
      console.log('  - ./Counter -> Counter.vue');
      console.log('  - ./utils   -> shared.ts');
      console.log('访问地址: http://localhost:3001');
      console.log('==========================================\n');
    });
  }
}

export default {
  name: 'remote',

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
        // 移除 NODE_ENV，让 Webpack 自动处理
      },
    }),

    new RemoteBuildPlugin(),
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
