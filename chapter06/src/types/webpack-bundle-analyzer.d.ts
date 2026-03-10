declare module 'webpack-bundle-analyzer' {
  import { Plugin } from 'webpack';

  interface BundleAnalyzerPluginOptions {
    analyzerMode?: 'server' | 'static' | 'json' | 'disabled';
    analyzerHost?: string;
    analyzerPort?: number | 'auto';
    reportFilename?: string;
    openAnalyzer?: boolean;
    generateStatsFile?: boolean;
    statsFilename?: string;
    statsOptions?: null | {
      source?: boolean;
      modules?: boolean;
      children?: boolean;
      chunks?: boolean;
      chunkModules?: boolean;
      relations?: boolean;
      errors?: boolean;
      errorDetails?: boolean;
      reasons?: boolean;
      publicPath?: boolean;
      providedExports?: boolean;
      optimizationBailout?: boolean;
    };
    logLevel?: 'info' | 'warn' | 'error' | 'silent';
  }

  class BundleAnalyzerPlugin extends Plugin {
    constructor(options?: BundleAnalyzerPluginOptions);
  }

  export = BundleAnalyzerPlugin;
}
