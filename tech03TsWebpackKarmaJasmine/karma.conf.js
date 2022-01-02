module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['./src/**/*.spec.ts'],
    preprocessors: {
      './src/**/*.spec.ts': ['webpack']
    },
    webpack: {
      resolve: {
          extensions: ['.ts','.js']
      },
    }
  });
};