import { join } from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { webpack } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default (): Configuration => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    entry: {
      main: './src/main.ts',
    },

    output: {
      path: join(__dirname, 'dist'),
      filename: '[name].[contenthash:8].js',
      chunkFilename: '[name].[contenthash:8].chunk.js',
      clean: true,
      chunkIds: 'named',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
      alias: {
        '@': join(__dirname, 'src'),
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
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
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },

    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Webpack5 性能优化 Demo',
      }),
      isProduction && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),

      // Bundle Analyzer 插件 - 用于分析打包体积
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // 生成 HTML 报告
        reportFilename: 'bundle-report.html',
        openAnalyzer: true, // 自动打开报告
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
      }),
    ].filter(Boolean) as webpack.WebpackPluginInstance[],

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
            },
            mangle: true,
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
      runtimeChunk: {
        name: 'runtime',
      },
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
          },
          vue: {
            test: /[\\/]node_modules[\\/](vue|@vue)[\\/]/,
            name: 'vue',
            chunks: 'all',
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
          },
        },
      },
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      concatenateModules: true,
    },

    devServer: {
      port: 8080,
      hot: true,
    },

    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  };
};
