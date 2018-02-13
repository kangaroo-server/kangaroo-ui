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

/**
 * The default configuration
 */

module.exports = {
    /**
     * Server configuration
     */
    basePath: '',
    protocol: 'http',
    hostname: 'localhost',
    port: 9876,

    /**
     * Test configuration
     */
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 5,
    browserNoActivityTimeout: 10000,
    captureTimeout: 60000,
    colors: true,
    autoWatch: true,
    singleRun: false,

    /**
     * Mime types, for map.js files.
     */
    mime: {'text/x-typescript': ['ts', 'tsx']},

    /**
     * Browser launchers.
     */
    concurrency: 5,
    customLaunchers: {
        'chrome-headless': {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox', '--disable-web-security', '--disable-gpu']
        }
    },
    browsers: ['chrome-headless'],

    /**
     * Reporters and configuration setup.
     */
    coverageIstanbulReporter: {
        dir: './reports',
        reports: ['html', 'cobertura', 'text-summary'],
        fixWebpackSourcePaths: true,
        'report-config': {
            html: {
                subdir: 'html'
            },
            cobertura: {
                file: 'cobertura.xml'
            }
        }
    },
    karmaTypescriptConfig: {
        coverageOptions: {
            exclude: /spec\.ts$/i
        },
        reports: {
            html: {
                directory: '.',
                subdirectory: 'reports'
            },
            cobertura: {
                directory: 'reports/cobertura',
                filename: 'cobertura.xml'
            },
            "text-summary": ""
        }
    },
    junitReporter: {
        outputDir: './reports/junit'
    },
    specReporter: {
        maxLogLines: 5,
        suppressErrorSummary: true,
        suppressFailed: false,
        suppressPassed: false,
        suppressSkipped: true,
        showSpecTiming: true
    },
    reporters: ['spec', 'junit', 'coverage-istanbul'],
    angularCli: {
        environment: 'dev'
    }
};