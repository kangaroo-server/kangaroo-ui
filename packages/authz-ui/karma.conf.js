/*
 * Copyright (c) 2018 Michael Krotscheck
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const commonConfig = require('../../karma.conf');

module.exports = function (config) {

  config.set(commonConfig);

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),

      require('karma-chrome-launcher'),
      require('karma-webdriver-launcher'),
      require('karma-browserstack-launcher'),

      require('karma-junit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),

      require('@angular-devkit/build-angular/plugins/karma')
    ]
  });
};
