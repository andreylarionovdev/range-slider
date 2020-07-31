const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'coverage-istanbul'],
    files: [
      { pattern: 'src/**/*.spec.ts', watched: false },
      { pattern: 'node_modules/jquery/dist/jquery.min.js', watched: false },
    ],
    preprocessors: {
      'src/**/*.ts': ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    coverageIstanbulReporter: {
      reports: ['text'],
      fixWebpackSourcePaths: true,
    },
    singleRun: true,
  });
};
