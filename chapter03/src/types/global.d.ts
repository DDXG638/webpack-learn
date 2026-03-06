// 全局变量类型声明 - 由 DefinePlugin 注入
declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
declare const __FEATURE_FLAGS__: {
  enableNewUI: boolean;
  enableAnalytics: boolean;
};

// process 变量类型声明 - DefinePlugin 注入的环境变量
declare const process: {
  env: {
    NODE_ENV: string;
    DEBUG: string;
    [key: string]: string | undefined;
  };
};
