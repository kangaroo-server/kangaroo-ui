// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const commonConfig = require('../common/karma.conf');

module.exports = function (config) {

  config.set(commonConfig);

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),

      require('karma-chrome-launcher'),
      require('karma-webdriver-launcher'),
      require('karma-browserstack-launcher'),

      require('karma-junit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),

      require('@angular/cli/plugins/karma')
    ],
    angularCli: {
      environment: 'dev'
    }
  });
};
