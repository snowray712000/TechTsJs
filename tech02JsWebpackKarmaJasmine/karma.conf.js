module.exports = function(config) {
    config.set({
        files: ['./src/**/*.spec.js'],
        frameworks: ['jasmine'],
        preprocessors: {
            './src/*.spec.js': ['webpack']
        },
        webpack: {}
    });
}

  