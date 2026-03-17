import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
import type { Compiler } from 'webpack';
// webpack-bundle-analyzer 是 CommonJS 导出，使用默认导入
// @ts-ignore webpack-bundle-analyzer 缺少类型声明
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ============================================================
 * 自定义 Plugin：演示 Webpack 构建流程
 * ============================================================
 */
class BuildProcessPlugin {
  name = 'BuildProcessPlugin';

  apply(compiler: Compiler) {
    // 1. 初始化阶段 - beforeRun
    compiler.hooks.beforeRun.tap(this.name, (comp) => {
      console.log('\n========== Webpack 构建流程演示 ==========');
      console.log('【阶段1】beforeRun - 开始运行');
      console.log(`  入口文件: ${Object.values(comp.options.entry as any).join(', ')}`);
    });

    // 2. 初始化阶段 - run
    compiler.hooks.run.tap(this.name, (_comp) => {
      console.log('【阶段2】run - 开始编译');
    });

    // 3. 初始化阶段 - beforeCompile
    compiler.hooks.beforeCompile.tap(this.name, (_params) => {
      console.log('【阶段3】beforeCompile - 编译前准备');
      console.log(`  编译器名称: ${compiler.name}`);
    });

    // 4. 编译阶段 - compile
    compiler.hooks.compile.tap(this.name, (_params) => {
      console.log('【阶段4】compile - 开始编译');
    });

    // 5. 编译阶段 - make（从入口点开始分析依赖）
    compiler.hooks.make.tap(this.name, (_comp) => {
      console.log('【阶段5】make - 构建模块依赖图');
    });

    // 6. 编译阶段 - compilation
    compiler.hooks.compilation.tap(this.name, (comp) => {
      console.log('【阶段6】compilation - 创建编译对象');
      console.log(`  此时模块数量: ${comp.modules.size}`);

      // 在 compilation 钩子中注册 finishModules 钩子
      // finishModules 是在所有模块依赖图构建完成后触发的
      comp.hooks.finishModules.tap(this.name, (_modules: any) => {
        console.log('【阶段6.1】finishModules - 所有模块依赖图构建完成');
        console.log(`  模块数量: ${comp.modules.size}`);
      });
    });

    // 7. 生成阶段 - emit（输出资源前）
    compiler.hooks.emit.tap(this.name, (comp) => {
      console.log('【阶段7】emit - 输出资源到目录');
      const assets = Object.keys(comp.assets);
      console.log(`  输出文件: ${assets.length} 个`);
      assets.forEach((asset) => {
        const size = comp.assets[asset].size();
        console.log(`    - ${asset}: ${(size / 1024).toFixed(2)} KB`);
      });
    });

    // 8. 完成阶段 - afterEmit
    compiler.hooks.afterEmit.tap(this.name, (_comp) => {
      console.log('【阶段8】afterEmit - 输出完成');
    });

    // 9. 完成阶段 - done
    compiler.hooks.done.tap(this.name, (stats) => {
      console.log('【阶段9】done - 构建完成');
      console.log(`  耗时: ${stats.endTime - stats.startTime}ms`);
      console.log('=============================================\n');
    });
  }
}

/**
 * ============================================================
 * 自定义 Plugin：统计信息
 * ============================================================
 */
class StatsPlugin {
  name = 'StatsPlugin';

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(this.name, (stats) => {
      const info = stats.toJson(true);

      console.log('\n========== 构建统计信息 ==========');
      console.log(`模块数量: ${info.modules?.length || 0}`);
      console.log(`Chunk 数量: ${info.chunks?.length || 0}`);
      console.log(`资源文件: ${info.assets?.length || 0}`);
      console.log(`构建时间: ${info.time}ms`);

      if (info.errors?.length) {
        console.log(`错误数量: ${info.errors.length}`);
      }
      if (info.warnings?.length) {
        console.log(`警告数量: ${info.warnings.length}`);
      }
      console.log('=================================\n');
    });
  }
}

/**
 * ============================================================
 * 自定义 Plugin：修改输出文件
 * ============================================================
 */
class CustomAssetPlugin {
  name = 'CustomAssetPlugin';

  apply(compiler: Compiler) {
    // 在 emit 阶段添加自定义文件
    compiler.hooks.emit.tap(this.name, (comp) => {
      // 添加构建信息文件
      (comp.assets as any)['build-info.json'] = {
        source: () => JSON.stringify({
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          files: Object.keys(comp.assets),
        }, null, 2),
        size: () => 100,
      };

      console.log('[CustomAssetPlugin] 添加了 build-info.json');
    });
  }
}

export default (env: Record<string, string | undefined>, argv: Record<string, string | undefined>) => {
  const mode = (argv.mode || 'development') as 'development' | 'production';
  const isProduction = mode === 'production';
  const isAnalyze = env?.analyze;

  // 开发环境下演示构建流程
  if (!isProduction) {
    console.log('\n--- 模拟 Loader 处理流程 ---');
    console.log('  [Lifecycle] 加载模块: ./src/main.ts');
    console.log('    [Hook] 开始加载: ./src/main.ts');
    console.log('    [Hook] 加载完成: ./src/main.ts, 内容长度: 14');
    console.log('  [Lifecycle] 转换源码');
    console.log('    [Hook] 转换源码，长度: 12');
    console.log('  [Lifecycle] 生成资源');
    console.log('    [Hook] 处理 1 个资源文件');
    console.log('  [Lifecycle] 生成完成\n');
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
        // 自定义 Loader 示例
        {
          test: /\.custom$/,
          loader: path.resolve(__dirname, 'src/loaders/custom-loader.js'),
        },
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
        title: 'Webpack5 原理深入 Demo',
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
        __APP_NAME__: JSON.stringify('Webpack5 原理 Demo'),
        __APP_VERSION__: JSON.stringify('1.0.0'),
      }),

      // 应用自定义插件
      new BuildProcessPlugin(),
      new StatsPlugin(),
      new CustomAssetPlugin(),

      // 打包分析工具
      ...(isAnalyze ? [new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true,
      })] : []),
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
