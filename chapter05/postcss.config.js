module.exports = (ctx) => {
  return {
    plugins: [
      require('postcss-preset-env'),
      // 仅在生产环境启用 CSS 压缩
      ctx.env === 'production' ? require('cssnano')({ preset: 'default' }) : false,
    ].filter(Boolean),
  };
};
