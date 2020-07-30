module.exports = function (config) {
  config.set({

    frameworks: ['jasmine', 'karma-typescript'],

    files: [
      'src/app/**/*.ts',
    ],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    reporters: ['progress', 'karma-typescript'],

    browsers: ['ChromeHeadless'],

    logLevel: config.LOG_INFO,

    singleRun: true,

    karmaTypescriptConfig: {
      bundlerOptions: {
        noParse: 'jquery',
        entrypoints: /\.spec\.ts$/,
      },
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
      reports: {
        text: '',
      },
    },
  });
};
