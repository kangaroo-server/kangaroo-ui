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
import { inject, TestBed } from '@angular/core/testing';

import * as all from './index';
import { LoggerModule } from './index';
import { Logger } from './logger';
import { LOGGING_BACKEND, LoggingBackend } from './logging-backend';
import { ConsoleLogger } from '@kangaroo/angular-logger/src/console-logger';

/**
 * Unit tests for the LoggerModule
 */
describe('LoggerModule', () => {

  const expectedExports = [
    'LoggerModule',
    'Logger',
    'LOGGING_BACKEND'
  ];

  expectedExports.forEach((name) => {
    it(`should export ${name}`, () => {
      expect(all.hasOwnProperty(name)).toBeTruthy();
    });
  });

  it('should only export expected properties', () => {
    Object.keys(all).forEach((name) => {
      expect(expectedExports.indexOf(name)).not.toEqual(-1, `Unexpected export found: ${name}`);
    });
  });

  describe('when imported', () => {

    const defaultBackend: LoggingBackend = {
      log: () => {
      },
      debug: () => {
      },
      error: () => {
      },
      warn: () => {
      },
      info: () => {
      }
    };

    describe('as root', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            LoggerModule.forRoot()
          ],
          providers: [
            {provide: LOGGING_BACKEND, useValue: defaultBackend, multi: true}
          ]
        }).compileComponents();
      });

      it('should inject all provided loggers.',
        inject([ LOGGING_BACKEND ], (endpoints) => {
          expect(endpoints.length).toBe(2);
          expect(endpoints).toContain(defaultBackend);
          expect(endpoints.filter((l) => (l instanceof ConsoleLogger)).length).toBe(1);
        }));

      it('should provide a logger',
        inject([ Logger ], (logger) => {
          expect(logger).toBeDefined();
        }));

      it('should provide a logger with a ROOT namespace',
        inject([ Logger, LOGGING_BACKEND ], (logger, endpoints) => {
          const consoleLogger: ConsoleLogger = endpoints.filter((l) => (l instanceof ConsoleLogger))[ 0 ];
          const logSpy: jasmine.Spy = spyOn(consoleLogger, 'log');
          expect(logger.namespace).toBe('ROOT');

          logger.log('Something');

          expect(logSpy).toHaveBeenCalledWith('ROOT', 'Something');
        }));
    });
  });

  describe('as module', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          LoggerModule.forModule('MyModule')
        ]
      }).compileComponents();
    });

    it('should inject no loggers.',
      () => {
        const endpoints = TestBed.get(LOGGING_BACKEND, []);
        expect(endpoints.length).toBe(0);
      });

    it('should provide a logger with a namespace',
      inject([ Logger ], (logger) => {
        expect(logger).toBeDefined();
        expect(logger.namespace).toBe('MyModule');
        logger.log('result');
      }));
  });
});
