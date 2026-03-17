import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
import type { Compiler, Compilation } from 'webpack';
import * as Tapable from 'tapable';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自定义插件：演示 Tapable 钩子的使用
class TapablePlugin {
  name = 'TapablePlugin';

  apply(compiler: Compiler) {
    // 1. 同步钩子 - SyncHook
    // 最基础的钩子，按注册顺序同步执行所有回调
    compiler.hooks.emit.tap(this.name, (_compilation: Compilation) => {
      console.log('【SyncHook】emit 钩子触发 - 同步执行');
      // 可以在此处修改打包输出
    });

    // 2. 同步保险钩子效果演示 - 通过 beforeCompile
    // 如果有返回值，将停止执行后续回调
    compiler.hooks.beforeCompile.tap(this.name, (_compilationParams: any) => {
      console.log('【SyncBailHook】beforeCompile 钩子触发');
      return; // 返回值会停止后续回调执行
    });

    // 3. 异步串行钩子 - AsyncSeriesHook
    // 异步按顺序执行，通过 tapAsync 注册
    compiler.hooks.afterEmit.tapAsync(this.name, (_compilation: Compilation, callback: (err?: Error) => void) => {
      console.log('【AsyncSeriesHook】afterEmit 钩子触发 - 异步串行');
      setTimeout(() => {
        console.log('  异步任务完成');
        callback();
      }, 100);
    });

    // 4. 使用 compilation 钩子
    compiler.hooks.compilation.tap(this.name, (compilation: Compilation) => {
      // 对每个 chunk 进行处理
      compilation.chunkGroups.forEach((chunkGroup: any) => {
        console.log(`处理 Chunk 组: ${chunkGroup.name}`);
      });
    });
  }
}

// 演示自定义钩子类的创建和使用
class BuildHooks {
  // 定义钩子
  beforeBuild = new Tapable.SyncHook(['files']);
  build = new Tapable.SyncHook(['buildInfo']);
  afterBuild = new Tapable.AsyncSeriesHook(['success']);

  // 触发钩子
  runBeforeBuild(files: string[]) {
    console.log('\n=== 触发 beforeBuild 钩子 ===');
    this.beforeBuild.call(files);
  }

  runBuild(info: { entry: string; output: string }) {
    console.log('\n=== 触发 build 钩子 ===');
    this.build.call(info);
  }

  runAfterBuild(success: boolean) {
    console.log('\n=== 触发 afterBuild 钩子 ===');
    this.afterBuild.callAsync(success, (err: Error | null) => {
      if (err) {
        console.error('构建后处理失败:', err);
      } else {
        console.log('构建后处理完成');
      }
    });
  }
}

// 使用自定义钩子
const buildHooks = new BuildHooks();

// 注册自定义钩子的回调
buildHooks.beforeBuild.tap('Plugin1', (...args: any[]) => {
  console.log('  [Plugin1] 检查文件:', args);
});

buildHooks.beforeBuild.tap('Plugin2', (..._args: any[]) => {
  console.log('  [Plugin2] 验证文件完整性');
});

buildHooks.build.tap('Plugin1', (...args: any[]) => {
  const info = args[0] as { entry: string; output: string };
  console.log('  [Plugin1] 开始构建:', info.entry);
});

buildHooks.build.tap('Plugin2', (...args: any[]) => {
  const info = args[0] as { entry: string; output: string };
  console.log('  [Plugin2] 输出目录:', info.output);
});

// 模拟构建流程
function simulateBuild() {
  buildHooks.runBeforeBuild(['src/main.ts', 'src/App.vue']);
  buildHooks.runBuild({ entry: './src/main.ts', output: './dist' });
  buildHooks.runAfterBuild(true);
}

export default (_env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const mode = (argv.mode || 'development') as 'development' | 'production';
  const isProduction = mode === 'production';

  // 开发环境下演示自定义钩子
  if (!isProduction) {
    console.log('\n========== Tapable 钩子演示 ==========');
    simulateBuild();
    console.log('======================================\n');
  }

  return {
    // 入口文件
    entry: {
      main: './src/main.ts',
    },

    // 缓存配置
    cache: isProduction ? {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    } : true,

    // 输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
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

    // 优化配置
    optimization: {
      usedExports: true,
      concatenateModules: true,
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: isProduction ? 'single' : false,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    },

    // 模块规则
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
            isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
          ],
        },
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
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
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
        title: 'Webpack5 Tapable基础使用 Demo',
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
        __APP_NAME__: JSON.stringify('Webpack5 Tapable Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
      }),

      // 应用自定义 Tapable 插件
      new TapablePlugin(),
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
      historyApiFallback: true,
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

    // 开发环境 Source Map 配置
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
