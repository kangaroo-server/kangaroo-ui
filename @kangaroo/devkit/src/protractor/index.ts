// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

import { register } from 'ts-node';
import { SpecReporter } from 'jasmine-spec-reporter';

register();

module.exports = {
  allScriptsTimeout: 11000,
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [ '--headless', '--disable-gpu', '--window-size=1024,768' ]
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {
    }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  }
};
